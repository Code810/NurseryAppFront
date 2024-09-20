import Banner from '@/components/sections/banner/banner'
import Blogs from '@/components/sections/blogs/blogs'
import Pricing from '@/components/sections/Pricing/pricing'
import Teachers from '@/components/sections/Teachers/teachers'
import React from 'react'


const Home= () => {
  return (
    <>
      <main>
        <Banner/>
        <Blogs/>
        <Pricing/>
        <Teachers/>
      </main>
    </>
  )
}

export default Home