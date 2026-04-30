"use client";

import { Suspense } from "react";
import ScrollToHash from "./ScrollToHash";

export default function ScrollToHashWrapper() {
  return (
    <Suspense fallback={null}>
      <ScrollToHash />
    </Suspense>
  );
}
