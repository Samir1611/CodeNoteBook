import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user, login } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
        credentials: "include",
      });

      const json = await response.json();
      setIsLoading(false);

      if (response.ok && json.success) {
        login(json.user);
        toast.success("Login Successful!");
        setTimeout(() => {
          navigate("/");
        }, 100);

        console.log("Login successful:", json);
      } else if (json.errors) {
        json.errors.forEach((error) => toast.error(error.msg));
      } else {
        toast.error(json.error || "Invalid Credentials");
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Login failed:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div className="min-h-screen  sm:flex">
        {/* Left Side - Illustration and Logo */}
        <div className="w-full sm:w-[40%] bg-gray-50 flex flex-col items-center px-4 py-2 sm:p-8">
          {/* Logo at the Top */}
          <div className="flex w-full justify-start items-start gap-2">
            <div className="w-16 h-16">
              <img src="/login.svg" className="object-contain max-w-[60px]" />
            </div>
            <h1 className="my-3 text-2xl font-bold text-gray-800 ">
              CodeNoteBook
            </h1>
          </div>

          {/* Centered Illustration */}
          <div className="flex-grow hidden sm:flex items-center justify-center ">
            <img
              src="/login.svg"
              alt="Illustration of coding on a laptop"
              className="w-full  h-auto"
            />
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full sm:w-[60%] flex items-center justify-center mt-8 sm:mt-[6vh]">
          <div className="p-[8vw] w-full ">
            <h2 className="text-2xl sm:text-5xl font-bold text-gray-800 mb-4">
              Login
            </h2>
            <p className="text-gray-500 mb-[4vh]">
              Welcome back! Please enter your details.
            </p>

            {/* Login Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email Address */}
              <div>
                <label className="block  font-semibold mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  value={credentials.email}
                  id="email"
                  onChange={handleChange}
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-green-500 hover:border-green-500"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block  font-semibold mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  value={credentials.password}
                  name="password"
                  id="password"
                  onChange={handleChange}
                  type="password"
                  placeholder="Enter your password"
                  className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-green-500 hover:border-green-500"
                />
              </div>

              {/* Forgot Password */}
              <div className="text-right pb-3">
                <a href="#" className="text-green-500 text-md">
                  Forgot Password?
                </a>
              </div>

              {/* Login Button */}
              <button
                disabled={isLoading}
                type="submit"
                className="w-full font-semibold bg-green-500 text-white p-3 rounded hover:bg-green-600 "
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
              <h1 className="text-center">
                Don't have an account?
                <span
                  className="text-sky-500 cursor-pointer"
                  onClick={() => navigate("/signup")}
                >
                  {" "}
                  Create Account
                </span>
              </h1>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
