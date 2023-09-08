"use client";

import { useEffect, useState } from "react";

interface HueBridgeProps {
   children: React.ReactNode;
 }

export default function HueBridge({ children }: HueBridgeProps) {

   const [error, setError] = useState('');
   const [isReady, setIsReady] = useState(false);

   // check for environment variable availability needed to access the API
   useEffect(() => {
      try {
         if (typeof process.env.NEXT_PUBLIC_HUE_API_ADDRESS === 'undefined') { throw new Error('NEXT_PUBLIC_HUE_API_ADDRESS not found'); }
         if (typeof process.env.NEXT_PUBLIC_HUE_API_USERNAME === 'undefined') { throw new Error('NEXT_PUBLIC_HUE_API_USERNAME not found'); }
         setIsReady(true)
      } catch(error:any) {
         setError(error.message)
      }
   },[]);

  return (
   <>
   {error? <p>{error}</p> : ''}
   {isReady && children}
   </>
  )
}
