"use client";

import Toggle from "react-toggle";
import "@styles/components/vendor/react-toggle.css";
import "@styles/components/vendor/react-toggle-override.css";
import "@styles/components/grouptoggle.css";
import { useEffect, useState } from "react";

interface GroupToggleProps {
  group: string;
  on: boolean;
}

export default function GroupToggle({ group, on }: GroupToggleProps) {
  const ENDPOINT = `${process.env.NEXT_PUBLIC_HUE_API_ADDRESS}/api/${process.env.NEXT_PUBLIC_HUE_API_USERNAME}/groups/${group}/action`;

  const [onState, setOnState] = useState(on);

  useEffect(() => {
    setOnState(on);
  }, [on]);

  async function toggleGroup(e: { preventDefault: () => void }) {
    e.preventDefault();
    const bodyData = { on: !onState };
    try {
      const response = await fetch(ENDPOINT, {
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
    <label>
      <Toggle
        checked={onState}
        icons={false}
        className="group-toggle"
        onChange={toggleGroup}
        aria-label="toggle light group"
      />
    </label>
  );
}
