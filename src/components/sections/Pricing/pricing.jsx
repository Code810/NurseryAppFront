import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Title from '@/components/ui/title';
import SectionName from '@/components/ui/sectionName';
import { getGroupsHomeEndpoint } from '@/api';
import GroupCard from '../Groups/GroupCard';

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
                            <GroupCard
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



export default Pricing;
