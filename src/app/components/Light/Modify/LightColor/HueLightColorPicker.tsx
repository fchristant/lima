"use client";

import './huelightcolorpicker.css'
import { hex2RGB, rgb2CIE } from '../../../../utils/color';
import { useEffect, useState } from 'react';

export default function HueLightColorPicker(props: { light: string, currentColor: string, enable:boolean }) {

   // track the color picked by the user
   const [pickColor, setPickColor] = useState<number[]>([]);

   useEffect(() => { 
      // whenever the picked color changes, make a PUT call
      if (pickColor.length > 0) {
      
         const bodyData = { 
            bri: pickColor[2],
            xy: [pickColor[0], pickColor[1]]
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
    }, [pickColor]);

   function changeColor(e:any) {
      // convert the picked color from hex to CIE and change state
      e.preventDefault();
      let hexPicked = e?.target?.value
      if (hexPicked) {
         let rgbPicked = hex2RGB(hexPicked);
         let ciePicked = rgb2CIE(rgbPicked[0], rgbPicked[1], rgbPicked[2])
         setPickColor(ciePicked)
      }
   }

  return (
   <input type="color" className="hue-light-color-picker" value={ props?.currentColor } onChange={ changeColor} disabled={!props?.enable} />
  )
}
