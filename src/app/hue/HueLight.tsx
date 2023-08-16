"use client";

import { memo, useState } from 'react';
import './huelight.css'
import { cie2RGB, rgbToHex, kelvinToRGB } from '../utils/color';

//export default function HueLight(props) {
const HueLight = memo(function HueLight(props) {

   let lampColor;
   let lampKelvin = Math.round((1000000 / props?.light?.state?.ct));

   console.log('render')

   // if light is off or not reachable, render as gray/dull
   if (!props?.light?.state?.on || !props?.light?.state?.reachable) {
      lampColor = '#333';
   } else if (props?.light?.state?.colormode === 'ct' && !props?.light?.state?.xy) {
      // when light is in color temperature (ct) color mode and has no xy output, assume it's a non-color bulb
      
      // convert 'mired' to kelvin, kelvin to rgb
      let kRGB = kelvinToRGB(lampKelvin);
      //lampColor = rgbToHex(kRGB[0], kRGB[1], kRGB[2]);

      let brightness = props?.light?.state?.bri / 255;
      lampColor = 'rgba(' + kRGB[0] + ', ' + kRGB[1] + ', ' +  kRGB[2] + ',' + brightness + ')';

      // apply brightness

   } else if (props.light.state.xy && props.light.state.bri) {
      // color bulb
      let lampColorRGB = cie2RGB(props.light.state.xy[0],props.light.state.xy[1],props.light.state.bri);
      lampColor = rgbToHex(lampColorRGB.r, lampColorRGB.g, lampColorRGB.b);
   }

  return (
   <div className="hue-light" style={{opacity: !props?.light?.state?.reachable? "0.3" : "1"}}>
      Name: {props?.light?.name}<br/>
      State: {props?.light?.state?.on? "on" : "off"}<br/>
      Reachable: {props?.light?.state?.reachable? "true" : "false"}<br/>
      Brightness: {props?.light?.state?.bri}<br/>
      Hue: {props?.light?.state?.hue}<br/>
      Saturation: {props?.light?.state?.sat}<br/>
      Color temperature: {props?.light?.state?.ct} ({lampKelvin})<br/>
      XY: {props?.light?.state?.xy}<br/>
      HEX: {lampColor}
      <div className="hue-light__spot" style={{color: lampColor}}></div>
   </div>
  )
}, areEqual);

function areEqual(prevProps, nextProps) {
   return JSON.stringify(prevProps) === JSON.stringify(nextProps);
}

export default HueLight