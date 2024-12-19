const Attendance = require("../models/Attendance");
const Employe = require("../models/Employe");
const cron = require("node-cron");

const OFFICE_LATITUDE = process.env.LATITUDE; // Replace with your office latitude
const OFFICE_LONGITUDE = process.env.LONGITUDE; // Replace with your office longitude
const LOCATION_TOLERANCE = process.env.RANGE; // Approx ~100 meters, 1 tolerance = 100000 meter = 100km
const CLOSING_HOUR = process.env.OFFICE_CLOSING_TIME_HOUR;
const CLOSING_MINUTES = process.env.OFFICE_CLOSING_TIME_MINUTES;

//current date and time to check
const now = new Date(Date.now()).toLocaleString("en-IN", {
  hour12: false,
  timeZone: "Asia/Kolkata",
});

const currenthrs = now.split(",");
const [hours, minutes] = currenthrs[1].split(":").map(Number);
const currentTime = hours * 60 + minutes; // Convert time to minutes

// Define a given time (e.g., 14:30 or 2:30 PM) range for the punch in the attehdance
const punchinstartHour = Number(process.env.OFFICE_OPENING_TIME_HOUR); // 14 for 2 PM
const punchinstartMinute = Number(process.env.OFFICE_OPENING_TIME_MINUTES);
const punchinstartTime = punchinstartHour * 60 + punchinstartMinute; // Convert given time to minutes

const punchinendHour = Number(punchinstartHour) + 1; // 14 for 2 PM
const punchinendMinute = Number(punchinstartMinute);
const punchinendTime = punchinendHour * 60 + punchinendMinute;

//half Time
const halfpunchoutHour = Number(process.env.OFFICE_HALF_TIME_HOUR); // 14 for 2 PM
const halfpunchoutMinute = Number(process.env.OFFICE_HALF_TIME_MINUTES);
const halfpunchoutTime = halfpunchoutHour * 60 + halfpunchoutMinute; // Convert given time to minutes


// Function to check if coordinates are within the allowed range
function isWithinOffice(lat, lon) {
  const latDiff = Math.abs(lat - OFFICE_LATITUDE);
  const lonDiff = Math.abs(lon - OFFICE_LONGITUDE);
  return latDiff <= LOCATION_TOLERANCE && lonDiff <= LOCATION_TOLERANCE;
}

//to get the start and end of the today
function getStartAndEndOfToday() {
  // Get the current date-time in the "Asia/Kolkata" timezone
  const startOfToday = new Date(Date.now()).toLocaleString("en-IN", {
    hour12: false,
    timeZone: "Asia/Kolkata",
  });
  // Create Date objects for start and end of today
  const startOfTodayDate = new Date(startOfToday);
  startOfTodayDate.setHours(0, 0, 0, 0); // Set time to 00:00:00.000

  const endOfToday = new Date(Date.now()).toLocaleString("en-IN", {
    hour12: false,
    timeZone: "Asia/Kolkata",
  });

  const endOfTodayDate = new Date(endOfToday);
  endOfTodayDate.setHours(23, 59, 59, 999); // Set time to 23:59:59.999

  // Return both start and end of today as Date objects
  return { startOfTodayDate, endOfTodayDate };
}


function timeFormatter(hour, minute) {
  let minutes = minute === 0 ? `${minute}0` : minute;
  if (hour > 12) {
    return `${hour - 12}:${minutes} PM`;
  } else {
    return `${hour}:${minutes} AM`;
  }
}
//punch in attendance
const punchinAttendance = async (req, res) => {
  try {
    const { employeeId, latitude, longitude } = req.body;
    if (!isWithinOffice(latitude, longitude)) {
      return res.status(403).json({
        success: false,
        message: "You must be at the office location to mark attendance",
      });
    }
    //to check the office time
    if (currentTime < punchinstartTime || currentTime > punchinendTime) {
      return res.status(403).json({
        success: false,
        message: `Please Punch on the attendance between ${timeFormatter(punchinstartHour,punchinstartMinute)} 
        and ${timeFormatter(punchinendHour, punchinendMinute)}`,
      });
    }
    //to get  start and end of the day
    const { startOfTodayDate, endOfTodayDate } = getStartAndEndOfToday();

    // Query for documents where the date is within the range
    const attendances = await Attendance.find({
      employeeId,
      punchintimestamp: { $gte: startOfTodayDate, $lte: endOfTodayDate },
    });

    if (attendances.length >= 1) {
      return res.status(403).json({
        success: false,
        message: "Already you punchin your today attendance",
      });
    }
    const attendance = new Attendance({
      employeeId,
      punchinlatitude: latitude,
      punchinlongitude: longitude,
      punchinstatus: "Present",
    });
    await attendance.save();
    res
      .status(201)
      .json({ success: true, message: "Attendance Punch In successfully" });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, message: "Error marking attendance" });
  }
};

const punchoutAttendance = async (req, res) => {
  try {
    const { employeeId, latitude, longitude } = req.body;
    if (!isWithinOffice(latitude, longitude)) {
      return res.status(403).json({
        success: false,
        message: "You must be at the office location to mark attendance",
      });
    }
    // to check the office time
    if (currentTime < halfpunchoutTime) {
      return res.status(403).json({
        success: false,
        message: `Please Punch out the attendance after ${timeFormatter(halfpunchoutHour,halfpunchoutMinute)} for half day `,
      });
    }
    const { startOfTodayDate, endOfTodayDate } = getStartAndEndOfToday();

    const attendance = await Attendance.findOne({
      employeeId,
      punchintimestamp: { $gte: startOfTodayDate, $lte: endOfTodayDate },
    });

    if (!attendance) {
      return res.status(403).json({
        success: false,
        message: "You must first punch in the attendance",
      });
    }

    // Query for documents where the date is within the range
    const attendances = await Attendance.find({
      employeeId,
      punchintimestamp: { $gte: startOfTodayDate, $lte: endOfTodayDate },
      $or: [{ punchoutstatus: "Absent" }, { punchoutstatus: "Present" }],
    });

    if (attendances.length >= 1) {
      return res.status(403).json({
        success: false,
        message: "Already you punchout your today attendance",
      });
    }

    const timepunch = new Date(Date.now()).toLocaleString("en-IN", {
      hour12: false,
      timeZone: "Asia/Kolkata",
    });
    const differenceInMinutes =
      Math.floor(new Date(timepunch) - new Date(attendance.punchintimestamp)) /
      (1000 * 60);
    const workinghour = `${Math.floor(
      differenceInMinutes / 60
    )} hour ${Math.floor(differenceInMinutes % 60)} minute`;

    (attendance.punchoutlatitude = latitude),
      (attendance.punchoutlongitude = longitude),
      (attendance.punchoutstatus = "Present"),
      (attendance.punchouttimestamp = timepunch),
      (attendance.workinghour = workinghour),
      await attendance.save();
    res
      .status(201)
      .json({ success: true, message: "Attendance Punch Out successfully" });
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

cron.schedule(`${CLOSING_MINUTES} ${CLOSING_HOUR} * * *`, async () => {
  try {
    const { startOfTodayDate, endOfTodayDate } = getStartAndEndOfToday();

    const employees = await Employe.find({});
    const attendancePromises = employees.map(async (employee) => {
      const existingAttendance = await Attendance.findOne({
        employeeId: employee._id,
        punchintimestamp: { $gte: startOfTodayDate, $lte: endOfTodayDate },
        punchouttimestamp: { $gte: startOfTodayDate, $lte: endOfTodayDate },
      });

      if (!existingAttendance) {
        const updateAttendance = await Attendance.findOne({
          employeeId: employee._id,
          punchintimestamp: { $gte: startOfTodayDate, $lte: endOfTodayDate },
          punchouttimestamp: null,
        });

        if (updateAttendance) {
          (updateAttendance.employeeId = employee._id),
            (updateAttendance.punchinlatitude = 0),
            (updateAttendance.punchinlongitude = 0),
            (updateAttendance.punchinstatus = "Absent"),
            (updateAttendance.punchoutlatitude = 0),
            (updateAttendance.punchoutlongitude = 0),
            (updateAttendance.punchoutstatus = "Absent"),
            await updateAttendance.save();
        } else {
          await Attendance.create({
            employeeId: employee._id,
            punchinlatitude: 0,
            punchinlongitude: 0,
            punchinstatus: "Absent",
            punchoutlatitude: 0,
            punchoutlongitude: 0,
            punchoutstatus: "Absent",
          });
        }
      }
    });

    await Promise.all(attendancePromises);
    console.log("Default absent attendance updated.");
  } catch (err) {
    console.error("Error in daily attendance job:", err);
  }
});

module.exports = { punchinAttendance, punchoutAttendance, getAttendance };
