"use client";

import { useState } from "react";
import { useInterval} from '@hooks/useInterval'
import { Bulb } from "types/hue";
import HueLight from "@components/Light/Light/HueLight";

export default function HueLights(props: { group?: string[] | null }) {

   /* this component polls the Hue Bridge V1 API for 'lights' information
   and then renders 'light' child components to visualize them */

   const [lights, setLights] = useState< Bulb[] | null>(null);
   const [isLoading, setIsLoading] = useState(true);
   const [err, setErr] = useState<any>('');

   /* interval at which to make poll request to the API in milliseconds
   Do not go below 100 as this may overload the Hue Bridge */
   const pollingInterval = 200;

   function normalizeLightData(data: any) {

      let myLights: Bulb[] = [];
      Object.entries(data).forEach((light:any) => {

         /* 
         stamp the unique light id [0] on the light object [1]
         this is needed because write operations such as turning
         on/off a light require this light number
         */
         light[1].num = light[0];
         
         /* when a group filter is set, only add the light to the to-render
         array when it belongs to the group */
         if (props?.group) {
            if (props?.group.includes(light[1].num)) {
               myLights.push(light[1])
            }
         } else {
            myLights.push(light[1])
         }
      })
      return myLights;
   }

   useInterval(() => {
      const fetchLightData = async () => {
         try {
         // get light data from local Hue Bridge
         const result = await fetch(process.env.NEXT_PUBLIC_HUE_API_ADDRESS + '/api/' + process.env.NEXT_PUBLIC_HUE_API_USERNAME + '/lights');
         // convert network result to JSON
         const data = await result.json()
         
         if (data[0]?.error) {
            /* the Hue V1 API returns a 200 code even when there is an error
            so we need to check the error object of the response to detect
            a failure */
            setErr(data[0]?.error?.description)
         } else {
            // normalize data and save result in state
            setLights(normalizeLightData(data));
            setErr('')
         }
         } 
         catch(error:any) { 
            setErr(error? error.message : "Error loading data from Hue Bridge, please check the console for issues.") 
         }
         finally { setIsLoading(false) }
      };
      if (!err) {
         fetchLightData()
      }
    }, pollingInterval);

  return (
   <>
   { err? err : ""}
   { isLoading? <p>loading lights...</p> : ""}
   { lights ? <div>{lights.map(light =>( <HueLight light={light} key={light?.num} />))}</div> : ""}
   </>
  )
}
