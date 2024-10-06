import SocalIcons from '@/components/ui/socalIcons';
import React from 'react'
import { FaPhone, FaEnvelope, FaLocationDot } from "react-icons/fa6";
import { Link } from 'react-router-dom';

const ExtraInfo = ({ phoneSetting, addressSetting, emailSetting }) => {
    return (
        <div className="mt-5">
            <div>
                <h4 className="text-xl font-bold text-[#385469]">Contact Info</h4>
                <ul className="mt-5 flex flex-col gap-[15px]">
                    <li className='flex items-center gap-2'>
                        <FaPhone className="text-primary-foreground" /> 
                        <Link to={`tel:${phoneSetting}`} className="ml-2.5">{phoneSetting}</Link>
                    </li>
                    <li className='flex items-center gap-2'>
                        <FaEnvelope className="text-primary-foreground" /> 
                        <Link to={`mailto:${emailSetting}`} className="ml-2.5">{emailSetting}</Link>
                    </li>
                    <li className='flex items-center gap-2'>
                        <FaLocationDot className="text-primary-foreground" /> 
                        <span className="ml-2.5">{addressSetting}</span>
                    </li>
                </ul>
            </div>
            <SocalIcons className={"w-11 h-11 bg-white text-muted-foreground"} />
        </div>
    )
}

export default ExtraInfo;
