"use client";

import { memo } from 'react';
import './huegroup.css';
import { BulbGroup } from 'types/hue';
import HueGroupToggle from '@components/Group/Modify/GroupToggle/HueGroupToggle';

interface HueGroupProps {
   onSelectGroup: (arg0: any) => void;
   group: BulbGroup | null;
   activeGroup: string | null;
 }

const HueGroup = memo(function HueGroup({ onSelectGroup, group, activeGroup }: HueGroupProps) {
  return (
    <>
      {group ? 
        <>
          <button className={`hue-group ${activeGroup === group.num ? 'hue-group--active' : ''}`} 
            key={group.name} onClick={() => onSelectGroup(group.num)}>
            {group.name} ({group.num})
          </button>
          <HueGroupToggle group={group.num} on={group.state?.any_on} />
        </>
        :
        <button className={`hue-group ${!activeGroup ? 'hue-group--active' : ''}`} 
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

export default HueGroup;
