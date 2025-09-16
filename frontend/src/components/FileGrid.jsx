import React, { useState, useEffect } from "react";
import { Download, Share2, MoreVertical } from "lucide-react";
import API from "../api/axios";
import { useSettings } from "../context/SettingsContext";
import PdfComp from "./PdfComp.jsx";
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).toString();

const prettySize = (bytes) => {
  if (!bytes && bytes !== 0) return "N/A";
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(
    Math.floor(Math.log(bytes || 1) / Math.log(1024)),
    sizes.length - 1
  );
  const val = bytes / Math.pow(1024, i);
  return `${val.toFixed(val >= 100 ? 0 : 1)} ${sizes[i]}`;
};

const FileGrid = ({ files = [], setFiles, onFileChange }) => {
  const [previewFile, setPreviewFile] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const [copied, setCopied] = useState(false);
  const { settings } = useSettings();

  // helpers
  const getId = (f) => f._id || f.id;
  const getName = (f) => f.filename || f.name || "Untitled";
  const getSize = (f) => f.size ?? f.length;
  const getType = (f) => f.type || f.contentType || f.mimetype || "unknown";

  // fetch files
  useEffect(() => {
    API.get("/files")
      .then((res) => setFiles(res.data))
      .catch((err) => console.error("Error fetching files:", err));
  }, []);

  // download
  const handleDownload = async (file) => {
    try {
      const id = getId(file);
      const res = await API.get(`/files/${id}?download=true`, {
        responseType: "blob",
      });
      const blob = new Blob([res.data], { type: getType(file) });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", getName(file));
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err.response?.data || err.message);
    }
  };

  // preview (only pdfs)
  const handlePreview = async (file) => {
    try {
      const id = getId(file);
      const res = await API.get(`/files/${id}`, { responseType: "blob" });
      const previewUrl = URL.createObjectURL(res.data);

      let highlights = [];
      try {
        const hlRes = await API.get(`/files/${id}/highlights`);
        highlights = Array.isArray(hlRes.data) ? hlRes.data : [];
      } catch {
        console.warn("No highlights found");
      }

      setPreviewFile({
        ...file,
        previewUrl,
        highlights,
      });
    } catch (err) {
      console.error("Error loading PDF preview:", err);
    }
  };

  const handleClosePreview = () => setPreviewFile(null);

  // share
  const handleShare = async (file) => {
    const id = getId(file);
    const fileLink = `http://localhost:5000/api/files/${id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: getName(file), url: fileLink });
      } else {
        await navigator.clipboard.writeText(fileLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  const toggleMenu = (fileId) =>
    setMenuOpen((m) => (m === fileId ? null : fileId));

  return (
    <div className="p-4">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800 text-left">
            <th className="p-2">Filename</th>
            <th className="p-2">Size</th>
            <th className="p-2">Type</th>
            <th className="p-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => {
            const id = getId(file);
            const name = getName(file);
            const size = prettySize(getSize(file));
            const type = getType(file);

            return (
              <tr key={id} className="border-b border-gray-200 dark:border-gray-700 relative">
                <td
                  className="p-2 text-blue-600 dark:text-blue-400 cursor-pointer"
                  onClick={() => handlePreview(file)}
                  title="Click to preview PDF"
                >
                  {name}
                </td>
                <td className="p-2">{size}</td>
                <td className="p-2">{type}</td>
                <td className="p-2 flex justify-end space-x-2 relative">
                  <Download
                    className="w-4 h-4 text-gray-500 dark:text-gray-400 cursor-pointer"
                    onClick={() => handleDownload(file)}
                    title="Download"
                  />
                  <Share2
                    className="w-4 h-4 text-gray-500 dark:text-gray-400 cursor-pointer"
                    onClick={() => handleShare(file)}
                    title="Share"
                  />
                  <MoreVertical
                    className="w-4 h-4 text-gray-500 dark:text-gray-400 cursor-pointer"
                    onClick={() => toggleMenu(id)}
                    title="More"
                  />
                </td>
              </tr>
            );
          })}
          {files.length === 0 && (
            <tr>
              <td colSpan="4" className="p-4 text-center text-gray-500 dark:text-gray-400">
                No files found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Preview Modal for PDFs */}
      {previewFile && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-900 p-4 rounded shadow-md max-w-4xl w-full relative">
            <h2 className="text-lg font-bold mb-2">{getName(previewFile)}</h2>
            <PdfComp file={previewFile} setFile={setPreviewFile} />
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleClosePreview}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {copied && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-3 py-2 rounded shadow">
          Link copied!
        </div>
      )}
    </div>
  );
};

export default FileGrid;
