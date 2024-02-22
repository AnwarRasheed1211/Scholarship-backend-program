import Link from 'next/link';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import RegisterNavbar from '/components/registerNavbar';
import styles from '../components/home.module.css';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue } from "@nextui-org/react";
import Modal from '../components/modal-reject';


export default function Register() {
  const [works, setWorks] = useState([]);
  const [isCreateFormVisible, setCreateFormVisible] = useState(false);
  const [selectedWork, setSelectedWork] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRejectModalOpen, setRejectModalOpen] = useState(false);

  const renderCell = React.useCallback((users, columnKey) => {
    const cellValue = users[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <User
          description={user.email}
          name={cellValue}
          ></User>
        )
      case "status":
        return <div className={styles['work-description']}>{cellValue}</div>;
      case "hour":
        return <div className={styles['work-scholarhour']}>{cellValue}</div>;
      default:
        return cellValue;
    }
  }, []);

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

  const handleWorkClick = (workId) => {
    setSelectedWork(works.find((work) => work._id === workId));
  };


  const handleCloseClick = () => {
    setSelectedWork(null); // Reset selectedWork when the Close button is clicked
    setCreateFormVisible(false); // Hide create form if it's open
  };

  const handleDelete = (workId) => {
    const updatedWorks = works.filter(work => work.id !== workId);
    setWorks(updatedWorks);
    setSelectedWork(null);
  };

  const toggleCreateForm = () => {
    setCreateFormVisible((prevVisible) => !prevVisible);
  };


  const openRejectModal = () => {
    setRejectModalOpen(true);
  };

  const closeRejectModal = () => {
    setRejectModalOpen(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  

  // Assume you have an API endpoint for updating work status
const updateWorkStatus = async (workId, newStatus) => {
  try {
    const res = await fetch(`/api/scholarshipWork/${workId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ workStatus: newStatus }),
    });
    if (!res.ok) {
      throw new Error('Failed to update work status');
    }
  } catch (error) {
    console.error('Error updating work status:', error);
    // Handle error
  }
};

const handleAccept = () => {
  updateWorkStatus(selectedWork._id, 'Accepted')
    .then(() => {
      // Update local state only after successful response from the API
      const updatedWorks = works.map((work) =>
        work._id === selectedWork._id ? { ...work, workStatus: 'Accepted' } : work
      );
      setWorks(updatedWorks);
    })
    .catch((error) => {
      console.error('Error accepting work:', error);
      // Handle error
    });
};


  
  const handleReject = () => {
    // Perform the rejection logic here
    // For example, you can make an API call to update the work status
    // After rejection, close the modal
    closeRejectModal();
  };


  return (
    <>
      <RegisterNavbar />

      <div className={styles.line} />
      <h1 className={styles['textwork']}>
        WORK
      </h1>
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
                src={work.image}
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
                <button className={styles['accept-button']} onClick={handleAccept}>
                  Accept
                </button>
                <button className={styles['reject-button']} onClick={openRejectModal}>
                  Reject
                </button>

                <Modal
                  isOpen={isRejectModalOpen}
                  onClose={closeRejectModal}
                  onConfirm={handleReject}
                />

                <button className={styles['close-button']} onClick={handleCloseClick}>
                  Close
                </button>
              </div>

              <div className={styles['work-image']}>
                  <img src={selectedWork.image}/>
              </div>
              <h2>{selectedWork.title}</h2>
              <p>{selectedWork.description}</p>
              <p>Location: {selectedWork.location}</p>
              <div className={styles['details-info']}>
                <h3>Date & Time Schedule</h3>
                <ul>
                  {selectedWork.datetime.map((dateTime, index) => (
                    <li key={index}>
                      {dateTime.startDate} - {dateTime.startTime} to {dateTime.endDate} - {dateTime.endTime}
                      {dateTime.workingHours && (
                        <span> | Scholarship Hours: {dateTime.workingHours}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles['contact-section']}>
                <div className={styles['title-container']}>
                  <h3
                    className={!selectedContact}
                    onClick={() => {
                      setSelectedContact(null);
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
  )
}