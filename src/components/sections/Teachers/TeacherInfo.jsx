import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PageTitle from '@/components/about/pageTitle';
import SocalIcons from '@/components/ui/socalIcons';
import { getTeacherDetailEndpoint } from '@/api';

const TeacherInfo = () => {
  const { id } = useParams(); 
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeacherDetails = async () => {
      try {
        const response = await axios.get(getTeacherDetailEndpoint(id));
        setTeacher(response.data);
        setLoading(false);
      } catch (err) {
        setError('An error occurred while fetching the teacher details.');
        setLoading(false);
      }
    };

    if (id) {
      fetchTeacherDetails(); // Fetch the teacher details if 'id' exists
    }
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
       <main>
        <div className="pt-15">
          <div className="container">
            <div className="grid xl:grid-cols-[850px_auto] lg:grid-cols-[670px_auto] grid-cols-1 gap-7.5 justify-center">
              <div className="teacher-info">
                <img src={teacher.fileName} alt={`${teacher.firstName} ${teacher.lastName}`} className="w-full rounded-md" />
                <h2 className="text-3xl font-bold mt-5">{teacher.firstName} {teacher.lastName}</h2>
                <p className="text-lg text-gray-600">Group: {teacher.groupName}</p>

                {/* Social Media Links */}
                <div className="mt-5">
                  <SocalIcons
                    facebook={teacher.facebook}
                    twitter={teacher.twitter}
                    linkedin={teacher.linkedin}
                    instagram={teacher.instagram}
                    prentClass="gap-3"
                    className="text-red text-[20px] hover:bg-blue-600"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default TeacherInfo;
