import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Content = ({ user, activeSection }) => {
  
  const [location, setLocation] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [attendanceDetail, setAttendanceDetail] = useState([]);
  const url = process.env.REACT_APP_API_URL;
  const getAttendanceDetail = async () => {
    try {
      const response = await axios.get(
        `${url}/attendance/attendancedetail/${user?._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("employeToken")}`,
          },
        }
      );

      setAttendanceDetail(response.data.employeeAttendance.reverse());
      toast.success("Successfully fetch your attendance");
    } catch (err) {
      toast.error(
        err.response
          ? err.response.data.message
          : " fetching Attendance detail failed"
      );
    }
  };
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      });
    } else {
      alert("please allow the location");
    }
    getAttendanceDetail();
  }, [refresh]);

  const punchinPresent = async () => {
    if (location) {
      try {
        const response = await axios.post(
          `${url}/attendance/punchinattendance`,
          {
            employeeId: user._id, // Replace dynamically
            latitude: location.latitude,
            longitude: location.longitude,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("employeToken")}`,
            },
          }
        );

        toast.success(response.data.message);
      } catch (err) {
        toast.error(
          err.response ? err.response.data.message : "Attendance marking failed"
        );
      }
    } else {
      toast.error("Location not available");
    }
  };

  const punchoutPresent = async () => {
    if (location) {
      try {
        const response = await axios.post(
          `${url}/attendance/punchoutattendance`,
          {
            employeeId: user._id, // Replace dynamically
            latitude: location.latitude,
            longitude: location.longitude,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("employeToken")}`,
            },
          }
        );

        toast.success(response.data.message);
      } catch (err) {
        toast.error(
          err.response ? err.response.data.message : "Attendance marking failed"
        );
      }
    } else {
      toast.error("Location not available");
    }
  };

  function formatDatestamp(timestamp) {
    // Create a new Date object from the provided timestamp
    const date = new Date(timestamp);

    // Return the formatted date-time string using the Asia/Kolkata timezone
    return date.toLocaleString("en-IN", {
      hour12: false, // 24-hour format
      timeZone: "Asia/Kolkata", // Set the time zone to Asia/Kolkata
    });
  }
  function formatTimestamp(timestamp) {
    // Create a new Date object from the provided timestamp
    const date = new Date(timestamp);

    // Return the formatted date-time string using the Asia/Kolkata timezone
    const formattedTime = date.toLocaleString("en-IN", {
      hour12: false, // 24-hour format
      timeZone: "Asia/Kolkata", // Set the time zone to Asia/Kolkata
    });

    const timeParts = formattedTime.split(",")[1].trim(); // Extract the time part after the comma (e.g., "08:30:00")
    const [hour, minute] = timeParts
      .split(":")
      .map((part) => parseInt(part, 10)); // Get the hour and minute parts

    const formattedHour = hour > 12 ? hour - 12 : hour; // Convert to 12-hour format
    const period = hour >= 12 ? "PM" : "AM"; // Determine AM/PM
    // Return the formatted time string including hours, minutes, and AM/PM
    return `${formattedHour}:${minute < 10 ? "0" + minute : minute} ${period}`;
  }

  return (
    <div className="content">
      <div
        id="home"
        className={`section ${activeSection === "home" ? "active" : ""}`}
      >
        <div className="user-profile">
          <h2>Welcome, User!</h2>

          <ul>
            <li>Name: {user?.name}</li>
            <li>Email: {user?.email}</li>
          </ul>
        </div>
      </div>

      <div
        id="attendance-details"
        className={`section ${
          activeSection === "attendance-details" ? "active" : ""
        }`}
      >
        <div id="attendance" className="mark-attendance">
          <h2>Mark Attendance</h2>
          <p>Mark yourself as present for today</p>
          <div class='button-control'>
          <div className="attendance">
            <button
              id="markAttendance"
              className="mark-in"
              onClick={punchinPresent}
            >
              Punch In
            </button>
          </div>
          <div class= "vertical"></div>
          <div className="attendance">
            <button
              id="markAttendance"
              className="mark-out"
              onClick={punchoutPresent}
            >
              Punch Out
            </button>
          </div>
          </div>
          <div className="notice">Note: Please! donot forget to punchout otherwise you will be absent for whole day.</div>
        </div>
        <hr />
        <h2 className="attendance-detail-head">Attendance Details</h2>
        <button
          className="refresh-attendance"
          title="Refresh to fetch your attendance"
          onClick={() => setRefresh((prev) => !prev)}
        >
          Refresh
        </button>
        <table className="attendance-table">
          <thead>
            <tr>
              <th className="attendance-table-head">Date</th>
              <th className="attendance-table-head">Punch In Time</th>
             
              <th className="attendance-table-head">Punch Out Time</th>
              <th className="attendance-table-head">Working Hours</th>
              <th className="attendance-table-head">Status</th>
            </tr>
          </thead>
          <tbody>
            {attendanceDetail?.length > 0 ? (
              attendanceDetail.map((attend) => (
                <tr key={attend._id}>
                  <>
                    <td className="attendance-table-content">
                      {formatDatestamp(attend?.punchintimestamp).split(",")[0]}
                    </td>
                    <td className="attendance-table-content">
                      {attend?.punchinstatus==='Absent'?'--:--':formatTimestamp(attend?.punchintimestamp)}
                    </td>
                    
                    <td className="attendance-table-content">
                      {attend?.punchouttimestamp
                        ? formatTimestamp(attend?.punchouttimestamp)
                        : '--:--'}
                    </td>
                    <td className="attendance-table-content">
                      {attend?.workinghour}
                    </td>

                    <td
                      style={{
                        color:
                          attend?.punchinstatus === "Present" ? "green" : "red",
                        fontWeight: "bold",
                      }}
                    >
                      {attend?.punchinstatus}
                    </td>
                  </>
                </tr>
              ))
            ) : (
              <tr key={"none"}>
                <td colSpan="6">No attendance data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Content;
