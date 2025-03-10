const express = require("express");
const router = express.Router();
const Budget = require("../models/budget");


// ✅ API to Add Budget
router.post("/add", async (req, res) => {
  let { amount, category, userId } = req.body;
  amount = Number(amount);
  let availableAmount=amount;
  console.log("Received data:", { category, amount,availableAmount, userId });
  console.log(typeof amount);
  console.log(typeof availableAmount);

  if (!userId || !amount || !category) {
    return res.status(400).json({ error: "User ID, amount, and category are required" });
  }

  try {
    const budget = new Budget({
      userId, // Ensure userId is saved
      category,
      amount,
      availableAmount,
    });

    await budget.save();
    res.status(201).json({ message: "Budget added successfully", budget });
  } catch (error) {
    console.error("Error adding budget:", error);
    res.status(500).json({ error: "Server error" });
  }
});
// ✅ API to Fetch Budgets of Logged-in User
router.get("/user-budgets/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const budgets = await Budget.find({ userId }); // Fetch budgets for the specific user
    res.status(200).json(budgets);
  } catch (error) {
    console.error("Error fetching budgets:", error);
    res.status(500).json({ error: "Server error" });
  }
});


// Update Budget
router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  let { category, amount } = req.body;
  console.log(amount);
  try {
    console.log(`🔍 Finding budget with ID: ${id}`);
    const budget = await Budget.findById(id);

    if (!budget) {
      console.log("❌ Budget not found");
      return res.status(404).json({ message: "Budget not found" });
    }

    console.log(`✅ Found budget:`, budget);

    // Calculate how much has already been spent
    let used_amount = budget.amount - budget.availableAmount;
    console.log(`💰 Used amount: ${used_amount}`);

    // Ensure provide_amount is a valid number
    used_amount = Number(used_amount);
    console.log("category type:", typeof category);
    console.log("used_Amount type:", typeof used_amount);

    // Ensure the new amount is not less than what has already been spent
    if (amount < used_amount) {
      console.log("❌ New budget is less than used amount!");
      return res.status(400).json({
        message: "You have already spent more than the updated budget amount.",
      });
    }

    // Update budget fields
    budget.amount =amount;// Assign to a new variable
    budget.availableAmount = amount - used_amount;
    amount = parseFloat(budget.amount);
    availableAmount=parseFloat(budget.availableAmount);
    console.log("Amount type:", typeof budget.amount);
    console.log("availableAmount type:", typeof budget.availableAmount);


    console.log(`🔄 Updating budget to:`,budget.amount);

    // Perform the update operation
    const updatedBudget = await Budget.findByIdAndUpdate(
      id,
      { category, amount, availableAmount },
      { new: true } // Returns the updated document
    );

    if (!updatedBudget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.status(200).json(updatedBudget);
  } catch (error) {
    console.error("Error updating budget:", error);
    res.status(500).json({ message: "Server error" });
  }
});




// Delete a specific budget by ID
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    console.log(`Received request to delete budget with ID: ${id}`); // Debugging log

    // Check if the budget exists before deleting
    const budget = await Budget.findById(id);

    if (!budget) {
      console.log("Budget not found");
      return res.status(404).json({ message: "Budget not found" });
    }

    // Delete the specific budget entry
    await Budget.findByIdAndDelete(id);
    console.log("Budget deleted successfully");

    res.status(200).json({ message: "Budget deleted successfully" });
  } catch (error) {
    console.error("Error deleting budget:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


module.exports = router;
