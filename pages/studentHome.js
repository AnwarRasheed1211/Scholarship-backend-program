import Link from 'next/link';
import styles from '../components/home.module.css';
import Image from 'next/image';
import React, { useState } from 'react';
import CreateForm from '../components/Creatework';








export default function Home() {

  const [isCreateFormVisible, setCreateFormVisible] = useState(false);
  const [selectedWork, setSelectedWork] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedQualification, setSelectedQualification] = useState(null);

  const [works, setWorks] = useState([
    {
      id: 1,
      image: '/workpost.png',
      title: 'Work 1',
      description: 'Work 1 Description',
      datetimeStartDate: '2023-10-01',
      datetimeStartTime: '09:00',
      datetimeEndDate: '2023-10-01',
      datetimeEndTime: '12:00',
      scholarshipHours: '3 hours',
      location: 'Work 1 Location',
      qualifications: 'Qualification information 1',
      contacts: 'Contact information 1',
    },
    {
      id: 2,
      image: '/workpost.png',
      title: 'Work 2',
      description: 'Work 2 Description',
      datetimeStartDate: '2023-10-01',
      datetimeStartTime: '09:00',
      datetimeEndDate: '2023-10-01',
      datetimeEndTime: '12:00',
      scholarshipHours: '3 hours',
      location: 'Work 2 Location',
      qualifications: 'Qualification information 2',
      contacts: 'Contact information 2',
    },
  ]);

  

  const handleWorkClick = (workId) => {
    const selectedWork = works.find((work) => work.id === workId);
    setSelectedWork(selectedWork);
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
      <div className={styles.line} />
      <h1 className={styles['textwork']}>
        WORK
      </h1>
      <div className={styles['home-page']}>
        <div className={styles['works-list']}>
          <div>
            {works.map((work) => (
              <div key={work.id} onClick={() => handleWorkClick(work.id)} className={styles['work-item']} tabIndex="1">
                <img src={work.image}
                  alt={`Image for ${work.title}`}
                  style={{ width: '115px', height: 'auto', borderRadius: '25px' }}
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
              <div className={styles['button-container']}>
                <button className={styles['apply-button']} onClick={toggleCreateForm}>
                  Apply
                </button>
                <button className={styles['close-button']} onClick={handleCloseClick}>
                  Closed
                </button>
              </div>

              <div className={styles['selected-image']}>
                <img src={selectedWork.image} alt={`Image for ${selectedWork.title}`} style={{ width: '115px', height: 'auto', borderRadius: '25px' }} />
              </div>
              <h2>{selectedWork.title}</h2>
              <p>{selectedWork.location}</p>
                
            
              <div className={styles['details-info']}>
                <h3>Date & Time Schedule</h3>
                <ul>
                  <li>
                    Start Date: {selectedWork.datetimeStartDate}
                  </li>
                  <li>
                    Start Time: {selectedWork.datetimeStartTime}
                  </li>
                  <li>
                    End Date: {selectedWork.datetimeEndDate}
                  </li>
                  <li>
                    End Time: {selectedWork.datetimeEndTime}
                  </li>
                  {selectedWork.scholarshipHours && (
                    <li>
                      Scholarship Hours: {selectedWork.scholarshipHours}
                    </li>
                  )}
                </ul>
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
                  <p>{selectedWork.qualifications}</p>
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