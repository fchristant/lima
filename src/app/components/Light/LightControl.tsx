"use client";

import { useEffect, useRef, useState } from "react";
import throttle from "lodash.throttle";
import "@styles/components/lightcontrol.css";
import { mired2Kelvin } from "@utils/color";

interface LightControlProps {
  light: string;
  currentValue: number;
  enable: boolean;
  min: number;
  max: number;
  attribute: "hue" | "sat" | "ct" | "bri";
  label?: "Temperature" | "Hue" | "Brightness" | "Saturation";
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
  label,
}: LightControlProps) {
  const [pickedValue, setPickedValue] = useState(currentValue);
  const [displayValue, setDisplayValue] = useState(
    calculateDisplayValue(pickedValue)
  );

  useEffect(() => {
    setPickedValue(currentValue);
  }, [currentValue]);

  useEffect(() => {
    setDisplayValue(calculateDisplayValue(pickedValue));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickedValue]);

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

  function calculateDisplayValue(rawValue: number) {
    if (rawValue === undefined) {
      return "";
    }

    if (attribute === "bri") {
      return Math.round((rawValue / 255) * 100) + "%";
    }

    if (attribute === "sat" && typeof rawValue !== undefined) {
      return Math.round((rawValue / 255) * 100) + "%";
    }

    if (attribute === "ct") {
      return mired2Kelvin(rawValue) + "K";
    }

    return rawValue;
  }

  const makeApiRequestThrottled = useRef(throttle(updateLight, 100));

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    setPickedValue(value);
    makeApiRequestThrottled.current(value);
  };

  return (
    <>
      <div className="light-control-details">
        {label ? (
          <label
            className="light-control-label"
            htmlFor={light + "-" + attribute}
          >
            {label}
          </label>
        ) : (
          ""
        )}
        <div className="light-control-value">{displayValue}</div>
      </div>
      <input
        type="range"
        className={className}
        min={min}
        max={max}
        value={pickedValue}
        onChange={handleChange}
        disabled={!enable}
        id={light + "-" + attribute}
      />
    </>
  );
}
