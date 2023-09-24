"use client";

import "@styles/components/lighttoggle.css";
import Toggle from "react-toggle";
import "@styles/components/vendor/react-toggle.css";

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
  async function toggleLight(e: { preventDefault: () => void }) {
    e.preventDefault();
    const bodyData = { on: !on };

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

  return (
    <Toggle
      checked={on}
      icons={false}
      className="light-toggle"
      onChange={toggleLight}
      aria-label="toggle light"
    />
  );
}
