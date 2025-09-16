import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./src/components/Dashboard";
import Login from "./src/components/Login";
import Register from "./src/components/Register";
import Settings from "./src/components/Settings";
import ForgotPassword from "./src/components/ForgotPassword"
import ResetPassword from "./src/components/ResetPassword";  
import { SettingsProvider } from "./src/context/SettingsContext";

const App = () => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      try {
        return JSON.parse(storedUser);
      } catch (err) {
        console.error("Failed to parse user:", err);
        return null;
      }
    }
    return null;
  });

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse user:", err);
        setUser(null);
      }
    }
  }, []);

  return (
    <BrowserRouter>
      <SettingsProvider>
        <Routes>
          <Route
            path="/"
            element={<Dashboard user={user} handleLogout={handleLogout} />}
          />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register setUser={setUser} />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </SettingsProvider>
    </BrowserRouter>
  );
};

export default App;
