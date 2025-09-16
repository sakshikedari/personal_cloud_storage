import React from "react";
import {
  FolderOpen,
  Upload,
  BarChart3,
  Cloud,
  Menu,
  X,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({
  isOpen,
  toggleSidebar,
  activeSection,
  setActiveSection,
}) => {
  const navigate = useNavigate();
  const menuItems = [
    { id: "files", label: "My Files", icon: FolderOpen },
    { id: "upload", label: "Upload", icon: Upload },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <div
        className={`
  fixed left-0 top-0 h-full w-64 
  bg-white dark:bg-gray-900 
  text-gray-900 dark:text-gray-100
  backdrop-blur-xl border-r border-gray-200 dark:border-gray-700
  transform transition-transform duration-300 ease-in-out z-50 shadow-xl
  ${isOpen ? "translate-x-0" : "-translate-x-full"}
  lg:translate-x-0 lg:static lg:z-auto
`}
      >
        <div className="p-6">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="space-y-2" role="navigation">
          {menuItems.map(({ id, icon: Icon, label }) => {
            const isActive = activeSection === id;

            return (
              <button
                key={id}
                onClick={() => {
                  if (id === "settings") {
                    navigate("/settings");
                  } else {
                    setActiveSection(id);
                  }
                }}
                className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
                    ${
                      isActive
                        ? "bg-gradient-to-r from-indigo-500 to-emerald-500 text-white shadow-lg"
                        : "text-gray-600 hover:bg-gray-100/70 hover:text-gray-800"
                    }
                  `}
                role="menuitem"
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
