import React, { useState } from "react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import AdminDashboard from "./components/Admin";
import { UserContext } from "../context/UserContext";

const Login = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ userid: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    userId: "",
    role: "",
  });
  const [message, setMessage] = useState("");

  // --- Normal login ---
  const handleLogin = async () => {
    try {
      const res = await axios.post(`http://localhost:8080/user/${userid}`, form);
      localStorage.setItem("token", res.data.token);
      setMessage("Login successful ✅");

      setTimeout(() => {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        window.location.href = "/login";
      }, res.data.timer);
    } catch (err) {
      console.log(err);
      setMessage("Invalid credentials ❌");
    }
  };

  // --- Google login ---
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const res = await axios.post("http://localhost:8080/users", {
        token: credentialResponse.credential,
      });
      localStorage.setItem("token", res.data.token);
      setMessage("Google login successful ✅");
      
      navigate("/admin");
    } catch (err) {
      setMessage("Google login failed ❌");
    }
  };

  // --- Signup ---
  const handleSignup = async () => {
    try {
      await axios.post("http://localhost:8080/users/register", signupForm);
      setMessage("Signup successful 🎉, please login.");
      setMode("login");
    } catch (err) {
      console.log(err);
      setMessage("Signup failed ❌");
    }
  };

  return (
    <>
      {/* LOGIN SECTION */}
      <div className="login-wrapper d-flex flex-column align-items-center justify-content-center">
        <h1 className="assignment-title mb-4 text-center">
          Subscription Management System
        </h1>

        <div className="login-card row shadow-lg">
          {/* LEFT PANEL */}
          <div
            className={`col-md-6 d-flex flex-column justify-content-center p-4 login-left ${
              mode === "login" ? "bg-white" : "text-white"
            }`}
          >
            <h2 className="mb-4 text-center fw-bold">
              {mode === "login" ? "Sign In / Login" : "Welcome Back!"}
            </h2>

            {mode === "login" ? (
              <>
                <input
                  className="form-control mb-3"
                  type="text"
                  placeholder="User id"
                  value={form.userid}
                  onChange={(e) => setForm({ ...form, userid: e.target.value })}
                />
                <input
                  className="form-control mb-3"
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
                

                {message && (
                  <p className="text-danger small text-center">{message}</p>
                )}

                <button
                  className="btn btn-primary w-100 mb-3"
                  onClick={handleLogin}
                >
                  Login
                </button>

                <div className="text-center mb-2">OR</div>

                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={() => setMessage("Google login failed ❌")}
                />
              </>
            ) : (
              <>
                <p className="text-center mb-4">
                  To keep connected with us please login with your personal info
                </p>
                <button
                  className="btn btn-outline-light w-100"
                  onClick={() => setMode("login")}
                >
                  <b>Back to Login</b>
                </button>
              </>
            )}
          </div>

          {/* RIGHT PANEL */}
          <div
            className={`col-md-6 d-flex flex-column justify-content-center p-4 login-right ${
              mode === "login" ? "text-white" : "bg-light"
            }`}
          >
            {mode === "login" ? (
              <>
                <h2 className="fw-bold text-center mb-3">Hello, Friend!</h2>
                <p className="text-center">
                  Enter your personal details and start your journey with us
                </p>
                <button
                  className="btn btn-outline-light w-100 mt-3"
                  onClick={() => setMode("signup")}
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                <h2 className="fw-bold text-center mb-4 text-dark">
                  Create Account
                </h2>
                <input
                  className="form-control mb-3"
                  placeholder="Name"
                  value={signupForm.name}
                  onChange={(e) =>
                    setSignupForm({ ...signupForm, name: e.target.value })
                  }
                />
                <input
                  className="form-control mb-3"
                  type="text"
                  placeholder="User id"
                  value={signupForm.userId}
                  onChange={(e) =>
                    setSignupForm({ ...signupForm, userId: e.target.value })
                  }
                />
                <input
                  className="form-control mb-3"
                  placeholder="Email"
                  value={signupForm.email}
                  onChange={(e) =>
                    setSignupForm({ ...signupForm, email: e.target.value })
                  }
                />
                <input
                  className="form-control mb-3"
                  type="password"
                  placeholder="Password"
                  value={signupForm.password}
                  onChange={(e) =>
                    setSignupForm({ ...signupForm, password: e.target.value })
                  }
                />
                <select
                  className="form-control mb-3"
                  value={signupForm.role || ""}
                  onChange={(e) =>
                    setSignupForm({ ...signupForm, role: e.target.value })
                  }
                >
                  <option value="" disabled>
                    Select Role
                  </option>
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>

                {message && (
                  <p className="text-danger small text-center">{message}</p>
                )}

                <button
                  className="btn btn-primary w-100"
                  onClick={handleSignup}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const Home = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Home;
