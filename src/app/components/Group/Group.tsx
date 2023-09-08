"use client";

import { memo } from 'react';
import '@styles/components/group.css';
import { HueGroup } from 'types/hue';
import GroupToggle from '@components/Group/GroupToggle';

interface GroupProps {
   onSelectGroup: (arg0: string) => void;
   group: HueGroup | null;
   activeGroup: string | null;
 }

const Group = memo(function Group({ onSelectGroup, group, activeGroup }: GroupProps) {
  return (
    <>
      {group ? 
        <>
          <button className={`group ${activeGroup === group.num ? 'group--active' : ''}`} 
            key={group.name} onClick={() => onSelectGroup(group.num)}>
            {group.name} ({group.num})
          </button>
          <GroupToggle group={group.num} on={group.state?.any_on} />
        </>
        :
        <button className={`group ${!activeGroup ? 'group--active' : ''}`} 
          key="all" onClick={() => onSelectGroup('')}>
          All
        </button>
      }
    </>
  );
}, didGroupStateChange);

function didGroupStateChange(prevProps: any, nextProps: any) {
   return JSON.stringify(prevProps) === JSON.stringify(nextProps);
}

export default Group;
