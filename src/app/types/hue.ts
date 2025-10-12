type HueLight = {
  num: string;
  uniqueid: string;
  name: string;
  state: {
    on: boolean;
    reachable: boolean;
    colormode: string;
    ct: number;
    bri: number;
    hue: number;
    sat: number;
    xy: any;
  };
};

type HueGroup = {
  num: string;
  name: string;
  lights: [];
  type: string;
  state: {
    any_on: boolean;
  };
};

type HueSceneLightState = {
  on: boolean;
  bri?: number;
  xy?: [number, number];
  ct?: number;
  hue?: number;
  sat?: number;
};

type HueScene = {
  num: string;
  name: string;
  type: string;
  group: string;
  lightstates?: Record<string, HueSceneLightState>;
};

export type { HueLight, HueGroup, HueScene, HueSceneLightState };
