const Budget = require("../models/budget");

const addBudget = async (req, res) => {
    let { category, amount } = req.body;
    let availableAmount =amount;

    const userId = req.user?.id;

    if (!category || !amount) {
        return res.status(400).json({ error: "Category and amount are required" });
    }
    try {
        const existsbudget = await Budget.findOne({ userId, category });
        if (existsbudget) {
            return res.status(400).json({ error: "Budget name already exists" });
        }
        const budget = new Budget({
            userId,
            category,
            amount,
            availableAmount
        });
        await budget.save();
        return res.status(200).json({ message: "Budget added successfully", budget });
    }
    catch (err) {
        console.error("Error adding budget:", err);
        return res.status(500).json({ error: "Server error" });
    }
}


const getBudgets = async (req, res) => {
    const userId = req.user?.id;

    try {
        const budgets = await Budget.find({ userId });
        if (!budgets || budgets.length === 0) {
            return res.status(404).json([]);
        }
        return res.status(200).json(budgets);
    }
    catch (err) {
        console.error("Error fetching budgets:", err);
        return res.status(500).json({ error: "Server error" });
    }
}


const updateBudget = async (req, res) => {
    const userId = req.user?.id;
    const { category, amount } = req.body;
    try {
        const budget = await Budget.findOne({ userId, category });
        if (!budget) {
            return res.status(404).json({ message: "Budget not found" });
        }

        // Calculate how much has already been spent
        const used_amount = Number(budget.amount - budget.availableAmount);
        const newAmount = Number(amount);

        // Ensure the new amount is not less than what has already been spent
        if (newAmount < used_amount) {
            return res.status(400).json({
                message: "You have already spent more than the updated budget amount."
            });
        }

        // Update budget fields
        budget.amount = newAmount;
        budget.availableAmount = newAmount - used_amount;

        await budget.save();

        res.status(200).json(budget);
    } catch (error) {
        console.error("Error updating budget:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const deleteBudget = async (req, res) => {
    const { budgetId } = req.params;
  
    try {
        const deleted = await Budget.findByIdAndDelete(budgetId);
  
        if (!deleted) {
            return res.status(404).json({ message: "Budget not found." });
        }
  
        res.status(200).json({ message: "Budget deleted successfully." });
    } catch (err) {
        console.error("Error deleting budget:", err);
        res.status(500).json({ message: "Server error." });
    }
};
  
module.exports = {
    addBudget,
    getBudgets,
    updateBudget,
    deleteBudget
};