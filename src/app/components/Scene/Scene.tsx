import { HueScene } from "types/hue";
import "@styles/components/scene.css";

interface SceneProps {
  scene: HueScene;
}

export default function Scene({ scene }: SceneProps) {
  const { num, name, type } = scene;

  return <button className="scene">{name}</button>;
}
