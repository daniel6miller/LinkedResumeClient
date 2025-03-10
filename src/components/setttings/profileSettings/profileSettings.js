import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext'; // Import useAuth hook
import './profileSettings.css';

const ProfileSettings = ({ onClose }) => {


  const navigate = useNavigate();
  const { login } = useAuth();

  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    // Add other fields as necessary
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const validateForm = () => {
    let tempErrors = {};
    
    // Validate required fields
    if (!values.firstName) {
      tempErrors.firstName = "What's your first name?";
    }
    if (!values.lastName) {
      tempErrors.lastName = "What's your last name?";
    }
  
    // Validate email format using a regular expression
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!values.email) {
      tempErrors.email = "Email is required.";
    } else if (!emailPattern.test(values.email)) {
      tempErrors.email = "Please enter a valid email address.";
    }
  
    // Add other validations for password, etc.
  
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;  // Return true if no errors
  };
      
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      console.error('Validation errors', errors);
      return; // Stop the form from submitting if there are validation errors
    }

    // Check if there is an account associated with email
    try {
      const emailCheckResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/user/check-email/${values.email}`);
      const emailCheckData = await emailCheckResponse.json();

      if (!emailCheckResponse.ok) {
        throw new Error(emailCheckData.message || 'Error checking accounts associated to email');
      }

      if (!emailCheckData.available) {
        setErrors({ ...errors, email: 'This email already has an account associated to it.' });
        return; // Stop submission if email is not available
      }
    } catch (error) {
      console.error('Error checking email:', error);
      setErrors((prevErrors) => ({ ...prevErrors, email: 'This email already has an account associated with it.' }));
      return; // Stop submission if there was an error
    }

      // Check if the username is already in use
    try {
      const usernameCheckResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/user/check-username/${values.username}`);
      const usernameCheckData = await usernameCheckResponse.json();

      if (!usernameCheckResponse.ok) {
        throw new Error(usernameCheckData.message || 'Error checking username');
      }

      if (!usernameCheckData.available) {
        setErrors((prevErrors) => ({ ...prevErrors,  username: 'Username is already taken.' }));
        return; // Stop submission if username is not available
      }
    } catch (error) {
      console.error('Error checking username:', error);
      setErrors({ ...errors, username: 'Username Already in Use.' });
      return; // Stop submission if there was an error
    }
  
    // Create User
    try {
      const response = await fetch('${process.env.REACT_APP_API_URL}/api/user/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          username: values.username,
          password: values.password,
          // birthday: values.birthday,
          // gender: String,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('User Created:', data);

    } catch (error) {
      console.error('Failed to create user', error);
      // Handle errors
    }

    // Login User
    try {
      const response = await fetch('${process.env.REACT_APP_API_URL}/api/user/sign-in', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              username: values.username,
              password: values.password,
          }),
      });
      const data = await response.json();
      if (response.ok) {
          login(data.token); // Save the token and update user context
          console.log('Login successful:', data);
          sessionStorage.setItem('username', data.user.username);
          sessionStorage.setItem('firstName', data.user.firstName);
          sessionStorage.setItem('lastName', data.user.lastName);
          sessionStorage.setItem('_id', data.user._id);
          sessionStorage.setItem('coverPhoto', data.user.coverPhoto);
          sessionStorage.setItem('profilePhoto', data.user.profilePhoto);
          navigate('/home'); // Redirect to home page
      } else {
          console.error('Login failed:', data.message);
          // Handle errors, such as showing a notification to the user
      }
    } catch (error) {
        console.error('Error during login:', error);
    }
  };

  // // Birthday setups
  // const [month, setMonth] = useState('jan');
  // const [year, setYear] = useState(new Date().getFullYear());
  // const [daysInMonth, setDaysInMonth] = useState([]);

  // useEffect(() => {
  //     const days = new Date(year, getMonthIndex(month) + 1, 0).getDate();
  //     setDaysInMonth(Array.from({ length: days }, (_, i) => i + 1));
  //   }, [month, year]);

  // // Helper function to convert month to its numerical index
  // const getMonthIndex = (month) => {
  //   const monthIndex = {
  //     jan: 0,
  //     feb: 1,
  //     mar: 2,
  //     apr: 3,
  //     may: 4,
  //     jun: 5,
  //     jul: 6,
  //     aug: 7,
  //     sep: 8,
  //     oct: 9,
  //     nov: 10,
  //     dec: 11,
  //   };
  //   return monthIndex[month];
  // };
  // // generate year options using javascript
  // const generateYearOptions = () => {
  //   const currentYear = new Date().getFullYear();
  //   const years = Array.from({ length: currentYear - 1900 + 1 }, (v, i) => currentYear - i);
  //   return years.map((year) => <option key={year} value={year}>{year}</option>);
  // };

  return (
    <div className="signup-form-container">
      <div className="signup-form-container2">
        <form className="signup-form" onSubmit={handleSubmit}>
          <button className="close-button" onClick={onClose}>X</button>
          <h1>Sign Up</h1>
          <p>It's quick and easy.</p>
          {errors.firstName && <span className="error-text">{errors.firstName}</span>}
          <input id="firstName" name="firstName" type="text" placeholder="First name" value={values.firstName} onChange={handleInputChange} />
          {errors.lastName && <span className="error-text">{errors.lastName}</span>}
          <input id="lastName" name="lastName" type="text" placeholder="Last name" value={values.lastName} onChange={handleInputChange} />
          {errors.email && <span className="error-text">{errors.email}</span>}
          <input id="email" name="email" type="text" placeholder="Email" value={values.email} onChange={handleInputChange} />
          {errors.username && <span className="error-text">{errors.username}</span>}
          <input id="username" name="username" type="username" placeholder="Username" value={values.username} onChange={handleInputChange} />
          <input id="password" name="password" type="password" placeholder="Password" value={values.password} onChange={handleInputChange} />
          {/* <div className="birthday-container">
            <label>Birthday</label>
            <select value={month} onChange={(e) => setMonth(e.target.value)}>
                <option value="jan">Jan</option>
                <option value="feb">Feb</option>
                <option value="mar">Mar</option>
                <option value="apr">Apr</option>
                <option value="may">May</option>
                <option value="jun">Jun</option>
                <option value="jul">Jul</option>
                <option value="aug">Aug</option>
                <option value="sep">Sep</option>
                <option value="oct">Oct</option>
                <option value="nov">Nov</option>
                <option value="dec">Dec</option>
            </select>
            <select>
                {daysInMonth.map((day) => (
                    <option key={day} value={day}>
                        {day}
                    </option>
                ))}
            </select>
            <select onChange={(e) => setYear(e.target.value)}>
                {generateYearOptions()}
            </select>
          </div> */}
          {/* <label>Gender</label>
          <div className="gender-container">
            <label>
              <input type="radio" id="gender" name="gender" value="female" onChange={handleInputChange} /> Female
            </label>
            <label>
            <input type="radio" id="gender" name="gender" value="male" onChange={handleInputChange} /> Male
            </label>
            <label>
            <input type="radio" id="gender" name="gender" value="custom" onChange={handleInputChange} /> Custom
            </label>
          </div> */}
          <p className="form-text">
            By clicking Sign Up, you agree to our <a href="#terms">Terms</a>, <a href="#privacy">Privacy Policy</a> and <a href="#cookies">Cookies Policy</a>. You may receive SMS Notifications from us and can opt out any time.
          </p>
          <button type="submit" className="signup-button">Sign Up</button>
        </form>
      </div>
    </div>
  );
};
  
  export default ProfileSettings;