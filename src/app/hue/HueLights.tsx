"use client";

import { useState, useEffect } from "react";
import { useInterval} from '../hooks/useInterval'
import HueLight from "./HueLight";

export default function HueLights() {

   /* this component polls the Hue Bridge V1 API for 'lights' information
   and then renders 'light' child components to visualize them */

   const [lights, setLights] = useState(null)
   const [isLoading, setIsLoading] = useState(true);
   const [err, setErr] = useState('');

   /* interval at which to make poll request to the API in milliseconds
   Do not go below 100 as this may overload the Hue Bridge */
   const pollingInterval = 1000;

   function normalizeLightData(data: any) {
      let myLights: unknown[] = [];
      Object.entries(data).forEach((light) => {
         myLights.push(light[1])
      }
      )
      return myLights;
   }

   useInterval(() => {
      const fetchLightData = async () => {
         try {
         // get light data from local Hue Bridge
         const result = await fetch('http://' + process.env.NEXT_PUBLIC_HUE_IP + '/api/' + process.env.NEXT_PUBLIC_HUE_USERNAME + '/lights');
         // convert network result to JSON
         const data = await result.json()
         // normalize data and save result in state
         setLights(normalizeLightData(data));
         setErr('')
         } 
         catch(error) {
            setErr("Error loading data from Hue Bridge, please check the console for issues.");
            setIsLoading(false)
         }
      };
      fetchLightData()
    }, pollingInterval);

  return (
   <>
   { err? err : ""}
   { isLoading? <p>loadingggg......</p> : ""}
   {lights ? <div>{lights.map(light =>( <HueLight light={light} key={light?.uniqueid} />))}</div> : ""}
   </>
  )
}
