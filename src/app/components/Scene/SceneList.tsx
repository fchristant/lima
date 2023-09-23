import { memo, useEffect, useState } from "react";
import { HueScene } from "types/hue";
import Scene from "@components/Scene/Scene";

interface SceneListProps {
  groupNum: string | null;
}

const ENDPOINT = `${process.env.NEXT_PUBLIC_HUE_API_ADDRESS}/api/${process.env.NEXT_PUBLIC_HUE_API_USERNAME}/scenes`;

const SceneList = memo(function SceneList({ groupNum }: SceneListProps) {
  const [sceneData, setSceneData] = useState(null);
  const [scenes, setScenes] = useState<HueScene[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchScenesData = async () => {
    try {
      const response = await fetch(ENDPOINT);
      const data = await response.json();

      if (data[0]?.error) {
        setError(data[0]?.error?.description || "Error from Hue V1 API");
      } else {
        //setScenes(normalizeScenesData(data, groupNum ?? undefined));
        setSceneData(data);
        setError(null);
      }
    } catch (err: any) {
      setError(err.message || "Error loading scene data from Hue Bridge.");
    } finally {
      setIsLoading(false);
    }
  };

  const normalizeScenesData = (data: Record<string, any>): HueScene[] => {
    return Object.entries(data)
      .map(([num, sceneData]) => ({
        ...sceneData,
        num,
      }))
      .filter((scene) => scene.group === groupNum);
  };

  useEffect(() => {
    if (!error) fetchScenesData();
  }, [error]);

  useEffect(() => {
    if (sceneData && !isLoading) {
      setScenes(normalizeScenesData(sceneData));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupNum, isLoading]);

  return (
    <>
      {error && <p>{error}</p>}
      {isLoading && <p>loading scenes...</p>}
      {scenes && (
        <div>
          <h2>Scenes</h2>

          {scenes.map((scene) => (
            <Scene key={scene.num} scene={scene} />
          ))}
        </div>
      )}
    </>
  );
});

export default SceneList;
