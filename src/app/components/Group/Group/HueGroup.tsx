"use client";

import { memo } from 'react';
import './huegroup.css'
import { BulbGroup } from '../../../types/types';
import HueGroupSwitch from '../Modify/GroupToggle/HueGroupToggle';

const HueGroup = memo(function HueGroup(props: { onSelectGroup: (arg0: any) => void, key: string, group: BulbGroup | null, activeGroup: string | null }) {

  return (
   <>
      { props?.group? 
         <>
         <button className={'hue-group' + (props?.activeGroup === props?.group?.num? ' hue-group--active' : '') } key={props?.group?.name} onClick={() => props.onSelectGroup(props?.group?.num)}>{props?.group?.name} ({props?.group?.num})</button>
         <HueGroupSwitch group={props?.group?.num} on={props?.group?.state?.any_on} />
         </>
         :
         <button className={'hue-group' + (!props.activeGroup? ' hue-group--active' : '') } key="all" onClick={() => props.onSelectGroup('')}>All</button>
      }
   </>
  )
}, didGroupStateChange);

function didGroupStateChange(prevProps: any, nextProps: any) {
   /* this component is a React Memo component, which means that if the parents' state changes 
   we want this child component to only re-render when the actual group's state has changed.
   Since React only does a shallow comparison to detect if props have changed, this will 
   not work out of the box. The below custom comparison method fixes this. As a result,
   no matter how often the upstream parent component polls the Hue Bridge API, any individual
   HueGroup child component will only re-render when any of its properties changes.
   */
   return JSON.stringify(prevProps) === JSON.stringify(nextProps);
}

export default HueGroup