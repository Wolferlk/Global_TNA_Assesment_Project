import mongoose from "mongoose";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const jobRequestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 120
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: 2000
    },
    category: {
      type: String,
      trim: true,
      default: ""
    },
    location: {
      type: String,
      trim: true,
      default: ""
    },
    contactName: {
      type: String,
      trim: true,
      default: ""
    },
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
      validate: {
        validator(value) {
          return !value || emailPattern.test(value);
        },
        message: "Contact email must be valid"
      },
      default: ""
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Closed"],
      default: "Open"
    }
  },
  {
    collection: "jobRequests",
    timestamps: { createdAt: true, updatedAt: false }
  }
);

export const JobRequest = mongoose.model("JobRequest", jobRequestSchema);
