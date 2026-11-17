"use client";

import { useEffect, useRef, useState } from "react";

export type FrameSet = {
  /** Total frames in the clip; 0 until its metadata has loaded. */
  count: number;
  frames: (ImageBitmap | undefined)[];
};

type Options = {
  /** Horizontal crop as fractions of the source width. */
  crop: { x: number; width: number };
  /** Frames are downscaled to at most this height to keep memory in check. */
  maxHeight: number;
  /** Frame rate the clips were exported at. */
  fps?: number;
};

/**
 * Decodes every frame of each short clip into ImageBitmaps so they can be drawn
 * at any angle instantly. Seeking a <video> directly stutters because the
 * turntable clips only have a couple of keyframes.
 *
 * Clips decode one after another, in order, and fill in as they go. `loaded`
 * counts decoded frames across all clips.
 */
export function useVideoFrames(sources: string[], { crop, maxHeight, fps = 30 }: Options) {
  const framesRef = useRef<FrameSet[]>([]);
  const [loaded, setLoaded] = useState(0);
  const sourceKey = sources.join("\n");

  useEffect(() => {
    let cancelled = false;
    let decoded = 0;
    const sets: FrameSet[] = sourceKey.split("\n").map(() => ({ count: 0, frames: [] }));
    framesRef.current = sets;

    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";

    const waitFor = (event: "loadeddata" | "seeked") =>
      new Promise<void>((resolve, reject) => {
        const onDone = () => {
          video.removeEventListener("error", onError);
          resolve();
        };
        const onError = () => {
          video.removeEventListener(event, onDone);
          reject(video.error);
        };
        video.addEventListener(event, onDone, { once: true });
        video.addEventListener("error", onError, { once: true });
      });

    const decode = async (src: string, set: FrameSet) => {
      const ready = waitFor("loadeddata");
      video.src = src;
      await ready;
      if (cancelled) return;

      const total = Math.max(1, Math.round(video.duration * fps));
      const sx = Math.round(video.videoWidth * crop.x);
      const sw = Math.round(video.videoWidth * crop.width);
      const sh = video.videoHeight;
      const outHeight = Math.min(sh, maxHeight);
      const outWidth = Math.round((sw * outHeight) / sh);
      set.count = total;

      for (let i = 0; i < total; i++) {
        // Aim for the middle of each frame so rounding never lands on its neighbour.
        const seeked = waitFor("seeked");
        video.currentTime = (i + 0.5) / fps;
        await seeked;
        if (cancelled) return;

        const bitmap = await createImageBitmap(video, sx, 0, sw, sh, {
          resizeWidth: outWidth,
          resizeHeight: outHeight,
          resizeQuality: "high",
        });
        if (cancelled) {
          bitmap.close();
          return;
        }
        set.frames[i] = bitmap;
        setLoaded(++decoded);
      }
    };

    (async () => {
      const list = sourceKey.split("\n");
      for (let i = 0; i < list.length && !cancelled; i++) {
        // A clip that fails to load leaves its set empty; the stage skips it.
        await decode(list[i], sets[i]).catch(() => {});
      }
    })();

    return () => {
      cancelled = true;
      video.removeAttribute("src");
      video.load();
      sets.forEach((set) => set.frames.forEach((frame) => frame?.close()));
      setLoaded(0);
    };
  }, [sourceKey, crop.x, crop.width, maxHeight, fps]);

  return { framesRef, loaded };
}
