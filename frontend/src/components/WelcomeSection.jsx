import React, { useEffect, useState } from "react";
import { Sparkles, TrendingUp } from "lucide-react";



const WelcomeSection = ({ user, files = [], sharedFolders = [] }) => {
  const [greeting, setGreeting] = useState("Hello");

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours >= 5 && hours < 12) setGreeting("Good morning");
    else if (hours >= 12 && hours < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);


  const totalFiles = files.length;
  const totalSharedFolders = sharedFolders.length;
  const usedStorageGB = files.reduce(
    (acc, file) => acc + (file?.size || file?.length || 0),
    0
  ) / (1024 * 1024 * 1024); 
  const totalStorageGB = 16; 
  const storagePercentage = Math.min((usedStorageGB / totalStorageGB) * 100, 100).toFixed(0);

  return (
    <div className="bg-gradient-to-r from-indigo-500/10 via-emerald-500/10 to-indigo-500/10 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 shadow-lg mb-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm font-medium text-indigo-600">Welcome back</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            {greeting}, {user?.name || "Guest"}!
          </h1>
          <p className="text-gray-600">
            You have {totalFiles} files and {totalSharedFolders} shared folders. Your storage is {storagePercentage}% full.
          </p>
        </div>

        <div className="hidden sm:flex items-center space-x-6">
          <div className="text-center">
            <div className="flex items-center space-x-1 text-emerald-600 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">
                {totalFiles > 0 ? `+${Math.floor(totalFiles / 10)}%` : "0%"}
              </span>
            </div>
            <p className="text-xs text-gray-500">Files this month</p>
          </div>
          <div className="w-px h-12 bg-gray-200" />
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-600 mb-1">{totalFiles}</p>
            <p className="text-xs text-gray-500">Total files</p>
          </div>
          <div className="w-px h-12 bg-gray-200" />
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-600 mb-1">{totalSharedFolders}</p>
            <p className="text-xs text-gray-500">Shared folders</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;
