import HueLights from "./hue/HueLights"
import HueBridge from "./hue/HueBridge";
import HueGroups from "./hue/HueGroups";

export default function Home() {
  return (
   <HueBridge>
      <HueGroups/>
   </HueBridge>
  )
}
