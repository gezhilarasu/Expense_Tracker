const mongoose = require("mongoose");
const pendinguserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

    otp:{
        type: String,
        default: null,
      },
      otp_expiry:{
        type: Date,
        default:null,
      }
  },
  { timestamps: true }
);

pendinguserSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });

module.exports = mongoose.model("pendingUser", pendinguserSchema);