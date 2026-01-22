import mongoose, {
  Schema
} from "mongoose";
import bcrypt from "bcrypt"
const userSchema = new Schema({
  Username: {
    type: String,
    required: true
  },
  Email: {
    type: String,
    required: true,
    unique: true
  },
  Password: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})
userSchema.pre("save", async function (next) {
  if (!this.isModified('Password')) {
    next()
  }
  this.Password = await bcrypt.hash(this.Password, 10);
})
export const User = mongoose.model("User", userSchema)