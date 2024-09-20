import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button'
import left_circle_1 from "@/assets/images/banner/left-circle-1.png"
import left_circle_2 from "@/assets/images/banner/left-circle-2.png"
import right_circle from "@/assets/images/banner/right-circle.png"
import shap from "@/assets/images/banner/shap.png"
import { Link } from 'react-router-dom'
import Title from '@/components/ui/title'

const Banner = () => {
  const [banner, setBanner] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get('http://localhost:5180/api/Banner'); // Replace with your URL
        setBanner(response.data);
      } catch (err) {
        setError(err.message);
      }
    };
    getData();
  }, []); // Empty 


  return (
  <>
  {banner && (
   
  <section className="bg-warm pt-[78px] lg:mb-15 mb-10 relative">
  <div className="container relative">
    <div className="flex flex-col items-center text-center relative z-10">
      <Title size={"7.5xl"} className={"font-normal max-w-[776px]"}>
        <span className="relative">{banner.title1}<span className="absolute -left-6 top-1 text-3xl text-[#0A6375]"></span></span><br />
        <span className="font-bold">{banner.title2}</span> <span className="font-bold text-destructive-foreground">{banner.title3}</span>
      </Title>

      <div className="flex absolute right-[87px] top-14 animate-skw">
        <img src={shap} alt="shap-2" className="w-7.5 h-12.5 relative top-9" />
        <img src={shap} alt="shap-1" />
        <img src={shap} alt="shap-2" className="w-5 h-8 -mt-7" />
      </div>

      <p className="pt-5 max-w-[431px]">banner.description</p>
      <div className="mt-6">
        <Button asChild variant={"secondary"} >
          <Link to="/about-us">Ətraflı</Link>
        </Button>
      </div>
    </div>
    <div className="absolute left-2.5 lg:top-0 top-10 lg:max-w-full max-w-[200px] sm:block hidden animate-up-down">
      <img src={banner.leftFileName} alt="banner-img-1" />
      <span className="absolute -left-2.5 top-[9px] border-2 border-primary rounded-[125px] w-full h-full"></span>
    </div>

    <div className="absolute right-0 bottom-0 pb-[71px] lg:block hidden animate-up-down">
      <img src={banner.rightFileName} alt="banner-img-2" />
      <span className="absolute -left-2.5 top-[9px] border-2 border-secondary rounded-[125px] max-h-[369px] w-full h-full"></span>
    </div>

    <div className="lg:pt-[72px]">
      <img src={banner.bottomFileName} alt="painting" />
    </div>
  </div>
  {/* <!-- circle shap --> */}
  <div className="lg:block hidden">
    <div className="absolute left-0 top-[60px] animate-left-right-2">
      <img src={left_circle_1} alt="img" />
    </div>
    <div className="absolute left-[37px] top-[186px] animate-left-right-2">
      <img src={left_circle_2} alt="img" />
    </div>
    <div className="absolute right-0 bottom-[165px] animate-up-down">
      <img src={right_circle} alt="img" />
    </div>
  </div>
  {/* <!-- circle shap --> */}
</section>

  )}
  </>
  );
}

export default Banner