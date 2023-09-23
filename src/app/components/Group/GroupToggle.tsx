"use client";

import Toggle from "react-toggle";
import "react-toggle/style.css";
import "@styles/components/grouptoggle.css";

interface GroupToggleProps {
  group: string;
  on: boolean;
}

export default function GroupToggle({ group, on }: GroupToggleProps) {
  const ENDPOINT = `${process.env.NEXT_PUBLIC_HUE_API_ADDRESS}/api/${process.env.NEXT_PUBLIC_HUE_API_USERNAME}/groups/${group}/action`;

  async function toggleGroup(e: { preventDefault: () => void }) {
    e.preventDefault();
    const bodyData = { on: !on };
    try {
      const response = await fetch(ENDPOINT, {
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
    <label>
      <Toggle
        checked={on}
        icons={false}
        className="group-toggle"
        onChange={toggleGroup}
        aria-label="toggle light group"
      />
    </label>
  );
}
