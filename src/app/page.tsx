import HueBridge from "./components/Bridge/HueBridge";
import HueGroups from "./components/Group/Groups/HueGroups";

export default function Home() {
  return (
   <HueBridge>
      <HueGroups/>
   </HueBridge>
  )
}
