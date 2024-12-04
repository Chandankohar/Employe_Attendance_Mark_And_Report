const Attendance = require("../models/Attendance");
const Employe = require("../models/Employe");
const cron = require("node-cron");

const OFFICE_LATITUDE = process.env.LATITUDE; // Replace with your office latitude
const OFFICE_LONGITUDE = process.env.LONGITUDE; // Replace with your office longitude
const LOCATION_TOLERANCE =process.env.RANGE ; // Approx ~1 meters, 1 tolerance = 100000 meter = 100km

// Function to check if coordinates are within the allowed range
function isWithinOffice(lat, lon) {
  const latDiff = Math.abs(lat - OFFICE_LATITUDE);
  const lonDiff = Math.abs(lon - OFFICE_LONGITUDE);
  return latDiff <= LOCATION_TOLERANCE && lonDiff <= LOCATION_TOLERANCE;
}

const markAttendance = async (req, res) => {
  try {
    const { employeeId, latitude, longitude } = req.body;
    if (!isWithinOffice(latitude, longitude)) {
      return res.status(403).json({
        success: true,
        message: "You must be at the office location to mark attendance",
      });
    }
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // Query for documents where the date is within the range
    const attendances = await Attendance.find({
      employeeId,
      timestamp: { $gte: startOfToday, $lte: endOfToday },
    });

    if (attendances.length >= 1) {
      return res
        .status(403)
        .json({ success: false, message: "Already marked" });
    }
    const attendance = new Attendance({
      employeeId,
      latitude,
      longitude,
      status: "Present",
    });
    await attendance.save();
    res
      .status(201)
      .json({ success: true, message: "Attendance marked successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Error marking attendance" });
  }
};
const getAttendance = async (req, res) => {
  const employee = req.employe;
  try {
    if (!employee) {
      return res
        .status(402)
        .json({ success: false, message: "Please login first" });
    }
    const employeeAttendance = await Attendance.find({
      employeeId: employee.id,
    });
    if (!employeeAttendance) {
      return res
        .status(404)
        .json({ success: false, message: "Unable to fetch attendance" });
    }
    res.status(201).json({ success: true, employeeAttendance });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

cron.schedule("0 10 * * *", async () => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const employees = await Employe.find({});
    const attendancePromises = employees.map(async (employee) => {
      const existingAttendance = await Attendance.findOne({
        employeeId: employee._id,
        timestamp: { $gte: startOfToday, $lte: endOfToday },
      });

      if (!existingAttendance) {
        await Attendance.create({
          employeeId: employee._id,
          latitude: 0,
          longitude: 0,
          status: "Absent",
        });
      }
    });

    await Promise.all(attendancePromises);
    console.log("Default absent attendance updated.");
  } catch (err) {
    console.error("Error in daily attendance job:", err);
  }
});

module.exports = { markAttendance, getAttendance };
