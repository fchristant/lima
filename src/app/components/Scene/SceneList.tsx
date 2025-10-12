import { memo, useCallback, useEffect, useState } from "react";
import { HueScene } from "types/hue";
import Scene from "@components/Scene/Scene";
import "@styles/components/scenelist.css";

interface SceneListProps {
  groupNum: string | null;
}

const ENDPOINT = `${process.env.NEXT_PUBLIC_HUE_API_ADDRESS}/api/${process.env.NEXT_PUBLIC_HUE_API_USERNAME}/scenes`;

const SceneList = memo(function SceneList({ groupNum }: SceneListProps) {
  const [sceneData, setSceneData] = useState<Record<string, any> | null>(null);
  const [scenes, setScenes] = useState<HueScene[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isHydratingScenes, setIsHydratingScenes] = useState(false);

  const fetchScenesData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(ENDPOINT);
      const data = await response.json();

      if (data[0]?.error) {
        setError(data[0]?.error?.description || "Error from Hue V1 API");
      } else {
        setSceneData(data);
        setError(null);
      }
    } catch (err: any) {
      setError(err.message || "Error loading scene data from Hue Bridge.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchScenesData();
  }, [fetchScenesData]);

  useEffect(() => {
    if (!sceneData || isLoading) return;
    if (!groupNum) {
      setScenes([]);
      return;
    }

    const entries = Object.entries(sceneData as Record<string, any>);
    const normalizedScenes = entries
      .map(([num, sceneDetails]) => ({
        ...sceneDetails,
        num,
      }))
      .filter((scene) => scene.group === groupNum) as HueScene[];
    if (!normalizedScenes.length) {
      setScenes([]);
      return;
    }

    let isCancelled = false;

    async function hydrateScenesWithLightstates() {
      setIsHydratingScenes(true);
      try {
        const hydratedScenes = await Promise.all(
          normalizedScenes.map(async (scene) => {
            if (scene.lightstates) return scene;

            try {
              const response = await fetch(`${ENDPOINT}/${scene.num}`);
              if (!response.ok) {
                throw new Error(
                  `Failed to load detailed scene data for ${scene.num}.`
                );
              }
              const detailedScene = await response.json();
              return {
                ...scene,
                lightstates: detailedScene.lightstates ?? scene.lightstates,
              };
            } catch (detailErr) {
              console.error(detailErr);
              return scene;
            }
          })
        );

        if (!isCancelled) {
          setScenes(hydratedScenes);
        }
      } finally {
        if (!isCancelled) {
          setIsHydratingScenes(false);
        }
      }
    }

    hydrateScenesWithLightstates();

    return () => {
      isCancelled = true;
    };
  }, [groupNum, isLoading, sceneData]);

  return (
    <div className="scene-list">
      {error && <p>{error}</p>}
      {(isLoading || isHydratingScenes) && <p>loading scenes...</p>}
      {scenes && scenes.length > 0 && (
        <div>
          {scenes.map((scene) => (
            <Scene key={scene.num} scene={scene} />
          ))}
        </div>
      )}
      {scenes && scenes.length === 0 && !isLoading && !isHydratingScenes && (
        <p>no scenes available.</p>
      )}
    </div>
  );
});

export default SceneList;
