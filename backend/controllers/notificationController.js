const Notification = require('../models/Notification');

const getNotifications = async (req, res) => {
  try {
    const notifs = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(100);
    res.json(notifs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

const createNotification = async (req, res) => {
  try {
    const { userId, title, message, link, type } = req.body;
    const notif = await Notification.create({
      user: userId,
      title,
      message,
      link,
      type,
    });
    // optionally emit socket event here
    res.status(201).json(notif);
  } catch (err) {
    res.status(500).json({ message: "Failed to create notification" });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notif = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isRead: true },
      { new: true }
    );
    if (!notif) return res.status(404).json({ message: "Not found" });
    res.json(notif);
  } catch (err) {
    res.status(500).json({ message: "Failed to update" });
  }
};

const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed" });
  }
};

const deleteNotification = async (req, res) => {
  try {
    await Notification.deleteOne({ _id: req.params.id, user: req.user._id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed" });
  }
};

module.exports = { getNotifications, createNotification, markAsRead, markAllRead, deleteNotification };
