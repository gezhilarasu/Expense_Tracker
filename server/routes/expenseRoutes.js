const express = require("express");
const router = express.Router();
const Expense = require("../models/expense");
const Budget = require("../models/budget"); // ✅ Ensure consistency in variable name

// ✅ API to Fetch Expense of Logged-in User
router.get("/user-expenses/:userId", async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
        const expenses = await Expense.find({ userId }); 
        res.status(200).json(expenses);
    } catch (error) {
        console.error("Error fetching expenses:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// ✅ API to store the expense
router.post("/add", async (req, res) => {
    const { amount, description, date, category, userId} =req.body;
    try {
        
        
        if (!userId) return res.status(400).json({ error: "User ID is required." });

        // Convert amount to number
        let expenseAmount = Number(amount);
        if (isNaN(expenseAmount) || expenseAmount <= 0) {
            return res.status(400).json({ error: "Invalid expense amount." });
        }

        // Find the budget based on user ID and category
        const budget = await Budget.findOne({ userId, category });

        if (!budget) return res.status(404).json({ error: "Budget not found for this category." });

        // Check if expense is within available budget
        if (expenseAmount > budget.availableAmount) {
            return res.status(400).json({ error: "Expense exceeds the available budget." });
        }

        // Subtract expense amount from available amount
        budget.availableAmount -= expenseAmount;
        await budget.save();

        // Save the expense
        const newExpense = new Expense({
            userId,
            amount: expenseAmount,
            description,
            date,
            category  // ✅ Fixed field name
        });

        await newExpense.save();

        const updatedBudget = await Budget.findOne({ userId, category });

        return res.status(201).json({
            message: "Expense added successfully.",
            expense: newExpense,
            updatedBudget: updatedBudget  // Return the updated budget
        });

    } catch (error) {
        console.error("Error adding expense:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
});

module.exports = router;
