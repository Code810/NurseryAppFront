import React from 'react'
import bread_cat from "@/assets/images/titlePage/bread-cat.png"
import bread_thumb from "@/assets/images/titlePage/bread-thumb.png"
import bread_child from "@/assets/images/titlePage/bread-child.png"

const PageTitle = ({ pageName,className }) => {
    return (
        <div className="lg:pb-15 pb-10">
            <div className="bg-[#80d7d3] lg:py-7 py-10">
                <div className="container">
                    <div className="flex  md:flex-row flex-col justify-between items-center gap-10">
                        <div className="">
                            <h2 className="xl:text-[90px] lg:text-6xl md:text-5xl text-4xl font-bold leading-[117%] px-[60px] ">{pageName}</h2>
                        </div>
                        <div className="relative">
                            <img src={bread_cat} alt="cat-img" className="absolute bottom-5 -left-[30px] animate-up-down" />
                            <img src={bread_thumb} alt="thumb-img" className="sm:max-h-full max-h-60" />
                            <img src={bread_child} alt="child-img" className="absolute bottom-0 right-0 animate-left-right" />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default PageTitle