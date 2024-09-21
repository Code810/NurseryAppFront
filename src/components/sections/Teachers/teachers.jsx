import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SectionName from '@/components/ui/sectionName';
import Title from '@/components/ui/title';
import TeacherCard from './TeacherCard';

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    const getTeachers = async () => {
      try {
        const response = await axios.get('http://localhost:5180/api/Teacher?count=3');
        setTeachers(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    getTeachers();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <section className="lg:pt-15 lg:pb-15 pt-10 pb-10">
      <div className="container">
        <div className="text-center flex flex-col items-center">
          <SectionName>Bizim Müəllimlərimiz</SectionName>
          <Title size={"3.5xl"} className={"lg:max-w-[520px]"}>
          Müəllim bilik verən və gələcəyə ilhamlandırandır
          </Title>
        </div>
        <div className="lg:pt-15 pt-10">
          <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-7.5">
            {teachers.map(({ id, firstName, lastName, fileName,facebook,twitter,linkedin,instagram}) => (
              <TeacherCard key={id} id={id} firstName={firstName} lastName={lastName} fileName={fileName} 
              facebook={facebook} twitter={twitter} linkedin={linkedin} instagram={instagram}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Teachers;
