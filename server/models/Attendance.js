const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  status:{ type: String, required: true },
  timestamp: { type: Date, default: Date.now() },
});

const Attendance = mongoose.model('Attendance', AttendanceSchema);
module.exports=Attendance
