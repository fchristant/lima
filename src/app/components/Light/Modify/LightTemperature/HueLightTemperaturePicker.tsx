"use client";

import './huelighttemperaturepicker.css'
import { useEffect, useMemo, useRef, useState } from 'react';
import throttle from 'lodash.throttle';

export default function HueLightTemperaturePicker(props: { light: string, currentTemperature: number, enable:boolean }) {

   // track the color picked by the user
   const [pickTemperature, setTemperature] = useState(props?.currentTemperature);

    const updateLight = (temperature:number) => {

       // make a PUT call to the Hue API
       const bodyData = { 
         ct: temperature
      };

      fetch(process.env.NEXT_PUBLIC_HUE_API_ADDRESS + '/api/' + process.env.NEXT_PUBLIC_HUE_API_USERNAME + '/lights/' + props?.light + '/state', {
         method: 'PUT', 
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(bodyData)
      })
      .then(response => response.json())
      .then(data => {
         if (data[0]?.error) {
            /* the Hue V1 API returns a 200 code even when there is an error
            so we need to check the error object of the response to detect
            a failure */
            console.error('Error:', data[0]?.error?.description);
         }
      })
      .catch(error => {
         console.error('Error:', error);
      });

    }

    /* 
    because the onchange event of the input element fires many events,
    we throttle the amount of API requests.
    inspiration: https://stackblitz.com/edit/react-lodash-throttle?file=src%2FApp.js
    */

    const makeApiRequestThrottled = useRef(throttle(updateLight, 300));

    const handleChange = (event:any) => {
      setTemperature(parseInt(event?.target?.value))
      makeApiRequestThrottled.current(parseInt(event?.target?.value));
    };

   return (
      <div>
         T <input type="range" className="hue-light-temperature-picker" min="153" max="500" value={pickTemperature} onChange={handleChange} disabled={!props?.enable}  />
      </div>
     )
}
