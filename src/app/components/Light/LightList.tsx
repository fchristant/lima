import { useEffect, useState } from "react";
import { useInterval } from "@hooks/useInterval";
import { HueLight } from "types/hue";
import Light from "@components/Light/Light";
import lightsOrder from "@customize/grouplightorder";

interface LightListProps {
  group?: string[] | null;
  groupNum: string | null;
}

export default function LightList({ group, groupNum }: LightListProps) {
  const [lights, setLights] = useState<HueLight[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pollingInterval = 300;

  const ENDPOINT = `${process.env.NEXT_PUBLIC_HUE_API_ADDRESS}/api/${process.env.NEXT_PUBLIC_HUE_API_USERNAME}/lights`;

  const fetchLightData = async () => {
    try {
      const response = await fetch(ENDPOINT);
      const data = await response.json();

      if (data[0]?.error) {
        setError(data[0]?.error?.description || "Error from Hue V1 API");
      } else {
        setLights(normalizeLightData(data, group ?? undefined));
        setError(null);
      }
    } catch (err: any) {
      setError(err.message || "Error loading data from Hue Bridge.");
    } finally {
      setIsLoading(false);
    }
  };

  const normalizeLightData = (
    data: Record<string, any>,
    group?: string[]
  ): HueLight[] => {
    const customOrder = lightsOrder.find((group) => group.groupID === groupNum);

    return Object.entries(data)
      .map(([num, lightData]) => ({ ...lightData, num }))
      .filter((light) => !group || group.includes(light.num))
      .sort((a, b) => {
        return customOrder !== undefined
          ? customOrder.lights.indexOf(a.num) -
              customOrder.lights.indexOf(b.num)
          : a.num - b.num;
      });
  };

  useEffect(() => {
    if (!error) fetchLightData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useInterval(() => {
    if (!error) fetchLightData();
  }, pollingInterval);

  return (
    <>
      {error && <p>{error}</p>}
      {isLoading && <p>loading lights...</p>}
      {lights && (
        <div>
          {lights.map((light) => (
            <Light light={light} key={light.num} />
          ))}
        </div>
      )}
    </>
  );
}
