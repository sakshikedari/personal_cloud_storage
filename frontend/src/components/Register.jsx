import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const { name, email, password } = formData;

    if (name.trim().length < 3) {
      return "Name must be at least 3 characters";
    }
    if (!/^[a-zA-Z\s]+$/.test(name)) {
      return "Name can only contain letters and spaces";
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return "Invalid email format";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }
    if (!/\d/.test(password)) {
      return "Password must contain at least one number";
    }
    return null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      console.log(res.message);
      if (!res.ok) throw new Error("Failed to register");

      await res.json();
      navigate("/login");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-green-500 to-teal-500">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Create Account</h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
          >
            Register
          </button>
        </form>
        <p className="text-sm mt-4 text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-green-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
