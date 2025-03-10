const mongoose=require("mongoose");

const TotalBudgetSchema=new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "user", 
        required: true 
      },

    Total_BudgetLimit:{
        type:Number,
        required:True
    }
}, { timestamps: true });

module.exports=mongoose.model("total_budget",TotalBudgetSchema);
