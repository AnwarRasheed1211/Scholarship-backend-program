import Link from 'next/link';
import styles from '../components/home.module.css';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import CreateForm from '../components/Creatework';
import NavBar from '@/components/Navbar';
import { useSession } from 'next-auth/react';





export default function Home() {

  const [noWorksMessage, setNoWorksMessage] = useState('');
  const [works, setWorks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateFormVisible, setCreateFormVisible] = useState(false);
  const [selectedWork, setSelectedWork] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedQualification, setSelectedQualification] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [hoursFilter, setHoursFilter] = useState('');
  const [isApplyModalVisible, setApplyModalVisible] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [semesterFilter, setSemesterFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const { data, status } = useSession();

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
    setSelectedWork(works.find((work) => work._id === workId));
  };
  
  const url = "http://localhost:3000/api/posts/scholarshipWork";
  
  const applyWork = async () => {
    if (!data?.user) {
      console.error("User not logged in");
      return;
    }
  
    const studentName = `${data.user?.name}`; // assuming that data.user has a 'name' property
    const studentEmail = `${data.user?.email}`; 
    const workId = selectedWork._id;
    const status = 'Applied';
  
    console.log('studentName:', studentName);
    console.log('studentEmail:', studentEmail);
    console.log('status:', status);
  
    try {
      // Modify the fetch request to use the prepared query parameters
      const res = await fetch(`/api/posts/addStudent`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          id: workId,
          studentName: studentName,
          studentEmail: studentEmail,
          status: status
        }),
      });
      
  
      if (!res.ok) {
        const { message } = await res.json();
        console.error(message);
        if (message === 'User has already applied to this work') {
          alert('You have already applied to this work');
        } else if (message === "Applicant list for this work is full") {
          alert(message);
        }
      } else {
        res.json().then(data => {
          console.log('PUT request successful:', data);
          if (data.limitReached) {
            alert("Applicant list for this work is full");
          } else {
            alert('Work Applied Success');
            // You can update the UI or perform any necessary actions here based on the response data
          }
        });
      }
  
    } catch (error) {
      console.error('Failed to apply work:', error);
    }
  };
  
  
  const filteredWorks = works
  ? works
      .filter(work => {
        if (selectedStatus === 'all') {
          return true;
        }
        // Check if any student in the studentList array has the selectedStatus and if the student name matches the current user's name
        return work.studentList.some(
          student => student.status === selectedStatus && student.studentName === data?.user?.name
        );
      })
      .sort((a, b) => {
        const startDateA = new Date(a.start);
        const startDateB = new Date(b.start);
        const endDateA = new Date(a.end);
        const endDateB = new Date(b.end);

        // Compare start dates
        if (startDateA > startDateB) return -1;
        if (startDateA < startDateB) return 1;

        // If start dates are equal, compare end dates
        if (endDateA > endDateB) return -1;
        if (endDateA < endDateB) return 1;

        return 0;
      })
  : [];


  
  const handleStatusClick = (status) => {
    setSelectedStatus(status);
  };

  const handleCloseClick = () => {
    setSelectedWork(null); // Reset selectedWork when the Close button is clicked
    setCreateFormVisible(false); // Hide create form if it's open
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    let month = (date.getMonth() + 1).toString();
    month = month.length === 1 ? '0' + month : month; // Add leading zero if needed
    let day = date.getDate().toString();
    day = day.length === 1 ? '0' + day : day; // Add leading zero if needed
    return `${year}-${month}-${day}`;
  };

  const formatdate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getUTCDate().toString().padStart(2, '0'); // Add leading zero if needed
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Add leading zero if needed
    const year = date.getUTCFullYear();
    const hours = date.getUTCHours().toString().padStart(2, '0'); // Add leading zero if needed
    const minutes = date.getUTCMinutes().toString().padStart(2, '0'); // Add leading zero if needed
    return `${day}/${month}/${year} - ${hours}:${minutes}`;
  };
  
  const filteredWorksByFilters = works
  .filter((work) => {
    const matchesHours = !hoursFilter || work.hours === parseInt(hoursFilter);
    const matchesStatus = work.workStatus === "Accepted";
    return matchesHours && matchesStatus;
  })
  .filter((work) => {
    const matchesSemester = !semesterFilter || work.semester === semesterFilter;
    return matchesSemester;
  })
  .filter((work) => {
    const matchesLocation = !locationFilter || work.location.toLowerCase().includes(locationFilter.toLowerCase());
    return matchesLocation;
  })
  .filter((work) => {
    const matchesStartDate = !startDateFilter || formatDate(work.start) === startDateFilter;
    return matchesStartDate;
  })
  .filter((work) => {
    const matchesEndDate = !endDateFilter || formatDate(work.end) === endDateFilter;
    return matchesEndDate;
  })
  .sort((a, b) => {
    const startDateA = new Date(a.start);
    const startDateB = new Date(b.start);
    const endDateA = new Date(a.end);
    const endDateB = new Date(b.end);

    // Compare start dates
    if (startDateA > startDateB) return -1;
    if (startDateA < startDateB) return 1;

    // If start dates are equal, compare end dates
    if (endDateA > endDateB) return -1;
    if (endDateA < endDateB) return 1;

    return 0;
  });

  const handleHoursFilterChange = (e) => {
    setHoursFilter(e.target.value);
  };

  const toggleFilterBox = () => {
    setFilterOpen((prevOpen) => !prevOpen);
  };

  const handleSemesterFilterChange = (e) => {
    setSemesterFilter(e.target.value);
  };

  const handleLocationFilterChange = (e) => {
    setLocationFilter(e.target.value);
  };

  const handleStartDateFilterChange = (e) => {
    setStartDateFilter(e.target.value);
  };

  const handleEndDateFilterChange = (e) => {
    setEndDateFilter(e.target.value);
  };


  return (
    <>
    <NavBar />
      <div className={styles.line} />
      <div className={styles['work-header']}>
        <h1 className={styles['textwork']}>WORK AVAILABLE</h1>
        {/* Semester Filter Input */}
        <div className={styles['filter-container']}>
          <button onClick={toggleFilterBox} className={styles['filter-button']}>
            Filter
          </button>
          {/* Filter Box */}
          {filterOpen && (
            <div className={styles['filter-box']}>
              {/* Design your filter box here */}
              <input
                type="number"
                placeholder="Enter working hours (e.g 3/4/5)"
                value={hoursFilter}
                onChange={handleHoursFilterChange}
                className={styles['semester-filter-input']}
              />
              <input
                type="text"
                placeholder="Enter semester"
                value={semesterFilter}
                onChange={handleSemesterFilterChange}
                className={styles['filter-input']}
              />
              <input
                type="text"
                placeholder="Enter location"
                value={locationFilter}
                onChange={handleLocationFilterChange}
                className={styles['filter-input']}
              />
              <div>Start Date</div>
              <input
                type="date"
                placeholder="Start date"
                value={startDateFilter}
                onChange={handleStartDateFilterChange}
                className={styles['filter-input']}
              />
              <div>End Date</div>
              <input
                type="date"
                placeholder="End date"
                value={endDateFilter}
                onChange={handleEndDateFilterChange}
                className={styles['filter-input']}
              />
            </div>
          )}
        </div>
      </div>
      <div className={styles['home-page']}>
        <div className={styles['works-list']}>
        {filteredWorksByFilters.length === 0 ? (
            <div className={styles['no-works-message']}>Work with specified hours not available</div>
          ) : (
            filteredWorksByFilters.map((work) => (
              <div
                key={work._id}
                onClick={() => handleWorkClick(work._id)}
                className={styles['work-item1']}
                tabIndex="1"
              >
                <Image
                  src={work.picture}
                  alt={`Image for ${work.title}`}
                  width={100} height={100}
                  style={{ width: '100px', height: 'auto', borderRadius: '10px' }}
                />
                <div className={styles['work-details']}>
                  <div className={styles['term-box']}>
                    <h3>Term {work.semester}</h3>
                  </div>
                  <div className={styles['work-title']}>{work.title}</div>
                  <div>Place: {work.location}</div>
                  <div className={styles['work-scholarship']}>
                    <h3>Start date</h3>
                    <div className={styles['work-scholarhour']}>{formatdate(work.start)}</div>
                    <h4 className={styles['work-scholarhour']}>{work.hours} Given Hours</h4>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className={styles['vertical-line']}></div>

        <div className={styles['work-details']}>
          {selectedWork ? (
            <>  
              <button className={styles['close-button']} onClick={handleCloseClick}>
                  Close
              </button>
              <div className={styles['work-image']}>
                <Image src={selectedWork.picture} width={100} height={50} />
              </div>
              <h2>Term {selectedWork.semester} </h2>
              <div className={styles['work-scholarship']}>
                <h3 className={styles['work-title']}>{selectedWork.title}</h3>
                <p>Location: {selectedWork.location}</p>
              </div>
              
              <div className={styles['details-info']}>
                <h3>Date & Time Schedule</h3>
                  <ul>
                      <div>
                      {formatdate(selectedWork.start)} to {formatdate(selectedWork.end)}
                        {selectedWork.hours && (
                          <span> | Scholarship Hours: {selectedWork.hours}</span>
                        )}
                      </div>
                  </ul>
              </div>
              
              
              <div className={styles['contact-section']}>
                <div className={styles['title-container']}>
                    <h3>Student Applicants: {selectedWork.studentList.filter(student => student.status === 'Accepted' || student.status === 'Completed' || student.status === 'Incompleted').length} of {selectedWork.limit}</h3>
                </div>
                <div className={styles['details-info']}> 
                  <div>
                    <ol>
                      {selectedWork.studentList
                         // Filter out students with status 'Applied'
                        .map((student, index) => (
                          <li key={student.id} className={styles['student-entry']}>
                            {index + 1}. {student.studentName}  ( {student.status} )
                          </li>
                        ))}
                    </ol>
                  </div>
                </div>
              </div>
              


              <div className={styles['button-container']}>
              <button className={styles['apply-button']} onClick={applyWork}>
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
                <div className={styles['status-buttons1']}>
                  <button onClick={() => handleStatusClick('all')}>Status</button>
                  <button onClick={() => handleStatusClick('Applied')}>Applied</button>
                  <button onClick={() => handleStatusClick('Accepted')}>Accepted</button>
                  <button onClick={() => handleStatusClick('Rejected')}>Rejected</button>
                </div>
                {filteredWorks.length === 0 ? (
                  <div className={styles['filter-message']}>No works with the status "{selectedStatus}" yet.</div>
                ) : (
                  <div>
                    {filteredWorks
                      .filter((work) => work.workStatus === "Accepted")
                      .filter(work => work.studentList.some(student => student.studentName === data?.user?.name))
                      .filter(work => !work.studentList.some(student => student.status === "Completed" || student.status === "Incomplete"))
                      .map((work) => (
                        <div key={work.id} className={styles['work-entry1']} onClick={() => handleWorkClick(work._id)}>
                          <div className={styles['work-image']}>
                            <Image src={work.picture} alt={`Work ${work.id}`} width={100} height={50} />
                          </div>
                          <div className={styles['work-details']}>
                            <div className={styles['term-box1']}>
                              <h3>Term {work.semester}</h3>
                            </div>
                            <div className={styles['work-title']}>{work.title}</div>
                            <div>Location: {work.location}</div>
                            <div className={styles['work-scholarship']}>
                                <div className={styles['unbold']}>
                                  <li>
                                  {formatdate(work.start)} to {formatdate(work.end)}
                                    {work.hours && (
                                      <span> | Scholarship Hours: {work.hours}</span>
                                    )}
                                  </li>
                                </div>
                            </div>
                          </div>
                          
                          <div className={styles['work-status']}>
                            <div>
                              {work.studentList.map((student, idx) => (
                                <div key={idx}>
                                  {student.studentName === data?.user?.name && ( // Check if the student name matches the current user's name
                                    <span>{student.status}</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>

  );
}