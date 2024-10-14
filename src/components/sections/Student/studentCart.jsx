import React from 'react';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { api } from '@/utils/axios';

const StudentCart = ({ students, onEditStudent, onDeleteStudent, authToken }) => {

  const handleDeleteStudent = (studentId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this student?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api().delete(`/Student/${studentId}`);
          onDeleteStudent(studentId);
          Swal.fire(
            'Deleted!',
            'The student has been deleted.',
            'success'
          );
        } catch (error) {
          Swal.fire(
            'Error!',
            'Failed to delete the student. Please try again later.',
            'error'
          );
          console.error('Error deleting student:', error);
        }
      }
    });
  };

  return (
    <tbody>
      {students.map((student) => (
        <tr key={student.id} className="border-b border-dashed last:border-b-0">
          <td className="p-3 pl-0">
            <div className="flex items-center">
              <div className="relative inline-block shrink-0 rounded-2xl mr-3">
                <img
                  src={student.fileName}
                  className="w-[50px] h-[50px] inline-block shrink-0 rounded-2xl"
                  alt={`${student.firstName} ${student.lastName}`}
                />
              </div>
            </div>
          </td>
          <td className="p-3 pl-0">
            <div className="flex flex-col justify-start">
              <span className="font-semibold transition-colors duration-200 ease-in-out text-lg/normal text-secondary-inverse">
                {student.firstName} {student.lastName}
              </span>
            </div>
          </td>
          <td>
            <span className="font-semibold text-light-inverse text-md/normal">
              {student.dateOfBirth && new Date(student.dateOfBirth).toLocaleDateString()}
            </span>
          </td>
          <td>
            <span className="font-semibold text-light-inverse text-md/normal">
              {student.gender}
            </span>
          </td>
          <td>
            <span className="font-semibold text-light-inverse text-md/normal">
              {student.group ? student.group.name : 'Yoxdur'}
            </span>
          </td>
          <td className='flex gap-2 mt-6'>
            <Link onClick={() => onEditStudent(student)}>
              <FaEdit className='text-[#0197c7]' id={student.id}/>
            </Link>
            <Link onClick={() => handleDeleteStudent(student.id)}>
              <MdDelete className='text-[#ed145b]' />
            </Link>
          </td>
        </tr>
      ))}
    </tbody>
  );
}

export default StudentCart;
