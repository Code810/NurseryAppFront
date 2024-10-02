import React from 'react'
import { Link } from 'react-router-dom'
import SlideUp from '@/lib/animations/slideUp'
import { FaAnglesRight } from 'react-icons/fa6';
import { Button } from '@/components/ui/button';



const GroupCard = ({ id, name, maxAge, price, minAge, language }) => {
    return (
      <SlideUp>
        <div className="rounded-[10px] shadow-[-20px_4.8px_24.4px_-6px_rgba(19,16,34,0.10)] bg-background me-3">
          <div className="py-[15px] rounded-tr-[10px] rounded-tl-[10px] bg-warm">
            <p className="lg:text-[28px] text-2xl font-bold text-center text-muted-foreground">{name}</p>
          </div>
          <div className="lg:pt-7.5 pt-6 lg:pb-10 pb-7 lg:px-10 px-5">
            <h2 className="lg:text-[70px] md:text-[50px] text-4xl lg:leading-[117%] md:leading-[110%] leading-[100%] font-bold text-green">
              {price}₼
              <span className="md:text-2xl text-lg font-semibold text-muted-foreground md:leading-[140%] leading-[130%]">/ay</span>
            </h2>
            <ul className="lg:pt-7.5 pt-5 flex gap-3 flex-col">
              <li className="flex items-center gap-5">
                <FaAnglesRight className="text-secondary-foreground text-sm" />
                <span>{minAge} - {maxAge} yaş</span>
              </li>
              <li className="flex items-center gap-5">
                <FaAnglesRight className="text-secondary-foreground text-sm" />
                <span>{language} dili</span>
              </li>
            </ul>
            <div className="mt-10 flex justify-center">
              <Button asChild className="text-cream-foreground">
                <Link to="/contact-us">Buy Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </SlideUp>
    );
  };

  export default GroupCard;