"use client";

import { useState, useEffect } from "react";
import { useInterval} from '../hooks/useInterval'
import { Bulb } from "../types/types";
import HueLight from "./HueLight";

export default function HueLights() {

   /* this component polls the Hue Bridge V1 API for 'lights' information
   and then renders 'light' child components to visualize them */

   const [lights, setLights] = useState< Bulb[] | null>(null);
   const [isLoading, setIsLoading] = useState(true);
   const [err, setErr] = useState('');

   /* interval at which to make poll request to the API in milliseconds
   Do not go below 100 as this may overload the Hue Bridge */
   const pollingInterval = 1000;

   function normalizeLightData(data: any) {
      let myLights: Bulb[] = [];
      Object.entries(data).forEach((light:any) => {
         /* 
         stamp the unique light id [0] on the light object [1]
         this is needed because write operations such as turning
         on/off a light require this light number
         */
         light[1].num = light[0];
         // push combined object to result array
         let myBulb:Bulb = light[1];
         myLights.push(light[1])
      }
      )
      return myLights;
   }

   useInterval(() => {
      const fetchLightData = async () => {
         try {
         // get light data from local Hue Bridge
         const result = await fetch('https://' + process.env.NEXT_PUBLIC_HUE_IP + '/api/' + process.env.NEXT_PUBLIC_HUE_USERNAME + '/lights');
         // convert network result to JSON
         const data = await result.json()
         // normalize data and save result in state
         setLights(normalizeLightData(data));
         setErr('')
         } 
         catch(error) { setErr("Error loading data from Hue Bridge, please check the console for issues.") }
         finally { setIsLoading(false) }
      };
      fetchLightData()
    }, pollingInterval);

  return (
   <>
   { err? err : ""}
   { isLoading? <p>loading...</p> : ""}
   {lights ? <div>{lights.map(light =>( <HueLight light={light} key={light?.num} />))}</div> : ""}
   </>
  )
}
