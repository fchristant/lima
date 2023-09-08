"use client";

import './huelightcolorpicker.css'
import { hex2RGB, rgb2CIE } from '@utils/color';
import { useEffect, useState } from 'react';

interface HueLightColorPickerProps {
   light: string;
   currentColor: string;
   enable: boolean;
 }

export default function HueLightColorPicker({ light, currentColor, enable }: HueLightColorPickerProps) {

   // track the color picked by the user
   const [pickColor, setPickColor] = useState<number[]>([]);

   useEffect(() => { 
      if (pickColor && pickColor.length === 3 ) {
         updateLightColor();
      }
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [pickColor]); 

   async function updateLightColor() {

      const bodyData = { 
         bri: pickColor[2],
         xy: [pickColor[0], pickColor[1]]
      };

      const url = `${process.env.NEXT_PUBLIC_HUE_API_ADDRESS}/api/${process.env.NEXT_PUBLIC_HUE_API_USERNAME}/lights/${light}/state`;

      try {
         const response = await fetch(url, {
            method: 'PUT', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyData)
         });
         
         const data = await response.json();

         if (data[0]?.error) {
            console.error('Error:', data[0]?.error?.description);
         }
      } catch (error) {
         console.error('Error:', error);
      }
   }

   function changeColor(e: React.ChangeEvent<HTMLInputElement>) {
      const hexPicked = e.target.value;
      if (hexPicked) {
         const rgbPicked = hex2RGB(hexPicked);
         const ciePicked = rgb2CIE(rgbPicked[0], rgbPicked[1], rgbPicked[2]);
         setPickColor(ciePicked);
      }
   }

  return (
   <input type="color" className="hue-light-color-picker" value={ currentColor } onChange={ changeColor} disabled={!enable} />
  )
}
