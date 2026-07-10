import mongoose, { Schema } from "mongoose";

const adminOtpChallengeSchema = new Schema(
  {
    identifier: { type: String, required: true, index: true },
    sessionToken: { type: String, required: true, unique: true, index: true },
    codeHash: { type: String, required: true },
    purpose: { type: String, default: "admin-login" },
    attempts: { type: Number, default: 0 },
    isUsed: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true },
    usedAt: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const AdminOtpChallenge =
  mongoose.models.AdminOtpChallenge ||
  mongoose.model("AdminOtpChallenge", adminOtpChallengeSchema);

export default AdminOtpChallenge;
