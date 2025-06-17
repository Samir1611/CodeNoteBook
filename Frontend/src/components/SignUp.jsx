import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const SignUp = () => {
  const [credentials, setcredentials] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });
  const { login } = useAuth();
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, cpassword } = credentials;

    if (password !== cpassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const response = await fetch("http://localhost:5000/auth/createuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
      credentials: "include",
    });
    const json = await response.json();
    console.log(json);
    if (json.success) {
      toast.success("SignUp Sucessfully.");
      login(json.authToken);
      navigate("/");
    } else if (json.errors && json.errors.length > 0) {
      json.errors.forEach((error) => {
        toast.error(error.msg);
      });
    } else {
      // Fallback for other errors (e.g., wrong credentials)
      toast.error(json.error || "Invalid Credentials");
    }
  };
  const onchange = (e) => {
    setcredentials({ ...credentials, [e.target.name]: e.target.value }); //any changes set name to value in note
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
            <h1 className="my-3 text-xl md:text-2xl font-bold text-gray-800 ">
              CodeNoteBook
            </h1>
          </div>

          {/* Centered Illustration */}
          <div className="flex-grow hidden sm:flex items-center justify-center ">
            <img src="/login.svg" className="w-full  h-auto" />
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full sm:w-[60%] flex items-center justify-center ">
          <div className="pt-[2vh] px-[6vw] xl:pt-[6vh]  w-full ">
            <h2 className="text-2xl sm:text-3xl xl:text-5xl font-bold text-gray-800 sm:mb-4">
              Create an account
            </h2>
            <p className="text-gray-500 mb-2 sm:mb-[2vh] xl:mb-[4vh]">
              Create an account and start your note journey.
            </p>

            {/* Login Form */}
            <form className="space-y-4 xl:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className=" block font-semibold mb-2">
                  Enter your name <span className="text-red-500">*</span>
                </label>
                <input
                  name="name"
                  placeholder="Enter your name"
                  type="text"
                  className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-green-500 hover:border-green-500"
                  value={credentials.name}
                  id="name"
                  onChange={onchange}
                  required
                />
              </div>
              {/* Email Address */}
              <div>
                <label className="block  font-semibold mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  value={credentials.email}
                  id="email"
                  onChange={onchange}
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-green-500 hover:border-green-500"
                />
              </div>
              {/* Password */}
              <div>
                <label className="block  font-semibold mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  minLength={5}
                  value={credentials.password}
                  name="password"
                  id="password"
                  onChange={onchange}
                  type="password"
                  placeholder="Enter your password"
                  className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-green-500 hover:border-green-500"
                />
              </div>{" "}
              <div className="mb-3">
                <label
                  htmlFor="cpassword "
                  className="block font-semibold mb-2 "
                >
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  placeholder="Confirm Password"
                  type="cpassword"
                  className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-green-500 hover:border-green-500"
                  value={credentials.cpassword}
                  name="cpassword"
                  id="cpassword"
                  onChange={onchange}
                  minLength={5}
                  required
                />
              </div>
              {/* Login Button */}
              <button
                type="submit"
                className="w-full font-semibold bg-green-500 text-white p-3 rounded hover:bg-green-600 "
              >
                Create Account
              </button>
              <h1 className="text-center">
                Already have an account?
                <span
                  className="text-sky-500 cursor-pointer pl-1"
                  onClick={() => navigate("/login")}
                >
                  Log In
                </span>
              </h1>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
