type HueLight = {
   num: string,
   uniqueid: string,
   name: string
   state: {
      on: boolean,
      reachable: boolean,
      colormode: string,
      ct: number,
      bri: number,
      hue: number,
      sat: number,
      xy: any
   }
}

type HueGroup = {
   num: string,
   name: string,
   lights: [],
   type: string
   state: {
      any_on: boolean
   }
}

export type {HueLight, HueGroup}