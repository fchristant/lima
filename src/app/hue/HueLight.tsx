"use client";

import './huelight.css'
import { cie2RGB } from '../utils/color';

export default function HueLight(props) {

   let rgbColor = null;

   if (props.light.state.xy && props.light.state.bri) {
      rgbColor = cie2RGB(props.light.state.xy[0],props.light.state.xy[1],props.light.state.bri);
   }

  return (
   <div className="hue-light">
      Name: {props?.light?.name}<br/>
      State: {props?.light?.state?.on? "on" : "off"}<br/>
      Brightness: {props?.light?.state?.bri}<br/>
      Hue: {props?.light?.state?.hue}<br/>
      Saturation: {props?.light?.state?.sat}<br/>
      Color temperature: {props?.light?.state?.ct}<br/>
      XY: {props?.light?.state?.xy}<br/>
      RGB: {rgbColor?.r} {rgbColor?.g} {rgbColor?.b}
      <div className="hue-light__spot" style={{color: rgbColor ? 'rgb(' + rgbColor?.r + ' ' + rgbColor?.g + ' ' + rgbColor?.b + ')' : '#333'}}></div>
   </div>
  )
}
