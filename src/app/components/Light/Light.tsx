"use client";

import { CSSProperties, memo, useEffect, useRef } from 'react';
import '@styles/components/light.css'
import { cie2RGB,mired2Kelvin, kelvin2RGB, rgb2Hex } from '@utils/color';
import { HueLight } from 'types/hue';
import LightToggle from '@components/Light/LightToggle';
import LightColorPicker from '@components/Light/LightColorPicker';
import LightControl from '@components/Light/LightControl';

// add custom CSS property type checking
 type MyCustomCSS = CSSProperties & Record<`--${string}`, number | string>;

 interface LightProps {
   light: HueLight
 }

const Light = memo(function HueLight({ light }: LightProps) {

   /* 
   track whether this is a first render or a subsequent re-render
   this is used to not render a CSS animation on the initial render,
   whilst running it on any subsequent render
   */
   const isRerender = useRef(false);
   useEffect(() => { isRerender.current = true; }, []);

   const { state, name, num } = light;
   const { on, reachable, xy, ct, bri } = state;
   const isAvailable = on && reachable;

   const lampColor = calculateLampColor(state);

   const cardStyle: MyCustomCSS = {
      opacity: reachable ? "1" : "0.3",
      borderColor: lampColor,
   };

   const spotStyle: MyCustomCSS = {
      opacity: reachable ? "1" : "0.3",
      color: lampColor,
      '--a': calculateBrightnessDegree(bri, isAvailable) + 'deg'
   };
   
  return (
 
   <div className='light' style={cardStyle}>

      {name} ({light?.num})
    
      <div className="light__spot" style={spotStyle}>
         <div className={isRerender.current? ' light--highlight' : ''} key={Math.random()}></div>
      </div>

      <LightToggle light={num} on={on} reachable={reachable} />
      <LightColorPicker light={num} currentColor={lampColor} enable={xy && isAvailable} />
      <LightControl light={num} currentValue={ct} enable={!xy && isAvailable} min={153} max={500} attribute="ct" className="hue-light-brightness-picker" />
      <LightControl light={num} currentValue={bri} enable={isAvailable} min={1} max={254} attribute="bri" className="hue-light-temperature-picker" />
      <LightControl light={num} currentValue={state.sat} enable={xy && isAvailable} min={0} max={254} attribute="sat" className="hue-light-saturation-picker" />
      <LightControl light={num} currentValue={state.hue} enable={xy && isAvailable} min={0} max={65535} attribute="hue" className="hue-light-hue-picker" />

   </div>
  )
}, didLightStateChange);

function didLightStateChange(prevProps: any, nextProps: any) {
   return JSON.stringify(prevProps) === JSON.stringify(nextProps);
}

function calculateLampColor(state: any) {
   const { on, reachable, xy, ct, colormode, bri } = state;

   if (!on || !reachable || bri === 0) { return '#333333'; }

   if (colormode === 'ct' && !xy) {
       const lampKelvin = mired2Kelvin(ct);
       const kRGB = kelvin2RGB(lampKelvin);
       return rgb2Hex(kRGB[0], kRGB[1], kRGB[2]);
   }

   if (xy && bri) {
       const lampColorRGB = cie2RGB(xy[0], xy[1], bri);
       return rgb2Hex(lampColorRGB.r, lampColorRGB.g, lampColorRGB.b);
   }

   return '#333333';
}

function calculateBrightnessDegree(bri: number, isAvailable: boolean) {
   if (!isAvailable || bri === 0) { return 1; }
   return Math.max(10, Math.round((360 / 255) * bri));
}

export default Light