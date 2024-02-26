import Link from 'next/link';
import styles from '../components/home.module.css';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import CreateForm from '../components/Creatework';
import NavBar from '@/components/Navbar';







export default function Home() {

  const [works, setWorks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateFormVisible, setCreateFormVisible] = useState(false);
  const [selectedWork, setSelectedWork] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedQualification, setSelectedQualification] = useState(null);
  const [isApplyModalVisible, setApplyModalVisible] = useState(false);
  const [progressStudents, setProgressStudents] = useState([]);
  const [appliedWorks, setAppliedWorks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/scholarshipWork", { cache: "no-store" });
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleWorkClick = (workId) => {
    const selectedWork = works.find((work) => work._id === workId);
    console.log('Selected Work:', selectedWork);
    setSelectedWork(selectedWork);
  };
  

  const applyWork = async (workId, studentName) => {
    console.log('Selected Work ID:', workId);
    try {
      console.log("Applying for work with ID:", workId); // Add this logging statement
  
      const res = await fetch(`/api/appliedStudents/${workId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentName: "New Student" }), // Pass the actual student's name here
      });
      
      if (!res.ok) {
        throw new Error('Failed to apply for work');
      }
  
      // Assuming the response contains the updated work with the applied student
      const updatedWork = await res.json();
      
      // Update the local state with the updated work
      setWorks((prevWorks) => prevWorks.map((work) => (work.id === workId ? updatedWork : work)));
      setSelectedWork(updatedWork);
      setAppliedWorks((prevAppliedWorks) => [...prevAppliedWorks, { ...updatedWork, id: workId }]);
    } catch (error) {
      console.error('Error applying for work:', error);
      // Handle error
    }
  };
  
  
  
  

  const handleCloseClick = () => {
    setSelectedWork(null); // Reset selectedWork when the Close button is clicked
    setCreateFormVisible(false); // Hide create form if it's open
  };

  const handleApply = (workId, studentName) => {
    const selectedWork = works.find((work) => work.id === workId);
    const isStudentApplied = selectedWork.studentApplied.some(
      (student) => student.name === studentName
    );

    if (!isStudentApplied) {
      // Make a copy of the selected work
      const updatedWork = { ...selectedWork };
      // Initialize studentApplied as an array if it's not already
      updatedWork.studentApplied = updatedWork.studentApplied || [];
      // Add the new student to the studentApplied array of the selected work
      updatedWork.studentApplied.push({ name: "New Student", status: 'pending' });
      // Update the state with the modified selected work
      setWorks(
        works.map((work) => (work.id === workId ? updatedWork : work))
      );
    }
  };

  const toggleCreateForm = () => {
    setCreateFormVisible((prevVisible) => !prevVisible);
  };


  return (
    <>
    <NavBar />
      <div className={styles.line} />
      <h1 className={styles['textwork']}>
        WORK
      </h1>
      <div className={styles['home-page']}>
        <div className={styles['works-list']}>
          <div>
            {works
              .filter((work) => work.workStatus === "Accepted") // Display only works with "Accepted" status
              .map((work) => (
                <div
                  key={work._id}
                  onClick={() => handleWorkClick(work._id)}
                  className={styles['work-item']}
                  tabIndex="1"
                >
                <img
                  src={work.image}
                  alt={`Image for ${work.title}`}
                  style={{ width: '100px', height: 'auto', borderRadius: '10px' }}
                />
                <div className={styles['work-details']}>
                  <div className={styles['work-title']}>{work.title}</div>
                  <div className={styles['work-scholarhour']}>{work.hours}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles['vertical-line']}></div>

        <div className={styles['work-details']}>
          {selectedWork ? (
            <>
              
              <button className={styles['close-button']} onClick={handleCloseClick}>
                  Close
              </button>
              <div className={styles['work-image']}>
                <img src={selectedWork.image}  />
              </div>
              
              <h2>{selectedWork.title}</h2>
              <p>{selectedWork.hours}</p>
              <p>Location: {selectedWork.location}</p>
                
              
              
              <div className={styles['details-info']}>
                <h3>Date & Time Schedule</h3>
                <ul>
                  {selectedWork.datetime.map((dateTime, index) => (
                    <li key={index}>
                      {dateTime.startDate} - {dateTime.startTime} to {dateTime.endDate} - {dateTime.endTime}
                      {dateTime.scholarshipHours && (
                        <span> | Scholarship Hours: {dateTime.scholarshipHours}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles['button-container']}>
              <button className={styles['apply-button']} onClick={() => applyWork(selectedWork._id, "New Student")}>
                Apply
              </button>


                
                <button className={styles['share-button']} onClick={handleCloseClick}>
                  Share
                </button>
              </div>

              <div className={styles['contact-section']}>
                <div className={styles['title-container']}>
                  <h3
                    className={!selectedContact}
                    onClick={() => {
                      setSelectedContact(null);
                      setSelectedQualification(false);
                    }}
                  >
                    Details
                  </h3>
                </div>

                <div className={styles['details-info']}>
                  <h3>Description</h3>
                  <p>{selectedWork.description}</p>
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

            </>
          ) : (
            <div className={styles['no-works-message']} >
              <img
                src="/workposter.png"
                alt="No Works"
                className={styles['no-works-image']
                }
              />
              <h3 >There are scholarship works</h3>
              <p>Select work for seeing more detail</p>
            </div>
          )}
        </div>
      </div>
    </>

  );
}