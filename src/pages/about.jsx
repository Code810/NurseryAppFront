import PageTitle from '@/components/about/pageTitle'
import React from 'react'
import { useOutletContext } from 'react-router-dom';

const AboutUs = () => {
  const { settings } = useOutletContext();
  const title = settings?.find(s => s.key === 'abouttitle').value;
  const desc = settings?.find(s => s.key === 'aboutdesc').value;
  return (
    <>
      <main>
        <PageTitle pageName={"Haqqımızda"} />

        <div className="container px-[100px] text-[20px]">
<h1 className='xl:text-[25px] lg:text-6xl md:text-5xl text-4xl font-bold leading-[117%] p-[60px]'>{title}</h1>
          <span>{desc}</span>
        </div>

      </main>
    </>
  )
}

export default AboutUs