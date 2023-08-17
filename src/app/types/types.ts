type Bulb = {
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
      xy: number[]
   }
}

export type {Bulb}