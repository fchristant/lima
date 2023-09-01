"use client";

import './huelighttoggle.css'

export default function HueLightToggle(props: { light: string, on: boolean, reachable: boolean; }) {

   function toggleLight(e:any) {
      
      e.preventDefault();   
      const bodyData = { on: props?.on? false : true};
 
      fetch(process.env.NEXT_PUBLIC_HUE_API_ADDRESS + '/api/' + process.env.NEXT_PUBLIC_HUE_API_USERNAME + '/lights/' + props?.light + '/state', {
         method: 'PUT', 
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(bodyData)
      })
      .then(response => response.json())
      .then(data => {
         if (data[0]?.error) {
            /* the Hue V1 API returns a 200 code even when there is an error
            so we need to check the error object of the response to detect
            a failure */
            console.error('Error:', data[0]?.error?.description);
         }
      })
      .catch(error => {
         console.error('Error:', error);
      });

   }

  return (
   <>
   <button className='hue-light-switch' onClick={toggleLight} disabled={!props?.reachable}>{props.on? 'off' : 'on'}</button>
   </>
  )
}
