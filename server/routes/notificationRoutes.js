const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const { 
    setNotification, 
    getNotifications, 
    deleteNotification 
} = require("../controllers/notificationController");

router.post('/addNotification', verifyToken, setNotification);
router.get('/getNotifications', verifyToken, getNotifications);
router.delete('/deleteNotification/:notificationId', verifyToken, deleteNotification);

module.exports = router;
