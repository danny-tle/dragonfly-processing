"use client";

import { useState } from "react";
import { confirmAge } from "@/app/actions";

export function AgeGate() {

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-6 backdrop-blur-sm"
    >
      <div className="w-full max-w-md rounded-2xl bg-background p-10 text-center text-foreground shadow-xl">
        <p className="text-2xl font-medium text-primary">Dragonfly</p>
       : 
          <>
            <h2 id="age-gate-title" className="mt-8 text-2xl font-semibold">
              Are you 21 or older?
            </h2>
            <p className="mt-3 text-sm text-muted">
              This site is intended for registered Utah medical cannabis patients and adults 21+.
            </p>

            <form action={confirmAge} className="mt-8 flex flex-col gap-3">
              <button
                type="submit"
                className="rounded-full bg-primary px-6 py-3 font-medium text-on-primary transition-opacity hover:opacity-90"
              >
                Yes, I&apos;m 21+
              </button>
              <button
                type="button"
                onClick={() => {
                window.location.href = "https://google.com";
              }}
  className="rounded-full border border-border px-6 py-3 font-medium transition-colors hover:bg-surface"
>
  No
</button>
            </form>
          </>
      </div>
    </div>
  );
}
