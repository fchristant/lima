"use client";

import './huegroup.css'
import { BulbGroup } from '../types/types';

export default function HueGroup(props: { onSelectGroup: (arg0: any) => void, key: string, group: BulbGroup | null, activeGroup: string | null }) {

  return (
   <>
      { props?.group? 
         <button className={'hue-group' + (props?.activeGroup === props?.group?.num? ' hue-group--active' : '') } key={props?.group?.name} onClick={() => props.onSelectGroup(props?.group?.num)}>{props?.group?.name}</button>
         :
         <button className={'hue-group' + (!props.activeGroup? ' hue-group--active' : '') } key="all" onClick={() => props.onSelectGroup('')}>All</button>
      }
   </>
  )
}