"use client";

interface HueGroupToggleProps {
   group: string,
   on: boolean
}

export default function HueGroupToggle({ group, on }: HueGroupToggleProps) {

   const HUE_API_ADDRESS = process.env.NEXT_PUBLIC_HUE_API_ADDRESS;
   const HUE_API_USERNAME = process.env.NEXT_PUBLIC_HUE_API_USERNAME;
   const ENDPOINT = `${HUE_API_ADDRESS}/api/${HUE_API_USERNAME}/groups/${group}/action`;

   async function toggleGroup(e:React.MouseEvent<HTMLButtonElement>) {
      
      e.preventDefault();
      const bodyData = { on: !on };
      try {
          const response = await fetch(ENDPOINT, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(bodyData)
          });

          const data = await response.json();

          if (data[0]?.error) {
              console.error('Error:', data[0].error.description);
          }

      } catch (error) {
          console.error('Error:', error);
      }
   }

  return (
   <>
   <button className='hue-group-switch' onClick={toggleGroup}>{on? 'off' : 'on'}</button>
   </>
  )
}
