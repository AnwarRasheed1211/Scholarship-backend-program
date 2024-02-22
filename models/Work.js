import mongoose from 'mongoose';

const workSchema = new mongoose.Schema({
  picture: String,
  title: String,
  datetime: [{
    start: Date,
    end: Date,
    hours: Number,
  }],
  location: String,
  description: String,
  qualification: String,
  contacts: String,
  studentList: [{
    studentName: String,
    status: String,
  }],
  workStatus: String,
});

// Specify the collection name as 'work'
const WorkModel = mongoose.models.Work || mongoose.model('Work', workSchema, 'work');

export default WorkModel;