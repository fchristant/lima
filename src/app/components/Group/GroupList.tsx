"use client";

import { useState, useEffect } from "react";
import { HueGroup } from "types/hue";
import Group from "@components/Group/Group";
import LightList from "@components/Light/LightList";
import SceneList from "@components/Scene/SceneList";
import { useInterval } from "@hooks/useInterval";
import groupsOrder from "@customize/groupsorder";
import groupsIgnore from "@customize/groupsignore";
import "@styles/components/grouplist.css";

export default function Grouplist() {
  const [groups, setGroups] = useState<HueGroup[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [groupLights, setGroupLights] = useState<string[] | null>(null);
  const pollingInterval = 1000;

  const ENDPOINT = `${process.env.NEXT_PUBLIC_HUE_API_ADDRESS}/api/${process.env.NEXT_PUBLIC_HUE_API_USERNAME}/groups`;

  const fetchGroupData = async () => {
    try {
      const response = await fetch(ENDPOINT);
      const data = await response.json();

      if (data[0]?.error) {
        setError(data[0]?.error?.description);
      } else {
        setGroups(normalizeGroupData(data));
        setError(null);
      }
    } catch (err: any) {
      setError(err.message || "Error loading group data from Hue Bridge.");
    } finally {
      setIsLoading(false);
    }
  };

  const normalizeGroupData = (data: Record<string, any>): HueGroup[] => {
    return Object.entries(data)
      .filter(([num]) => !groupsIgnore.includes(num))
      .map(([num, groupData]) => {
        return {
          ...groupData,
          num,
        };
      })
      .sort((a, b) => {
        const orderA = groupsOrder.indexOf(a.num);
        const orderB = groupsOrder.indexOf(b.num);
        return orderA - orderB;
      });
  };

  useEffect(() => {
    fetchGroupData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useInterval(() => {
    if (!error) fetchGroupData();
  }, pollingInterval);

  useEffect(() => {
    if (activeGroup && groups) {
      const selectedGroup = groups.find((group) => group.num === activeGroup);
      if (selectedGroup) setGroupLights(selectedGroup.lights);
    } else {
      setGroupLights(null);
    }
  }, [activeGroup, groups]);

  return (
    <>
      <div className="group-list">
        {error && <p>{error}</p>}
        {isLoading && <p>Loading groups...</p>}
        <Group
          key="all"
          onSelectGroup={setActiveGroup}
          group={null}
          activeGroup={activeGroup}
        />
        {groups &&
          groups.map((group) => (
            <Group
              group={group}
              key={group.num}
              onSelectGroup={setActiveGroup}
              activeGroup={activeGroup}
            />
          ))}
      </div>
      <LightList group={groupLights} groupNum={activeGroup} />
      {activeGroup && <SceneList groupNum={activeGroup} />}
    </>
  );
}
