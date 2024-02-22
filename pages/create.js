import React, { useEffect, useState } from 'react';
import styles from '../styles/Create.module.css';
import CreateNavBar from '/components/createNavbar';
import { set } from 'mongoose';

export default function Create() {

  

  const url = "http://localhost:3000/api/posts/scholarshipWork";

  const [formData, setFormData] = useState({
    picture: null,
    title: "",
    datetime: [{ startDate: "", endDate: "", workingHours: "" }], // Initialize with one empty date-time field
    location: "",
    description: "",
    qualification: "",
    contacts: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log(data);

  };


  const handlePictureChange = (event) => {
    const file = event.target.files[0];

    // Create a new FormData object and append the file
    const formDataObject = new FormData();
    formDataObject.append('picture', file);

    setFormData((prevData) => ({
      ...prevData,
      picture: formDataObject, // Set the entire FormData object for the picture
    }));
  };


  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const addDateTime = () => {
    setFormData((prevData) => ({
      ...prevData,
      datetime: [...prevData.datetime, { start: '', end: '', hours: '' }],
    }));
  };

  const removeDateTime = (index) => {
    const newDateTime = [...formData.datetime];
    newDateTime.splice(index, 1);
    setFormData((prevData) => ({
      ...prevData,
      datetime: newDateTime,
    }));
  };

  const handleDateTimeChange = (index, field, value) => {
    const newDateTime = [...formData.datetime];
    newDateTime[index][field] = value;
    setFormData((prevData) => ({
      ...prevData,
      datetime: newDateTime,
    }));
  };





  return (
    <>
      <CreateNavBar />
      <div className={styles['create-page']}>
        <h2 className={styles['create-text']}>
          Create Scholarship Work
        </h2>
        <div className={styles['parent-container']}>
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
                  <div class="item3"className={styles['container-form']}>
                    <label htmlFor="title">Title</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
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

                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
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
                </div>
              </form>
            </div>
          </div>
          <div className={styles['float-child']}>
            <div className={styles['form-container']}>
              <form class="item3" onSubmit={handleSubmit} className={styles['create-form']}>
                <div className={styles['form-column']}>
                  <div  className={styles['container-form']}>
                    {formData.datetime.map((dateTime, index) => (
                      <div key={index}>
                        <label htmlFor={`start${index}`}>Start Date and Time of Work {index + 1}</label>
                        <input
                          type="datetime-local"
                          id={`start${index}`}
                          name={`start${index}`}
                          value={dateTime.start}
                          onChange={(e) => handleDateTimeChange(index, 'startDate', e.target.value)}
                          required
                        />

                        <label htmlFor={`end${index}`}>End Date and Time of Work {index + 1}</label>
                        <input
                          type="datetime-local"
                          id={`end${index}`}
                          name={`end${index}`}
                          value={dateTime.end}
                          onChange={(e) => handleDateTimeChange(index, 'endDate', e.target.value)}
                          required
                        />

                        <label htmlFor={`hours${index}`}>Scholarship Hours for Work {index + 1}</label>
                        <input
                          type="number"
                          id={`hours${index}`}
                          name={`hours${index}`}
                          value={dateTime.hours}
                          onChange={(e) => handleDateTimeChange(index, 'workingHours', e.target.value)}
                          required
                        />

                        <button className={styles['remove-box']} type="button" onClick={() => removeDateTime(index)}>
                          Remove
                        </button>
                      </div>
                    ))}
                    <div>
                      <button className={styles['datetime-box']} type="button" onClick={addDateTime}>
                        Add Date and Time
                      </button>
                    </div>
                    
                  </div>
                </div>
                <div className={styles['form-button-container']}>
                    <input type="submit" value="Submit" />
                  </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}