const express = require("express");
const router = express.Router();
const { addExpense, getExpenses,deleteExpense} = require("../controllers/expenseController");
const { verifyToken } = require("../middleware/auth");

router.post('/addExpense',verifyToken, addExpense);
router.get('/getExpense',verifyToken, getExpenses);
router.delete('/deleteExpense/:expense_id', verifyToken, deleteExpense);

module.exports = router;
