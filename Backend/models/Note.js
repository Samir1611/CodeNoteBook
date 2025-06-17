import mongoose from "mongoose";
const { Schema } = mongoose;

const NoteSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  tag: {
    type: String,
    default: "General",
  },
  status: {
    type: String,
    enum: ["Active", "On Hold", "Completed", "Dropped"],
    default: "Active",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
export const Note = mongoose.model("note", NoteSchema);
