const [formData, setFormData] = useState({
  semester: "",
  picture: "https://upload.wikimedia.org/wikipedia/en/5/50/Assumption_University_of_Thailand_%28logo%29.png",
  title: "",
  start: "",
  end: "", 
  hours: "",
  location: "",
  limit:"",
  details: "",
  qualification: "",
  contacts: "",
  workStatus: "Pending",
  organizerN: "",
  organizer: "",
  rejectMessage: "",
});

const handleSubmit = async (event) => {
  event.preventDefault();

  if (!data?.user) {
    console.error("User not logged in");
    return;
  }
  
  const userName = data.user.name;
  const userEmail = data.user.email;
  const startDate = new Date(formData.start);
  const endDate = new Date(formData.end);
  let semester;

  // Check if start and end dates are valid
  if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
    const startMonth = startDate.getMonth();
    const endMonth = endDate.getMonth();
  
    // Determine semester based on the month of the start and end dates
    if ((startMonth >= 10 && startMonth <= 11) || (endMonth >= 0 && endMonth <= 2)) {
      // November to March
      const year = startMonth >= 10 ? startDate.getFullYear() : startDate.getFullYear() - 1;
      semester = `2/${year}`;
    } else if ((startMonth >= 5 && startMonth <= 9) || (endMonth >= 5 && endMonth <= 9)) {
      // June to October
      semester = `1/${startDate.getFullYear()}`;      
    } else {
      // Semester not defined
      const year = startMonth >= 10 ? startDate.getFullYear() : startDate.getFullYear() - 1;
      semester = `3/${year}`; 
    }
  } else {
    // Invalid date format
    console.error("Invalid date format");
    return;
  }
  

  const updatedFormData = {
    ...formData,
    semester: semester,
    organizerN: userName,
    organizer: userEmail,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(updatedFormData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseData = await response.json();
    alert("Work created successfully");
    console.log(responseData);
  } catch (error) {
    console.error("Error creating work", error);
    alert("Error creating work");
  }
};

const handleChange = (event) => {
  const { name, value } = event.target;
  setFormData((prevData) => ({
    ...prevData,
    [name]: value,
  }));
};