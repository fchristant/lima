"use client";

import { useState, useEffect } from "react";
import { BulbGroup } from "../../../types/types";
import HueGroup from "../Group/HueGroup";
import HueLights from "../../Light/Lights/HueLights";
import { useInterval } from "../../../hooks/useInterval";

export default function HueGroups() {

   /* this component polls the Hue Bridge V1 API for 'groups' information
   and then renders 'light' child components to visualize them */

   const [groups, setGroups] = useState< BulbGroup[] | null>(null)
   const [isLoading, setIsLoading] = useState(true);
   const [err, setErr] = useState<any>('');
   const [activeGroup, setActiveGroup] = useState< string | null>(null)
   const [groupLights, setGroupLights] = useState(null)

   /* interval at which to make poll request to the API in milliseconds
   Do not go below 100 as this may overload the Hue Bridge */
   const pollingInterval = 500;

   function normalizeGroupData(data: any) {
      let myGroups: BulbGroup[] = [];
      Object.entries(data).forEach((group:any) => {
         /* 
         stamp the unique group id [0] on the light object [1]
         this is needed because write operations such as turning
         on/off a group require this group number
         */
         group[1].num = group[0];
         // push combined object to result array
      
         myGroups.push(group[1])
      }
      )
      return myGroups;
   }

   useInterval(() => {
      const fetchGroupData = async () => {
         try {
         // get group data from local Hue Bridge
         const result = await fetch(process.env.NEXT_PUBLIC_HUE_API_ADDRESS + '/api/' + process.env.NEXT_PUBLIC_HUE_API_USERNAME + '/groups');
         // convert network result to JSON
         const data = await result.json()
         
         if (data[0]?.error) {
            /* the Hue V1 API returns a 200 code even when there is an error
            so we need to check the error object of the response to detect
            a failure */
            setErr(data[0]?.error?.description)
         } else {
            // normalize data and save result in state
            setGroups(normalizeGroupData(data));
            setErr('')
         }
         } 
         catch(error:any) { 
            setErr(error? error.message : "Error loading data from Hue Bridge, please check the console for issues.") 
         }
         finally { setIsLoading(false) }
      };
      if (!err) {
         fetchGroupData()
      }
    }, pollingInterval);



   useEffect(() => { 
     // when the active group changes, find the lights that are part of the group
     if (activeGroup && groups) {
      Object.entries(groups).forEach((group:any) => {
        if (group[1]?.num === activeGroup) {
         setGroupLights(group[1]?.lights)
        }
      })
     } else {
      setGroupLights(null)
     }
   }, [activeGroup]);

  return (
   <>
   { err? err : ""}
   { isLoading? <p>loading groups...</p> : ""}
   <HueGroup key="all" onSelectGroup={setActiveGroup} group={null} activeGroup={activeGroup} />
   { groups ? 
      <>
         {groups.map(group =>( <HueGroup group={group} key={group?.num} onSelectGroup={setActiveGroup} activeGroup={activeGroup} />))}
      </> : ""
   }
   <HueLights group={groupLights} />
   </>
  )
}
