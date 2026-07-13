"use client";

import { useEffect } from "react";

export function OfflineWorker() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      // Relative scope works both locally and under GitHub Pages' project path.
      navigator.serviceWorker
        .register("./sw.js", { updateViaCache: "none" })
        .then((registration) => registration.update())
        .catch(() => undefined);
    }
  }, []);

  return null;
}
