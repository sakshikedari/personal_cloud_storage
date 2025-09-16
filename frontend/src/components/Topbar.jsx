import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Menu, Settings, Bell } from "lucide-react";
import HelpModal from "./HelpModal";
import NotificationDropdown from "./NotificationDropdown";
import API from "../api/axios"; // axios instance

const Topbar = ({
  toggleSidebar,
  user,
  handleLogout,
  setActiveSection,
  searchText,
  setSearchText,
}) => {
  const navigate = useNavigate();

  // --- user menu ---
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // --- notifications ---
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef(null);

  // --- help modal ---
  const [helpOpen, setHelpOpen] = useState(false);

  // fetch notifications
  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notifications");
      setNotifications(res.data);
      setUnreadCount(res.data.filter((n) => !n.read).length);
    } catch (err) {
      console.error("Fetch notifications:", err.response?.data || err);
    }
  };

  useEffect(() => {
    if (user) fetchNotifications();

    // poll every 20s
    const interval = setInterval(() => {
      if (user) fetchNotifications();
    }, 20000);

    // click outside menu + notif
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target))
        setMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(event.target))
        setNotifOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      clearInterval(interval);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [user]);

  // mark notification read
  const markAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  // mark all notifications read
  const markAllRead = async () => {
    try {
      await API.put(`/notifications/mark-all-read`);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="bg-white/80 dark:bg-gray-900 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800 px-6 py-4 sticky top-0 z-30">
        <div className="flex items-center justify-between">
          {/* Left Side (logo + search) */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-700 dark:text-gray-200" />
            </button>

            <div className="h-14 w-14">
              <img src="/logo.png" alt="logo" />
            </div>

            {/* Search box */}
            <div className="relative w-40 sm:w-60 md:w-80 transition-all">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onFocus={() => setActiveSection && setActiveSection("search")}
                className="pl-10 pr-4 py-2 w-full bg-gray-50/70 dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700 rounded-xl text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Settings */}
            <Settings
              className="w-6 h-6 cursor-pointer hover:text-indigo-600 transition text-gray-700 dark:text-gray-200"
              onClick={() => navigate("/settings")}
            />

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => {
                  setNotifOpen(!notifOpen);
                  if (!notifOpen) markAllRead();
                }}
                className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                title="Notifications"
              >
                <Bell className="w-6 h-6 text-gray-700 dark:text-gray-200" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-5 flex items-center justify-center text-[11px] px-1 bg-red-500 text-white rounded-full">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <NotificationDropdown
                  notifications={notifications}
                  onMarkAsRead={markAsRead}
                  onClose={() => setNotifOpen(false)}
                />
              )}
            </div>

            {/* Help */}
            <span
              className="material-symbols-outlined cursor-pointer hover:text-indigo-600 transition text-gray-700 dark:text-gray-200"
              onClick={() => setHelpOpen(true)}
              title="Help"
            >
              help
            </span>

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                  {user?.name}
                </p>
              </div>

              {!user ? (
                <button
                  onClick={() => navigate("/login")}
                  className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition"
                >
                  Login
                </button>
              ) : (
                <div className="relative flex items-center gap-2" ref={menuRef}>
                  <div
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold border-2 border-gray-200 dark:border-gray-700 cursor-pointer"
                    title={user.name}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                      <div className="p-4">
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user.plan}
                        </p>
                      </div>
                      <hr className="border-gray-100 dark:border-gray-700" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Help Modal */}
      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
    </>
  );
};

export default Topbar;
