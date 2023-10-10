import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios'; // Import Axios for making HTTP requests
import styles from '../styles/Create.module.css';
import CreateNavBar from '/components/createNavbar';
import { useRouter } from 'next/router';

export default function Create() {

  const [formData, setFormData] = useState({
    picture: null,
    title: '',
    datetimeStartDate: '',
    datetimeStartTime: '',
    datetimeEndDate: '',
    datetimeEndTime: '',
    scholarshipHours: '',
    location: '',
    details: '',
    qualification: '',
    contacts: '',
  });
  

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      // Send a POST request to your Next.js API route
      const response = await axios.post('/api/scholarshipWork', formData);
  
      // Optionally, you can handle success or display a message to the user
      console.log('Response from server:', response.data);
    } catch (error) {
      console.error('Error posting data:', error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePictureChange = (event) => {
    const file = event.target.files[0]; // Get the first selected file (if multiple files are allowed)

    // You can store the file in the form data or handle it as needed.
    setFormData((prevData) => ({
      ...prevData,
      picture: file,
    }));
  };

  return (
    <>
      <CreateNavBar />
      <div className={styles['create-page']}>
        <h2 className={styles['create-text']}>
          Create Scholarship Work
        </h2>
        <div className={styles['praent=-container']}>
          <div className={styles['float-child']}>
            <div className={styles['upload-pic']}>
              <label htmlFor="picture">Upload Picture</label>
              <input
                type="file"
                id="picture"
                name="picture"
                accept="image/*"
                onChange={handlePictureChange}
              />
            </div>
          </div>

          <div className={styles['float-child']}>
            <div className={styles['form-container']}>
              <form onSubmit={handleSubmit} className={styles['create-form']}>
                <div className={styles['form-column']}>
                  <div className={styles['container-form']}>
                    <label htmlFor="title">Title</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />

                    <label htmlFor="datetimeStartDate">Start Date</label>
                    <input
                      type="date"
                      id="datetimeStartDate"
                      name="datetimeStartDate"
                      value={formData.datetimeStartDate}
                      onChange={handleChange}
                      required
                    />

                    <label htmlFor="datetimeStartTime">Start Time</label>
                    <input
                      type="time"
                      id="datetimeStartTime"
                      name="datetimeStartTime"
                      value={formData.datetimeStartTime}
                      onChange={handleChange}
                      required
                    />

                    <label htmlFor="datetimeEndDate">End Date</label>
                    <input
                      type="date"
                      id="datetimeEndDate"
                      name="datetimeEndDate"
                      value={formData.datetimeEndDate}
                      onChange={handleChange}
                      required
                    />

                    <label htmlFor="datetimeEndTime">End Time</label>
                    <input
                      type="time"
                      id="datetimeEndTime"
                      name="datetimeEndTime"
                      value={formData.datetimeEndTime}
                      onChange={handleChange}
                      required
                    />

                    <label htmlFor="scholarshipHours">Scholarship Hours</label>
                    <input
                      type="number"
                      id="scholarshipHours"
                      name="scholarshipHours"
                      value={formData.scholarshipHours}
                      onChange={handleChange}
                      required
                    />

                    <label htmlFor="location">Location of Work</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                    />

                    <label htmlFor="details">Description</label>
                    <textarea
                      id="details"
                      name="details"
                      value={formData.details}
                      onChange={handleChange}
                      rows="4"
                      cols="30"
                      required
                    ></textarea>

                    <label htmlFor="qualification">Qualification</label>
                    <textarea
                      id="qualification"
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleChange}
                      rows="4"
                      cols="30"
                      required
                    ></textarea>

                    <label htmlFor="contacts">Contacts</label>
                    <textarea
                      id="contacts"
                      name="contacts"
                      value={formData.contacts}
                      onChange={handleChange}
                      rows="4"
                      cols="30"
                      required
                    ></textarea>
                  </div>
                  <div className={styles['form-button-container']}>
                    <input type="submit" value="Submit" />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
