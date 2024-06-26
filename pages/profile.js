import Link from 'next/link';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import ProfileNavbar from '/components/profileNavbar';
import styles from '../components/home.module.css';
import { useSession } from 'next-auth/react';

export default function Profile() {
  const { data, status } = useSession();
  const [works, setWorks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  // Filter works based on the user's status
  const userWorks = works.filter(work =>
    work.studentList.some(
      student =>
        student.studentName === data?.user?.name &&
        (student.status === 'Completed' || student.status === 'Incompleted')
    )
  );

  // Extract unique semesters from the filtered works
  const uniqueSemesters = [...new Set(userWorks.map(work => work.semester))];

  const totalHoursBySemester = uniqueSemesters.reduce((acc, semester) => {
    const totalHours = userWorks
      .filter(work => work.semester === semester)
      .filter(work => work.workStatus === "Accepted")
      .reduce((sum, work) => {
        const completedHours = work.studentList.reduce((sum, student) => {
          if (student.status === 'Completed') {
            return sum + (work.hours || 0);
          }
          return sum;
        }, 0);
        return sum + completedHours;
      }, 0);
    return { ...acc, [semester]: totalHours };
  }, {});

  const formatdate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getUTCDate().toString().padStart(2, '0'); // Add leading zero if needed
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Add leading zero if needed
    const year = date.getUTCFullYear();
    const hours = date.getUTCHours().toString().padStart(2, '0'); // Add leading zero if needed
    const minutes = date.getUTCMinutes().toString().padStart(2, '0'); // Add leading zero if needed
    return `${day}/${month}/${year} - ${hours}:${minutes}`;
  };

  return (
    <>
      <ProfileNavbar />
      <div className={styles.line} />
      <h1 className={styles['textProfile']}>
        PROFILE
      </h1>
      <div className={styles['home-page']}>
        <div className={styles['profileSection']}>
          <div className={styles['profilePictureContainer']}>
            <Image src="/profile_pic.png" className={styles['profilePicture']} alt="Profile Picture" width={100} height={100} />
          </div>
          <div className={styles['profileContent']}>
            <div className={styles['infoBox']}>
              <div className={styles['infoTitle']}>
                {` ${data?.user?.name}`}
              </div>
            </div>
            <div className={styles['infoBox']}>
              <div className={styles['infoTitle']}>
                {` ${data?.user?.email}`}
              </div>
            </div>
          </div>
        </div>
        <table className={styles['box']}></table>
        <div className={styles['detailSection']}>
          <div className={styles['bottomDetail']}>
            <div className={styles['title-container']}>
              <h3>
                Work History
              </h3>
            </div>

            {/* Display unique semesters and corresponding works */}
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              uniqueSemesters.map(semester => (
                <div key={semester}>
                  {userWorks
                    .filter(work => work.semester === semester) // Filter works by semester
                    .filter(work => work.workStatus === "Accepted") // Display only works with "Accepted" status
                    .some(work => work.studentList.some(student => student.status === 'Completed' || student.status === 'Incompleted'))
                    ? (
                      <div className={styles['details-info']}>
                        <h3 className={styles['textwork2']}>
                            Term {semester} | Total Hours: {totalHoursBySemester[semester]} / 60
                        </h3>
                        <div className={styles['details-info']}>
                          {userWorks
                            .filter(work => work.semester === semester) // Filter works by semester
                            .filter(work => work.workStatus === "Accepted") // Display only works with "Accepted" status
                            .filter(work => work.studentList.some(student => student.studentName === data?.user?.name))
                            .filter(work => work.studentList.some(student => student.status === 'Completed' || student.status === 'Incompleted'))
                            .map(work => (
                              <div key={work._id} className={styles['work-entry1']}>
                                <div className={styles['work-image']}>
                                  <img src={work.picture} alt={`Work ${work.id}`} />
                                </div>
                                <div className={styles['work-title']}>
                                  <div>{work.title}</div>
                                  <div className={styles['unbold']}>
                                    <ul>
                                      <div>
                                        {formatdate(work.start)} to {formatdate(work.end)}
                                        {work.hours && (
                                          <span> | Scholarship Hours: {work.hours}</span>
                                        )}
                                      </div>
                                    </ul>
                                  </div>
                                </div>
                                <div className={styles['work-status']}>
                                  <div>
                                    {work.studentList
                                      .filter(student => student.status === 'Completed' || student.status === 'Incompleted')
                                      .map((student, idx) => (
                                        student.studentName === data?.user?.name ? (
                                          <span key={idx}>{student.status}</span>
                                        ) : null
                                      ))}
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    ) : null
                  }
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}