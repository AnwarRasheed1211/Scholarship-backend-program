import Link from 'next/link';
import styles from '../components/home.module.css';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import CreateForm from '../components/Creatework';
import NavBar from '../components/Navbar'; 
import { useSession } from 'next-auth/react';





export default function Home() {

  const [works, setWorks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateFormVisible, setCreateFormVisible] = useState(false);
  const [selectedWork, setSelectedWork] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedQualification, setSelectedQualification] = useState(null);
  const [isApplyModalVisible, setApplyModalVisible] = useState(false);
  const { data, status } = useSession();

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleWorkClick = (workId) => {
    const selectedWork = works.find((work) => work._id === workId);
    console.log('Selected Work:', selectedWork);
    setSelectedWork(selectedWork);
  };
  
  const url = "http://localhost:3000/api/posts/scholarshipWork";
  



  const applyWork = async (workId, studentName) => {
    try {
      const response = await fetch(`/api/scholarshipWork/${workId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: studentName }),
      });
  
      if (response.ok) {
        console.log('Student added successfully');
        // Reload works after applying
        const updatedWorks = await (await fetch("/api/scholarshipWork", { cache: "no-store" })).json();
        setWorks(updatedWorks);
      } else {
        console.error('Failed to add student');
      }
    } catch (error) {
      console.error('Error applying for work:', error);
    }
  };
  
  
  
  
  
  

  const handleCloseClick = () => {
    setSelectedWork(null); // Reset selectedWork when the Close button is clicked
    setCreateFormVisible(false); // Hide create form if it's open
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
                  src={work.picture}
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
                <img src={selectedWork.picture}  />
              </div>
              
              <h2>{selectedWork.title}</h2>
              <p>{selectedWork.hours}</p>
              <p>Location: {selectedWork.location}</p>
                
              
              
              <div className={styles['details-info']}>
                <h3>Date & Time Schedule</h3>
                <ul>
                  {selectedWork.datetime.map((dateTime, index) => (
                    <li key={index}>
                      {dateTime.start} to {dateTime.end}
                      {dateTime.hours&& (
                        <span> | Scholarship Hours: {dateTime.hours}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles['button-container']}>
              <button className={styles['apply-button']} onClick={() => applyWork(selectedWork._id)}>
                Apply
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

            </>
          ) : (
            <div className={`${styles['no-works-message-s']} ${selectedWork ? styles['hidden'] : ''}`}>
              <div className={styles['approve-title']}>Work Status</div>
              <div className={`${styles['details-info']}`}>
                {works
                .filter((work) => work.workStatus === "Accepted") // Display only works with "Accepted" status
                .map((work) => (
                  <div key={work.id} className={styles['work-entry']} onClick={() => handleWorkClick(work._id)}>
                    <div className={styles['work-image']}>
                      <img src={work.picture} alt={`Work ${work.id}`} />
                    </div>
                    <div className={styles['work-title']}>
                    <h3>
                      {work.title}
                      </h3>
                      <div className={styles['unbold']} >
                        {work.datetime.map((dateTime, idx) => (
                          <li key={idx}>
                            {dateTime.startDate} {dateTime.startTime} to {dateTime.endDate} {dateTime.endTime}
                            {dateTime.workingHours && (
                              <span> | Scholarship Hours: {dateTime.workingHours}</span>
                            )}
                          </li>
                        ))}
                      </div>
                      <div>
                      Location: {work.location}
                      </div>
                    </div>
                    <div className={styles['work-status']}>
                      <div>{work.studentList.map((dateTime, idx) => (
                          <div key={idx}>
                            {dateTime.status && (
                              <span>{dateTime.status}</span>
                            )}
                          </div>
                        ))}</div>
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