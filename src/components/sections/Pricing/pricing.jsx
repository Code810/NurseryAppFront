import React, { useEffect, useState } from 'react';
import { FaAnglesRight } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Title from '@/components/ui/title';
import SlideUp from '@/lib/animations/slideUp';
import { Button } from '@/components/ui/button';
import SectionName from '@/components/ui/sectionName';
import { getGroupsHomeEndpoint } from '@/api';

const Pricing = () => {
    const [groups, setGroups] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getGroups = async () => {
            try {
                const response = await axios.get(getGroupsHomeEndpoint());
                setGroups(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        getGroups();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <section className="lg:pt-15 pt-10 lg:pb-15 pb-10">
            <div className="container">
                <div className="flex flex-col justify-center items-center">
                    <SectionName className={"text-primary-foreground"}>Bizim qiymətlər</SectionName>
                    <Title size={"3.5xl"} className={"mt-2.5 text-center max-w-[516px]"}>
                        Uşaqlarınız üçün sevgi dolu və təhlükəsiz bir təhsil mühiti yaradırıq.
                    </Title>
                </div>
                <div className="lg:pt-15 pt-10">
                    <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-y-7.5 gap-x-7.5 lg:gap-x-0">
                        {groups && groups.map(({ price, id, name, maxAge, minAge, language }) => (
                            <Card
                                key={id}
                                id={id}
                                name={name}
                                maxAge={maxAge}
                                price={price}
                                minAge={minAge}
                                language={language}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

// Card Component
const Card = ({ id, name, maxAge, price, minAge, language }) => {
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

export default Pricing;
