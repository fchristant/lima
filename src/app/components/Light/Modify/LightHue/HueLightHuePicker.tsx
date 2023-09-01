"use client";

import './huelighthuepicker.css'
import { useEffect, useRef, useState } from 'react';
import throttle from 'lodash.throttle';

export default function HueLightHuePicker(props: { light: string, currentHue: number, enable:boolean }) {

   // track the color picked by the user
   const [pickHue, setHue] = useState(props?.currentHue);

   useEffect(() => { 
      setHue(props?.currentHue)
    }, [props?.currentHue]);

    const updateLight = (hue:number) => {

       // make a PUT call to the Hue API
       const bodyData = { 
         hue: hue
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

    const makeApiRequestThrottled = useRef(throttle(updateLight, 100));

    const handleChange = (event:any) => {
      setHue(parseInt(event?.target?.value))
      makeApiRequestThrottled.current(parseInt(event?.target?.value));
    };

   return (
      <div>
         H <input type="range" className="hue-light-saturation-picker" min="0" max="65535" value={pickHue} onChange={handleChange} disabled={!props?.enable}  />
      </div>
     )
}
