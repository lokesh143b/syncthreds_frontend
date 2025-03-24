import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Shared styles for Login & Signup

function Auth() {
  const [isSignup, setIsSignup] = useState(false); // Toggle between Login & Signup
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAuth = async () => {
    setError("");

    if (!username || !password || (isSignup && !confirmPassword)) {
      setError("All fields are required.");
      return;
    }

    if (isSignup && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      if (isSignup) {
        // Signup API
        await axios.post("http://localhost:5000/api/auth/register", {
          username,
          password,
        });
        alert("Account created successfully! Please login.");
        setIsSignup(false); // Switch to login after signup
      } else {
        // Login API
        const res = await axios.post("http://localhost:5000/api/auth/login", {
          username,
          password,
        });
        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>{isSignup ? "Create an Account" : "Login"}</h2>
        {error && <p className="error-message">{error}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="login-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />
        {isSignup && (
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="login-input"
          />
        )}
        <button onClick={handleAuth} className="login-btn">
          {isSignup ? "Sign Up" : "Login"}
        </button>
        <p>
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <span className="toggle-link" onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? "Login here" : "Create an account"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Auth;
