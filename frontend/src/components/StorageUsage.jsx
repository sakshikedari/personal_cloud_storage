import React from "react";
import { HardDrive } from "lucide-react";

const StorageUsage = ({ files = [] }) => {
  const usedStorage =
    files.reduce((acc, file) => acc + (file?.size || file?.length || 0), 0) /
    (1024 * 1024 * 1024);

  const totalStorage = 16;
  const usagePercentage = Math.min((usedStorage / totalStorage) * 100, 100);

  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-xl flex items-center justify-center">
            <HardDrive className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-100">
              Storage Usage
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {usedStorage.toFixed(6)} GB of {totalStorage} GB used
            </p>
          </div>
        </div>
        <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          {usagePercentage.toFixed(1)}%
        </span>
      </div>

      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${usagePercentage}%` }}
        />
      </div>

      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
        <span>0 GB</span>
        <span>{totalStorage} GB</span>
      </div>
    </div>
  );
};

export default StorageUsage;
