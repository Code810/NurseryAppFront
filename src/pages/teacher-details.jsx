import React from 'react';
import { useParams } from 'react-router-dom';
import PageTitle from '@/components/about/pageTitle';
import TeacherInfo from '@/components/sections/Teachers/TeacherInfo';

const TeacherDetails = () => {
  const { id } = useParams(); 

  return (
    <>
      <main>
        <PageTitle pageName={"Müəllim"} />
        <div className='pt-15'>
          <div className='container'>
            <div className='grid xl:grid-cols-[850px_auto] lg:grid-cols-[670px_auto] grid-cols-1 gap-7.5 justify-center'>
              <TeacherInfo id={id} /> 
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default TeacherDetails;
