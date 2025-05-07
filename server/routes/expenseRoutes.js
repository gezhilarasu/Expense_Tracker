const express = require("express");
const router = express.Router();
const { addExpense, getExpenses} = require("../controllers/expenseController");
const { verifyToken } = require("../middleware/auth");

router.post('/addExpense',verifyToken, addExpense);
router.get('/getExpense',verifyToken, getExpenses);
module.exports = router;
