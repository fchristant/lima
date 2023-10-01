"use client";

import { useEffect, useRef, useState } from "react";
import throttle from "lodash.throttle";

interface LightControlProps {
  light: string;
  currentValue: number;
  enable: boolean;
  min: number;
  max: number;
  attribute: "hue" | "sat" | "ct" | "bri";
  className: string;
}

const HUE_API_BASE_URL = `${process.env.NEXT_PUBLIC_HUE_API_ADDRESS}/api/${process.env.NEXT_PUBLIC_HUE_API_USERNAME}/lights`;

export default function LightControl({
  light,
  currentValue,
  enable,
  min,
  max,
  attribute,
  className,
}: LightControlProps) {
  const [pickedValue, setPickedValue] = useState(currentValue);

  useEffect(() => {
    setPickedValue(currentValue);
  }, [currentValue]);

  async function updateLight(value: number) {
    const bodyData = { [attribute]: value };

    try {
      const response = await fetch(`${HUE_API_BASE_URL}/${light}/state`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });
      const data = await response.json();

      if (data[0]?.error) {
        console.error("Error:", data[0].error.description);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const makeApiRequestThrottled = useRef(throttle(updateLight, 100));

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    setPickedValue(value);
    makeApiRequestThrottled.current(value);
  };

  return (
    <div>
      <input
        type="range"
        className={className}
        min={min}
        max={max}
        value={pickedValue}
        onChange={handleChange}
        disabled={!enable}
      />
    </div>
  );
}
