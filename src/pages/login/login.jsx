import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../redux/userSlice";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { LoginCall, RegisterCall } from "../../api/Auth";
import { toast, ToastContainer } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [invalidCredentials, setInvalidCredentials] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);

  const dispatch = useDispatch();

  const toggleRegistration = () => {
    setName("");
    setEmail("");
    setPassword("");
    setInvalidCredentials(false);
    setIsRegistering(!isRegistering);
  };

  const handleChange = (event) => {
    setRole(event.target.value);
  };

  const isEmailValidFormat = (email) => {
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    return emailPattern.test(email);
  };

  const signIn = async () => {
    setIsEmailValid(isEmailValidFormat(email));

    if (isEmailValid) {
      const loginData = {
        email: email,
        password: btoa(password + "ajlnlsg@DK%&"),
      };

      try {
        const response = await LoginCall(loginData);
        if (response.User.Role) {
          console.log("Login successful");
          dispatch(setUser(response.User));
          localStorage.setItem("user", JSON.stringify(response.User));
          if (response.User.Role == "user") {
            navigate("/userhome");
          } else if (response.User.Role == "admin") {
            navigate("/admindashboard");
          }
        } else {
          console.error("Login failed. Server returned an error.");
        }
      } catch (error) {
        setInvalidCredentials(true);
        console.error("An error occurred while logging in:", error);
      }
    } else {
      console.error("Invalid email format");
    }
  };

  const signUp = async () => {
    if (isEmailValid) {
      const registrationData = {
        Name: name,
        Email: email,
        Password: btoa(password + "ajlnlsg@DK%&"),
        Role: role,
      };

      console.log(registrationData)
      try {
        RegisterCall(registrationData).then((response) => {
          if (response.Role) {
            setEmail("");
            setPassword("");
            toast.success("Registration Successful");
            setTimeout(() => {}, 4000);
            setIsRegistering(!isRegistering);
          }
        });
      } catch (err) {
        setInvalidCredentials(true);
        toast.error(err.response);
        console.error(err);
      }
    } else {
      console.error("Invalid email format");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-500 to-blue-600 flex flex-col justify-center items-center">
      <div className="bg-white p-8 rounded shadow-md w-96 transition-transform transform hover:scale-105">
        <h2 className="text-2xl font-semibold mb-4 text-center ">
          {isRegistering ? "Register" : "Login"}
        </h2>
        {isRegistering && (
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-600">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
              placeholder="Your full name"
              onChange={(e) => setName(e.target.value)}
            />
            {invalidCredentials && (
              <div>
                <p className="text-red-500">Invalid Credentials</p>
              </div>
            )}
          </div>
        )}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-600">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            className={`w-full px-4 py-2 border rounded focus:outline-none ${
              isEmailValid ? "focus:border-blue-500" : "border-red-500"
            }`}
            placeholder="Your email"
            onChange={(e) => {
              const enteredEmail = e.target.value;
              setEmail(enteredEmail);
            }}
          />
          {!isEmailValid && (
            <div>
              <p className="text-red-500">
                Invalid email format. Please enter a valid email.
              </p>
            </div>
          )}

          {invalidCredentials && (
            <div>
              <p className="text-red-500">Invalid Credentials</p>
            </div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-600">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
            placeholder="Your password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {invalidCredentials && (
            <div>
              <p className="text-red-500">Invalid Credentials</p>
            </div>
          )}
        </div>
        {isRegistering && (
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Role</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={role}
                label="role"
                onChange={handleChange}
              >
                <MenuItem value={"user"}>User</MenuItem>
                <MenuItem value={"admin"}>Admin</MenuItem>
              </Select>
            </FormControl>
          </Box>
        )}
        <div className="flex gap-4 p-2">
          <button
            onClick={() => {
              isRegistering ? signUp() : signIn();
            }}
            className="bg-blue-500 text-white w-full py-2 px-4 rounded hover:bg-blue-600 mb-2 focus:outline-none focus:bg-blue-600"
          >
            {isRegistering ? "Register" : "Login"}
          </button>
        </div>
        <p className="mt-4 text-center">
          {isRegistering
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <a
            className="text-blue-500 hover:cursor-pointer transition-colors duration-300 ease-in-out"
            onClick={toggleRegistration}
          >
            {isRegistering ? "Login" : "Sign up"}
          </a>
        </p>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Login;
