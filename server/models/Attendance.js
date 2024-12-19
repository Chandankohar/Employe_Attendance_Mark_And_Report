const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  punchinlatitude: { type: Number, required: true },
  punchinlongitude: { type: Number, required: true },
  punchinstatus:{ type: String, required: true },
  punchintimestamp: { type: Date, default: new Date(Date.now()).toLocaleString("en-IN", {
    hour12: false,
    timeZone: "Asia/Kolkata",
  }) },
  punchoutlatitude: { type: Number, default:0},
  punchoutlongitude: { type: Number, default:0},
  punchoutstatus:{ type: String, default:null },
  punchouttimestamp: { type: Date,  default:null},
  workinghour:{ type: String, default:0 },
});

const Attendance = mongoose.model('Attendance', AttendanceSchema);
module.exports=Attendance
