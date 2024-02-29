import styles from '../components/home.module.css';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import StaffNavbar from '/components/staffNavbar';
import DeleteModal from '../components/DeleteModal'; // Import your DeleteModal component

import { ShareButton } from 'react-facebook';

import { SessionProvider } from 'next-auth/react';
import Head from 'next/head';



export default function Home() {
  const [works, setWorks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWork, setSelectedWork] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedStudentApplied, setSelectedStudentApplied] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [appliedStudents, setAppliedStudents] = useState([
    { id: 1, name: 'John Doe', status: 'pending' },
    { id: 2, name: 'Jane Smith', status: 'pending' },
  ]);

  const [progressStudents, setProgressStudents] = useState([
    { id: 3, name: 'Mark Johnson', status: 'incomplete' },
  ]);

  const acceptStudent = (id) => {
    // Find the student in the appliedStudents list
    const acceptedStudent = appliedStudents.find((student) => student.id === id);

    // Remove the student from the appliedStudents list
    const updatedAppliedStudents = appliedStudents.filter((student) => student.id !== id);
    setAppliedStudents(updatedAppliedStudents);

    // Add the student to the progressStudents list with their actual name
    setProgressStudents([...progressStudents, { id, name: acceptedStudent.name, status: 'incomplete' }]);
  };

  const declineStudent = (id) => {
    const updatedStudents = appliedStudents.filter((student) => student.id !== id);
    setAppliedStudents(updatedStudents);
  };

  const completeStudent = (id) => {
    const updatedStudents = progressStudents.map((student) =>
      student.id === id ? { ...student, status: 'complete' } : student
    );
    setProgressStudents(updatedStudents);
  };

  const incompleteStudent = (id) => {
    const updatedStudents = progressStudents.map((student) =>
      student.id === id ? { ...student, status: 'incomplete' } : student
    );
    setProgressStudents(updatedStudents);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/posts/scholarshipWork", { cache: "no-store" });
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await res.json();
        setWorks(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleWorkClick = (workId) => {
    setSelectedWork(works.find((work) => work._id === workId));
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };
  

  const handleDeleteConfirmed = async () => {
    try {
      const res = await fetch(`/api/delete/${selectedWork._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!res.ok) {
        throw new Error('Failed to delete work');
      }
  
      const updatedWorks = works.filter((work) => work._id !== selectedWork._id);
      setWorks(updatedWorks);
      setSelectedWork(null);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting work:', error);
      // Handle error as needed (e.g., show an error message)
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  

  return (
    <>
      <StaffNavbar />
      <div className={styles.line} />
      <h1 className={styles['textwork']}>WORK</h1>
      <div className={styles['home-page']}>
        <div className={styles['works-list']}>
          {works.map((work) => (
            <div
              key={work._id}
              onClick={() => handleWorkClick(work._id)}
              className={styles['work-item']}
              tabIndex="1"
            >
              <img
                src={work.picture}
                alt={`Image for ${work.title}`}
                style={{ width: '100px', height: 'auto', borderRadius: '10px' }}
              />
              <div className={styles['work-details']}>
                <div className={styles['work-title']}>{work.title}</div>
                <div>{work.scholarshipHours}</div>
              </div>
            </div>
          ))}
        </div>
        <div className={styles['vertical-line']}></div>
        <div className={styles['work-details']}>
          {selectedWork ? (
            <>
              <div className={styles['button-container']}>
                <button className={styles['close-button']} onClick={() => setSelectedWork(null)}>Close</button>
              </div>

              <div className={styles['work-image']}>
                  <img src={selectedWork.picture}/>
              </div>
              <h2>{selectedWork.title}</h2>
              <p>Location: {selectedWork.location}</p>
              <div className={styles['details-info']}>
                <h3>Date & Time Schedule</h3>
                <ul>
                  {selectedWork.datetime.map((dateTime, index) => (
                    <li key={index}>
                      {dateTime.start} to {dateTime.end}
                      {dateTime.hours && (
                        <span> | Scholarship Hours: {dateTime.hours}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={styles['button-container']}>
              <button className={styles['delete-button']} onClick={() => setIsDeleteModalOpen(true)}>Delete</button>
                <DeleteModal
                  isOpen={isDeleteModalOpen}
                  onClose={() => setIsDeleteModalOpen(false)}
                  onDelete={handleDeleteConfirmed}
                />
                <button className={styles['share-button']}>
                  Share
                </button>
              </div>
              <div className={styles['contact-section']}>
                <div className={styles['title-container']}>
                  <h3
                    className={!selectedContact && !selectedStudentApplied ? styles['active-title'] : ''}
                    onClick={() => {
                      setSelectedContact(null);
                      setSelectedStudentApplied(false);
                    }}
                  >
                    Details
                  </h3>

                  <h3
                    className={selectedStudentApplied ? styles['active-title'] : ''}
                    onClick={() => {
                      setSelectedContact(false);
                      setSelectedStudentApplied(true);
                    }}
                  >
                    Student Applied
                  </h3>
                  <h3
                    className={selectedContact ? styles['active-title'] : ''}
                    onClick={() => {
                      setSelectedContact(true);
                      setSelectedStudentApplied(false);
                    }}
                  >
                    Student Progress
                  </h3>
                </div>
                {selectedContact ? (
                    <div className={styles['list-info']}>
                      <div>Nam</div>
                      <div>Status</div>
                      <div>Action</div>
                      <div className={styles['name-section']}>
                        {progressStudents.map((student) => (
                          <div key={student.id} className={styles['student-entry']}>
                            <div>{student.name}</div>
                            <div>{student.status}</div>
                          </div>
                        ))}
                      </div>

                      <div className={styles['action-section']}>
                        {progressStudents.map((student) => (
                          <div key={student.id} className={styles['button-entry']}>
                            <div className={styles['button-group']}>
                              <button className={styles['accept-button']} onClick={() => completeStudent(student.id)}>
                                Complete
                              </button>
                              <button className={styles['reject-button']} onClick={() => incompleteStudent(student.id)}>
                                Incomplete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : selectedStudentApplied ? (
                    <div className={styles['list-info']}>
                      <div>Name</div>
                      <div>Status</div>
                      <div>Response</div>
                  
                      <div className={styles['name-section']}>
                        {selectedWork.studentList
                          .filter((student) => student.status === 'pending') // Filter out students with status 'pending'
                          .map((student) => (
                            <div key={student.id} className={styles['student-entry']}>
                              <div>{student.studentName}</div>
                              <div>{student.status}</div>
                            </div>
                          ))}
                      </div>
                  
                      <div className={styles['action-section']}>
                        {selectedWork.studentList
                          .filter((student) => student.status === 'pending') // Filter out students with status 'pending'
                          .map((student) => (
                            <div key={student.id} className={styles['button-entry']}>
                              <div className={styles['button-group']}>
                                <button className={styles['accept-button']} onClick={() => acceptStudent(student.id)}>
                                  Accept
                                </button>
                                <button className={styles['reject-button']} onClick={() => declineStudent(student.id)}>
                                  Decline
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ) : (
                <div className={styles['details-info']}>
                  <div className={styles['details-info']}>
                    <h3>Description</h3>
                    <p>{selectedWork.details}</p>
                  </div>
                  <div className={styles['details-info']}>
                    <h3>Qualification</h3>
                    <p>{selectedWork.qualification}</p>
                  </div>
                  <div className={styles['details-info']}>
                    <h3>Contact</h3>
                    <p>{selectedWork.contacts}</p>
                  </div>
              </div>
                  )}
            </div>
          </>
          ) : (
            <div className={`${styles['no-works-message-s']} ${selectedWork ? styles['hidden'] : ''}`}>
              <div className={styles['approve-title']}>Approval Status List</div>
              <div className={`${styles['details-info']}`}>
                {works.map((work, index) => (
                  <div key={index} className={styles['work-entry']} onClick={() => handleWorkClick(work.id)}>
                    <div className={styles['work-image']}>
                      <img src={work.image} alt={`Work ${index + 1}`} />
                    </div>
                    <div className={styles['work-title']}>
                      <div>{work.title}</div>
                      <div>{work.hours}</div>
                    </div>
                    <div className={styles['work-status']}>
                      <div>{work.workStatus}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}