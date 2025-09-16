const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const protect = require("../middleware/authMiddleware");

// GET all notifications
router.get("/", protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
});

module.exports = router;
