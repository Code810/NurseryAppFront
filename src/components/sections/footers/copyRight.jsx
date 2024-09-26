import { cn } from '@/lib/utils'
import React from 'react'
import { Link } from 'react-router-dom'

const CopyRight = ({ color }) => {
    return (
        <div className="pt-[75px] overflow-x-hidden">
            <div className="flex lg:flex-row flex-col justify-center lg:items-center pt-7.5 pb-8 border-t border-t-white border-opacity-20">
                <p className={cn('wow fadeInLeft', color)} data-wow-delay=".3s">© <Link to="#">Nadir Shirinbayli</Link> 2024 | All Rights Reserved</p>
              
            </div>
        </div>
    )
}

export default CopyRight