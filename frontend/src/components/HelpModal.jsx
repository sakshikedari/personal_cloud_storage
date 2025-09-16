import React from "react";

const HelpModal = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-[28rem] md:w-[32rem] p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 dark:text-gray-300 hover:text-red-500"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
          Help & Support
        </h2>

        <div className="space-y-6 text-gray-700 dark:text-gray-200">
          <div>
            <p className="font-medium">Quick Start</p>
            <p className="text-sm">
              Use the sidebar to navigate between files, settings. Click on items to open details.
            </p>
          </div>

          <div>
            <p className="font-medium">❓ FAQs</p>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>How to upload files? → Use the Upload button on Dashboard.</li>
              <li>How to change theme? → Go to Settings → Appearance.</li>
              <li>How to reset password? → Go to Profile → Change Password.</li>
            </ul>
          </div>

          <div>
            <p className="font-medium">⌨️ Keyboard Shortcuts</p>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li><b>Ctrl + N</b> → Create new file</li>
              <li><b>Ctrl + S</b> → Save current work</li>
              <li><b>Ctrl + F</b> → Search within files</li>
            </ul>
          </div>

          <div>
            <p className="font-medium">💡 Tips & Tricks</p>
            <p className="text-sm">
              Use drag & drop to quickly move files. Double-click a job to see detailed info. You can also toggle dark mode for better eye comfort.
            </p>
          </div>

          <div>
            <p className="font-medium">⚠️ Troubleshooting</p>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>App not loading? → Refresh or clear browser cache.</li>
              <li>Cannot upload file? → Check file size and format.</li>
              <li>Facing other issues? → Contact support.</li>
            </ul>
          </div>

          <div>
            <p className="font-medium">📩 Need Help?</p>
            <p className="text-sm">
              Contact us at <span className="text-indigo-500">support@myapp.com</span> or join our <span className="text-indigo-500">community forum</span>.
            </p>
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            Version 1.0.3
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
