const express = require("express");
const router = express.Router();
const { addBudget,getBudgets,updateBudget,deleteBudget} = require("../controllers/budgetController");
const {verifyToken} = require("../middleware/auth");

router.post('/add',verifyToken,addBudget);
router.get('/getbudget',verifyToken,getBudgets);
router.put('/update',verifyToken,updateBudget);
router.delete('/delete/:budgetId',verifyToken,deleteBudget);


module.exports = router;
