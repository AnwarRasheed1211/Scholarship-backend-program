import mongoose from "mongoose";

const WorkSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    datetimeStartDate: String,
    dateTimeStartTime: String,
    datetimeEndDate: String,
    datetimeEndTime: String,
    scholarshipHours: String,
    location: String,
    qualifcations: String,
    contacts: String,
  },
  { strict: false }
);

export default mongoose.models.work || mongoose.model("works", WorkSchema);