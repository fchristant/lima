import { useState } from "react";
import { useInterval } from '@hooks/useInterval'
import { HueLight } from "types/hue";
import LightItem from "@components/Light/Light";

interface LightListProps {
  group?: string[] | null;
}

export default function LightList({ group }: LightListProps) {
  const [lights, setLights] = useState<HueLight[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pollingInterval = 400;

  const ENDPOINT = `${process.env.NEXT_PUBLIC_HUE_API_ADDRESS}/api/${process.env.NEXT_PUBLIC_HUE_API_USERNAME}/lights`

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
    } 
    catch (err:any) { setError(err.message || "Error loading data from Hue Bridge."); } 
    finally { setIsLoading(false);}
  };

  const normalizeLightData = (data: Record<string, any>, group?: string[]): HueLight[] => {
    return Object.entries(data)
      .map(([num, lightData]) => ({ ...lightData, num }))
      .filter((light) => (!group || group.includes(light.num)));
  };

  useInterval(() => {
    if (!error) fetchLightData();
  }, pollingInterval);

  return (
    <>
      {error && <p>{error}</p>}
      {isLoading && <p>loading lights...</p>}
      {lights && <div>{lights.map(light => <LightItem light={light} key={light.num} />)}</div>}
    </>
  );
}
