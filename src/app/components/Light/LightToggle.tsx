"use client";

import "@styles/components/lighttoggle.css";
import Toggle from "react-toggle";
import "@styles/components/vendor/react-toggle.css";
import "@styles/components/vendor/react-toggle-override.css";
import { useEffect, useState } from "react";

interface LightToggleProps {
  light: string;
  on: boolean;
  reachable: boolean;
}

const HUE_API_BASE_URL = `${process.env.NEXT_PUBLIC_HUE_API_ADDRESS}/api/${process.env.NEXT_PUBLIC_HUE_API_USERNAME}/lights`;

export default function LightToggle({
  light,
  on,
  reachable,
}: LightToggleProps) {
  const [onState, setOnState] = useState(on);

  useEffect(() => {
    setOnState(on);
  }, [on]);

  async function toggleLight(e: { preventDefault: () => void }) {
    e.preventDefault();
    const bodyData = { on: !onState };

    try {
      const response = await fetch(`${HUE_API_BASE_URL}/${light}/state`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });
      const data = await response.json();

      if (data[0]?.error) {
        console.error("Error:", data[0].error.description);
      } else {
        setOnState(!onState);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <Toggle
      checked={onState}
      icons={false}
      className="light-toggle"
      onChange={toggleLight}
      aria-label="toggle light"
      disabled={!reachable}
    />
  );
}
