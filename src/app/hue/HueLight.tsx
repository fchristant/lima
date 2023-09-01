"use client";

import { CSSProperties, memo, useEffect, useRef } from 'react';
import './huelight.css'
import { cie2RGB,mired2Kelvin, kelvin2RGB, rgb2Hex } from '../utils/color';
import { Bulb } from '../types/types';
import HueLightSwitch from './HueLightSwitch';
import HueLightColorPicker from './HueLightColorPicker';
import HueLightTemperaturePicker from './HueLightTemperaturePicker';
import HueLightBrightnessPicker from './HueLightBrightnessPicker';
import HueLightSaturationPicker from './HueLightSaturationPicker';
import HueLightHuePicker from './HueLightHuePicker';

// add custom CSS property type checking
 type MyCustomCSS = CSSProperties & Record<`--${string}`, number | string>;

const HueLight = memo(function HueLight(props: { key: string, light: Bulb }) {

   /* 
   this component renders a visualization of a single light
   based on its state
   */

   /* 
   track whether this is a first render or a subsequent re-render
   this is used to not render a CSS animation on the initial render,
   whilst running it on any subsequent render
   */
   const isRerender = useRef(false);
   useEffect(() => { isRerender.current = true; }, []);

   // used to calculate on-screen RGB value of light
   let lampColor!:string;
   let showColorPicker:boolean = props?.light?.state?.on && props?.light?.state?.reachable && props?.light?.state?.xy
   let showTemperaturePicker:boolean = props?.light?.state?.on && props?.light?.state?.reachable && !props?.light?.state?.xy
   let showBrightnessPicker:boolean = props?.light?.state?.on && props?.light?.state?.reachable
   let showSaturationPicker:boolean = props?.light?.state?.on && props?.light?.state?.reachable && props?.light?.state?.xy
   let showHuePicker:boolean = props?.light?.state?.on && props?.light?.state?.reachable && props?.light?.state?.xy

   /* the 'ct' (color temperature) value of the light is expressed as 
   'mired', the below converts it into the Kelvin scale */
   let lampKelvin = mired2Kelvin(props?.light?.state?.ct);
   
   if (!props?.light?.state?.on || !props?.light?.state?.reachable || props?.light?.state?.bri === 0) {

      // if light is off, not reachable or on with zero brightness, render as gray/dull
      lampColor = '#333333';

   } else if (props?.light?.state?.colormode === 'ct' && !props?.light?.state?.xy) {
      
      /* when light is in color temperature (ct) color mode and has no xy output, assume it's a non-color bulb.
      this means we only have a color temperature value to work with */
      
      // convert kelvin to rgb
      let kRGB = kelvin2RGB(lampKelvin);
      /* kelvin to rgb does not take into account the lights' brightness, hence we use the rgb 'alpha'
      channel to mimick it */
      let brightness = props?.light?.state?.bri / 255;
      lampColor = rgb2Hex(kRGB[0], kRGB[1], kRGB[2])
      //lampColor = 'rgba(' + kRGB[0] + ', ' + kRGB[1] + ', ' +  kRGB[2] + ',' + brightness.toFixed(2) + ')';

   } else if (props?.light?.state?.xy && props?.light?.state?.bri) {
      
      // assume that this is a color bulb

      // convert xy color coordinate of the CIE color system to RGB
      let lampColorRGB = cie2RGB(props.light.state.xy[0],props.light.state.xy[1],props.light.state.bri);
      lampColor = rgb2Hex(lampColorRGB.r, lampColorRGB.g, lampColorRGB.b)
   }

   /* convert brightness to degrees, which will be used to render a dial-like
   conic gradient that communicates the brightness of the light on a 360 degree 
   circle */
   let deg
   if (!props?.light?.state?.on || !props?.light?.state?.reachable || props?.light?.state?.bri === 0) {
      // render default state for an inactive light (off, not reachable, or brightness zero)
      deg = 1
   } else {
      // calculate degrees, ensure a minimum of 10 deg for an attractive rendering
      deg = Math.max(10, Math.round((360 / 255) * props?.light?.state?.bri));
   }
   
  return (
 
   <div className='hue-light' style={{
      opacity: (!props?.light?.state?.reachable? "0.3" : "1"),
      borderColor: lampColor
      }}>

      {props?.light?.name}<hr/>
      Brightness: {props?.light?.state?.bri}<br/>
      Saturation: {props?.light?.state?.sat}<br/>
      Hue: {props?.light?.state?.hue}<br/>
      CT Kelvin: {lampKelvin}

      {/*
      Number: {props?.light?.num}<br/>
      State: {props?.light?.state?.on? "on" : "off"}<br/>
      Reachable: {props?.light?.state?.reachable? "true" : "false"}<br/>
      Brightness: {props?.light?.state?.bri}<br/>
      Hue: {props?.light?.state?.hue}<br/>
      Saturation: {props?.light?.state?.sat}<br/>
      CT Mired: {props?.light?.state?.ct}<br/>
      CT Kelvin: {lampKelvin}<br/>
      XY: {props?.light?.state?.xy}<br/>
      Color: {lampColor}
      */}
    
      <div className="hue-light__spot" style={{color: lampColor, '--a': deg + 'deg'} as MyCustomCSS}>
         {  /* 
         note: the random 'key' on this div ensures that React sees it as a new div each time this component re-renders
         this ensures that the 'highlight' animation is freshly started each time.
         */}
         <div className={isRerender.current? ' hue-light--highlight' : ''} key={Math.random()}></div>
      </div>
      <HueLightSwitch light={props?.light?.num} on={props?.light?.state?.on} reachable={props?.light?.state?.reachable} />
      <HueLightColorPicker light={props?.light?.num} currentColor={ lampColor } enable={showColorPicker} />
      <HueLightTemperaturePicker light={props?.light?.num} currentTemperature={ props?.light?.state?.ct } enable={showTemperaturePicker} />
      <HueLightBrightnessPicker light={props?.light?.num} currentBrightness={ props?.light?.state?.bri } enable={showBrightnessPicker} />
      <HueLightSaturationPicker light={props?.light?.num} currentSaturation={ props?.light?.state?.sat } enable={showSaturationPicker} />
      <HueLightHuePicker light={props?.light?.num} currentHue={ props?.light?.state?.hue } enable={showHuePicker} />
   </div>
  )
}, didLightStateChange);

function didLightStateChange(prevProps: any, nextProps: any) {
   /* this component is a React Memo component, which means that if the parents' state changes 
   we want this child component to only re-render when the actual light's state has changed.
   Since React only does a shallow comparison to detect if props have changed, this will 
   not work out of the box. The below custom comparison method fixes this. As a result,
   no matter how often the upstream parent component polls the Hue Bridge API, any individual
   HueLight child component will only re-render when any of its properties changes.
   */
   return JSON.stringify(prevProps) === JSON.stringify(nextProps);
}

export default HueLight