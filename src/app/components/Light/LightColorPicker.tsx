"use client";

import "@styles/components/lightcolorpicker.css";
import { hex2RGB, rgb2CIE } from "@utils/color";
import { useEffect, useState } from "react";

interface LightColorPickerProps {
  light: string;
  currentColor: string;
  enable: boolean;
}

export default function LightColorPicker({
  light,
  currentColor,
  enable,
}: LightColorPickerProps) {
  const [pickColor, setPickColor] = useState<number[]>([]);
  const [apiTimeout, setApiTimeout] = useState(0);

  useEffect(() => {
    if (pickColor && pickColor.length === 3) {
      updateLightColor();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickColor]);

  const ENDPOINT = `${process.env.NEXT_PUBLIC_HUE_API_ADDRESS}/api/${process.env.NEXT_PUBLIC_HUE_API_USERNAME}/lights/${light}/state`;

  async function updateLightColor() {
    const bodyData = {
      bri: pickColor[2],
      xy: [pickColor[0], pickColor[1]],
    };

    try {
      const response = await fetch(ENDPOINT, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();

      if (data[0]?.error) {
        console.error("Error:", data[0]?.error?.description);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  function changeColor(e: React.ChangeEvent<HTMLInputElement>) {
    clearTimeout(apiTimeout);
    const hexPicked = e.target.value;
    if (hexPicked) {
      const rgbPicked = hex2RGB(hexPicked);
      const ciePicked = rgb2CIE(rgbPicked[0], rgbPicked[1], rgbPicked[2]);
      //setPickColor(ciePicked);
      setApiTimeout(
        window.setTimeout(() => {
          setPickColor(ciePicked);
        }, 100)
      );
    }
  }

  return (
    <input
      type="color"
      className="color-picker"
      value={currentColor}
      onChange={changeColor}
      disabled={!enable}
      aria-label="Pick color"
    />
  );
}
