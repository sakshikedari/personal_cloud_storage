import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import UploadArea from "./UploadArea";
import FileGrid from "./FileGrid";
import StorageUsage from "./StorageUsage";
import WelcomeSection from "./WelcomeSection";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("files");
  const [searchText, setSearchText] = useState("");
  const [files, setFiles] = useState([]);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  const [sharedFolders, setSharedFolders] = useState([]);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const requireLogin = (action) => {
    if (!user || !token) {
      alert(`You need to login first to ${action}`);
      navigate("/login");
      return false;
    }
    return true;
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken) setToken(savedToken);
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    setFiles([]);
    navigate("/login");
  };

  const fetchFiles = async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:5000/api/files", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setFiles([...data]);
      } else {
        console.error("Error fetching files:", data.message);
      }
    } catch (err) {
      console.error("Error fetching files:", err);
    }
  };

  useEffect(() => {
  if (token && user) {
    fetchFiles();
  } else {
    setFiles([]); 
  }
}, [token, user]);

  const filteredFiles = files.filter((file) =>
    file.filename?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Topbar
        toggleSidebar={toggleSidebar}
        user={user}
        handleLogout={handleLogout}
        setActiveSection={setActiveSection}
        searchText={searchText}
        setSearchText={setSearchText}
      />

      <div className="flex">
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />

        <div className="flex-1 p-4">
          <WelcomeSection
            user={user}
            files={files}
            sharedFolders={sharedFolders}
          />

          {(activeSection === "files" || activeSection === "search") && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <StorageUsage files={files} />
                <UploadArea token={token} onUpload={fetchFiles} />
              </div>
              <FileGrid
                key={user?._id}
                files={filteredFiles} 
                setFiles={setFiles}
                onFileChange={fetchFiles}
              />
            </>
          )}

          {activeSection === "upload" && requireLogin("upload files") && (
            <UploadArea token={token} onUpload={fetchFiles} />
          )}

          {activeSection === "analytics" && requireLogin("view analytics") && (
            <StorageUsage files={files} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
