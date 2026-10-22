"use client";

import dynamic from "next/dynamic";

// These are purely decorative layers. Loading them separately lets the content,
// navigation, and first interaction become available before GPU work begins.
const CinematicWorld3D = dynamic(() => import("./CinematicWorld3D"), {
  ssr: false,
});
const FallingLeaves = dynamic(() => import("./FallingLeaves"), {
  ssr: false,
});

export default function AmbientEffects() {
  return (
    <>
      <CinematicWorld3D />
      <FallingLeaves />
    </>
  );
}
