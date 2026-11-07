import React from "react";
import { HalftoneWordmarkFooter } from "@/components/ui/halftone-wordmark-footer";

export function Footer() {
  return (
    <HalftoneWordmarkFooter
      wordmark="GDG • BPPIMT, KOLKATA"
      label="GDG on Campus BPPIMT"
      meta="B.P. Poddar Institute of Management and Technology • Kolkata"
      dotGap={6}
      radius={95}
      height="100dvh"
    />
  );
}
