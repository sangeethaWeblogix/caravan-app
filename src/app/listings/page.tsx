 'use client'
 import React, { Suspense } from 'react'
 import Listing from '../../app/components/Listings'
 
 const page = () => {
   return (
     <div>
                                    <Suspense fallback={<div>Loading filters...</div>}>
      
       <Listing />
     </Suspense>
     </div>
   )
 }
 
 export default page
 