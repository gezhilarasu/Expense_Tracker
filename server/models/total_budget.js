const mongoose = require("mongoose");

const TotalBudgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    Total_BudgetLimit: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TotalBudget", TotalBudgetSchema);
