import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./signup.css";

function SignUp() {
  const [name,setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Optional: Validate form fields (e.g., password length, valid email)
    if (!email || !password) {
      setError("Please provide both email and password.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      console.log("data",data.newUser)

       localStorage.setItem('id',data.newUser.userId);

      if (response.ok) {
        // Signup successful; redirect to dashboard page
        navigate("/dashboard");
      } else {
        setError(data.message || "Signup failed. Please try again.");
      }
    } 
    catch (err) {
      console.error("Error during signup:", err);
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="signup-container">
      <h2>Create an Account</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="form-field">
          <label>Name:</label>
          <input
            type="tel"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            required            
        />
        </div>
        <div className="form-field">
          <label>Email:</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          
        </div>
        <div className="form-field">
          <label>Password:</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>
        <button type="submit" className="signup-btn">Sign Up</button>
      </form>
    </div>
  );
}

export default SignUp;
