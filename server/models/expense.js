// models/Expense.js
const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  userId: { 
    type: String,
    required: true,
  },
  amount: { 
    type: Number, 
    required: true 
  },
  category: { 
    type: String, 
    required: true 
  },
  date: { 
    type: Date, 
    required: true 
  },
  description: { 
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Expense", expenseSchema);
