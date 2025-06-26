import mongoose from "mongoose";

const followSchema = new mongoose.Schema(
  {
    followerId: { type: String, required: true, index: true }, // Who is following
    followingId: { type: String, required: true, index: true }, // Who is being followed
  },
  { timestamps: true }
);

followSchema.index({ followerId: 1, followingId: 1 }, { unique: true });
// Indexes for quickly finding all followers or all following for a user
followSchema.index({ followerId: 1 });
followSchema.index({ followingId: 1 });

const FollowModel = mongoose.model("Follow", followSchema);
