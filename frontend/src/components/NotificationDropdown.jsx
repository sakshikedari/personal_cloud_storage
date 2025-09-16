import React from "react";
import { X } from "lucide-react";
import { formatDistanceToNow } from "date-fns"; // optional, or use toLocaleString

const NotificationDropdown = ({ notifications = [], onMarkAsRead, onClose }) => {
  return (
    <div className="absolute right-0 mt-2 w-[320px] bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
      <div className="flex items-center justify-between p-3 border-b dark:border-gray-700">
        <h4 className="font-semibold text-gray-800 dark:text-gray-100">Notifications</h4>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
          <X className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      <div className="max-h-64 overflow-auto">
        {notifications.length === 0 && (
          <div className="p-4 text-sm text-gray-500">No notifications</div>
        )}

        {notifications.map((n) => (
          <div
            key={n._id}
            className={`flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition ${n.isRead ? "" : "bg-gray-50 dark:bg-gray-900/30"}`}
          >
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{n.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{n.message}</p>
                </div>
                <div className="text-xs text-gray-400">{formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}</div>
              </div>

              <div className="mt-2 flex gap-2">
                {!n.isRead && (
                  <button onClick={() => onMarkAsRead(n._id)} className="text-xs bg-indigo-600 text-white px-2 py-1 rounded">Mark read</button>
                )}
                {n.link && (
                  <a href={n.link} className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">Open</a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationDropdown;
