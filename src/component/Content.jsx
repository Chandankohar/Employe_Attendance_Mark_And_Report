import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Content = ({ user, activeSection }) => {
  const [location, setLocation] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [attendanceDetail, setAttendanceDetail] = useState([]);
  const url=process.env.REACT_APP_API_URL
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

      setAttendanceDetail(response.data.employeeAttendance);
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

  const markPresent = async () => {
    if (location) {
      try {
        const response = await axios.post(
          `${url}/attendance/markattendance`,
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

  return (
    <div className="content">
      <div
        id="home"
        className={`section ${activeSection === "home" ? "active" : ""}`}
      >
        <div className="user-profile">
        <h2 >Welcome, User!</h2>
       
        <ul >
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
        <p>Mark yourself as present for today:</p>
        
          <div className="attendance">  
            <button id="markAttendance"  className="mark-present"  onClick={markPresent}>
              Mark Present
            </button>
          </div>
        </div>
        <hr/>
        <h2 className="attendance-detail-head">Attendance Details</h2>
        <button className="refresh-attendance" title="Refresh to fetch your attendance" onClick={() => setRefresh((prev) => !prev)}>Refresh</button>
        <table className="attendance-table">
          <thead>
            <tr>
              <th className="attendance-table-head">Date</th>
              <th className="attendance-table-head">Status</th>
            </tr>
          </thead>
          <tbody>
            {attendanceDetail?.length > 0 ? (
              attendanceDetail.map((attend) => (
                <tr key={attend._id}>
                  <>
                  <td className="attendance-table-content" >{attend?.timestamp.slice(0,10)}</td>
                  <td style={{color:attend?.status==='Present'?'green':'red',fontWeight:'bold'}} >{attend?.status}</td>
                  </></tr>
              ))
            ) : (
              <tr key={'none'}>
              <td colSpan="2">No attendance data available</td>
              </tr> )}
          </tbody>
        </table>
      </div>
    </div>
  );
};



export default Content;


