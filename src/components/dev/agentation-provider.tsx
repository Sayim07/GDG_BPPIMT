"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import Agentation with SSR disabled so it only mounts on client in dev mode
const Agentation = dynamic(
  () => import("agentation").then((mod) => mod.Agentation),
  { ssr: false }
);

export function AgentationProvider() {
  const [isDev, setIsDev] = useState(false);

  useEffect(() => {
    // Only activate in local development environment (localhost / 127.0.0.1)
    // Never active on production / Vercel deployment
    if (
      process.env.NODE_ENV === "development" &&
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.hostname.startsWith("192.168.") ||
        window.location.hostname.startsWith("10."))
    ) {
      setIsDev(true);
    }
  }, []);

  // Strict check: if not development or not localhost, render nothing
  if (process.env.NODE_ENV !== "development" || !isDev) {
    return null;
  }

  return (
    <Agentation
      appName="GDG on Campus BPPIMT"
      endpoint="http://localhost:4747"
      copyToClipboard={true}
    />
  );
}

