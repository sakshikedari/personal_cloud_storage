import React, { useState } from "react";
import { Upload, CheckCircle, XCircle } from "lucide-react";



const UploadArea = ({ token, onUpload, usedStorage, totalStorage }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const uploadFileToServer = async (file) => {
  if (!token) return;

  const fileSizeGB = file.size / (1024 * 1024 * 1024);

    if (usedStorage + fileSizeGB > totalStorage) {
      setStatusMessage({
        type: "error",
        text: `Not enough storage to upload "${file.name}"`,
      });
      return;
    }
  const formData = new FormData();
  formData.append("file", file);

  setUploading(true);
  setStatusMessage(null);

  try {
    const res = await fetch("http://localhost:5000/api/files/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      setStatusMessage({ type: "success", text: `Uploaded "${data.filename}"` });
      await onUpload?.(); 
    } else {
      setStatusMessage({ type: "error", text: data.message || "Upload failed" });
    }
  } catch (err) {
    setStatusMessage({ type: "error", text: "Error uploading file" });
  } finally {
    setUploading(false);
  }
};


  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    Array.from(e.dataTransfer.files).forEach(uploadFileToServer);
  };

  const handleBrowse = (e) => {
    Array.from(e.target.files).forEach(uploadFileToServer);
  };

  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
      <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Quick Upload
      </h3>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragOver(false);
        }}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
          isDragOver
            ? "border-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/30"
            : "border-gray-300 dark:border-gray-600 hover:border-indigo-300 hover:bg-gray-50/50 dark:hover:bg-gray-700/30"
        }`}
      >
        <div className="flex flex-col items-center space-y-4">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
              isDragOver
                ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/60 dark:text-indigo-400"
                : "bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-300"
            }`}
          >
            <Upload className="w-8 h-8" />
          </div>

          <p className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">
            {uploading
              ? "Uploading..."
              : isDragOver
              ? "Drop files here"
              : "Drag & drop files"}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            or click to browse
          </p>

          <input
            type="file"
            multiple
            onChange={handleBrowse}
            className="hidden"
            id="fileInput"
          />
          <label
            htmlFor="fileInput"
            className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-emerald-500 text-white rounded-xl hover:shadow-lg cursor-pointer"
          >
            Browse Files
          </label>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`mt-4 flex items-center space-x-2 text-sm ${
            statusMessage.type === "success"
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle size={18} />
          ) : (
            <XCircle size={18} />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}
    </div>
  );
};

export default UploadArea;
