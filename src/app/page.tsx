"use client";

import HueLights from "./hue/HueLights"
import HueBridge from "./hue/HueBridge";

export default function Home() {
  return (
   <HueBridge>
      <HueLights/>
   </HueBridge>
  )
}
