import { HueScene } from "types/hue";
import "@styles/components/scene.css";

interface SceneProps {
  scene: HueScene;
}

export default function Scene({ scene }: SceneProps) {
  const { num, name, type, group } = scene;
  const ENDPOINT = `${process.env.NEXT_PUBLIC_HUE_API_ADDRESS}/api/${process.env.NEXT_PUBLIC_HUE_API_USERNAME}/groups/${group}/action`;

  async function recallScene(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const bodyData = { scene: num };
    try {
      const response = await fetch(ENDPOINT, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();

      if (data[0]?.error) {
        console.error("Error:", data[0].error.description);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <button className="scene" onClick={recallScene}>
      {name}
    </button>
  );
}
