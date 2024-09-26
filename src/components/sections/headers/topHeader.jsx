import React from 'react'
import { Link } from 'react-router-dom'
import { FaPhone, FaEnvelope, FaLocationDot } from "react-icons/fa6";
import SocalIcons from '@/components/ui/socalIcons';

const TopHeader = ({ settings }) => {
    const phoneSetting = settings?.find(s => s.key === 'phoneNumber');
    const addressSetting = settings?.find(s => s.key === 'address');
    const emailSetting = settings?.find(s => s.key === 'email');
    const instagramSetting = settings?.find(s => s.key === 'instagram').value;
    const facebookSetting = settings?.find(s => s.key === 'facebook').value;
    const twitterSetting = settings?.find(s => s.key === 'twitter').value;
    const linkedinSetting = settings?.find(s => s.key === 'linkedin').value;
    return (
        <div id="top-header" className="bg-destructive sm:block hidden">
            <div className="container">
                <div className="flex lg:flex-row flex-col justify-between items-center gap-2 py-[13px]">
                    <div>
                        <ul className="flex gap-7.5">
                            <li className='text-cream-foreground flex items-center gap-4'>
                                <FaPhone />
                                {phoneSetting ? (
                                    <Link to={"#"}>{phoneSetting.value}</Link>
                                ) : (
                                    <span>Loading phone...</span>
                                )}
                            </li>

                            <li className='text-cream-foreground flex items-center gap-4'>
                                <FaEnvelope />
                                {emailSetting ? (
                                    <Link to={"#"}>{emailSetting.value}</Link>
                                ) : (
                                    <span>Loading email...</span>
                                )}
                            </li>

                            <li className='text-cream-foreground flex items-center gap-4'>
                                <FaLocationDot />
                                {addressSetting ? (
                                    <span>{addressSetting.value}</span>
                                ) : (
                                    <span>Loading address...</span>
                                )}
                            </li>
                        </ul>
                    </div>

                    <div>
                        <SocalIcons className={"text-xs"}  facebook={facebookSetting} twitter={twitterSetting}
                         linkedin={linkedinSetting} instagram={instagramSetting}  />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TopHeader;
