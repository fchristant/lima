"use client";

import './huelight.css'

export default function HueLight(props) {

  return (
   <div className="hue-light">
      Name: {props?.light?.name}<br/>
      State: {props?.light?.state?.on? "on" : "off"}<br/>
      Brightness: {props?.light?.state?.bri}
   </div>
  )
}
