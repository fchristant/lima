"use client";

import { memo } from "react";
import "@styles/components/group.css";
import { HueGroup } from "types/hue";
import GroupToggle from "@components/Group/GroupToggle";

interface GroupProps {
  onSelectGroup: (arg0: string) => void;
  group: HueGroup | null;
  activeGroup: string | null;
}

const Group = memo(function Group({
  onSelectGroup,
  group,
  activeGroup,
}: GroupProps) {
  return (
    <div className="group">
      {group ? (
        <>
          <button
            className={`group-filter 
            ${activeGroup === group.num ? " active" : ""}${
              group.state?.any_on ? " on" : ""
            }`}
            key={group.name}
            onClick={() => onSelectGroup(group.num)}
          >
            {group.name}
          </button>
          <GroupToggle group={group.num} on={group.state?.any_on} />
        </>
      ) : (
        <button
          className={`group-filter group-filter--all ${
            !activeGroup ? "active" : ""
          }`}
          key="all"
          onClick={() => onSelectGroup("")}
        >
          All lights
        </button>
      )}
    </div>
  );
}, didGroupStateChange);

function didGroupStateChange(prevProps: any, nextProps: any) {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps);
}

export default Group;
