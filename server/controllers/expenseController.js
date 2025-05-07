const Expense = require('../models/expense'); 
const Budget = require('../models/budget');

const addExpense = async (req, res) => {
    const {category,amount, description, date} =req.body;
    const userId = req.user?.id;
        try {
            
            
            if (!userId) return res.status(400).json({ error: "User ID is required." });

            let expenseAmount = Number(amount);

            if (isNaN(expenseAmount) || expenseAmount <= 0) {
                return res.status(400).json({ error: "Invalid expense amount." });
            }
    
            const budget = await Budget.findOne({ userId, category });
    
            if (!budget) return res.status(404).json({ error: "Budget not found for this category." });
    
            if (expenseAmount > budget.availableAmount) {
                return res.status(400).json({ error: "Expense exceeds the available budget." });
            }
    
            budget.availableAmount -= expenseAmount;
            await budget.save();
    
            const newExpense = new Expense({
                userId,
                amount: expenseAmount,
                description,
                date,
                category 
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
}

const getExpenses = async (req, res) => {
    const userId = req.user?.id;
    try {
        const expenses = await Expense.find({ userId });
        if (!expenses || expenses.length === 0) {   
            return res.status(404).json({ error: "No expenses found" });
        }
        return res.status(200).json({ message: "Expenses fetched successfully",expenses});
    } catch (error) {
        console.error("Error fetching expenses:", error);
        return res.status(500).json({ error: "Server error" });
    }
}

module.exports = {
    addExpense,
    getExpenses
};
