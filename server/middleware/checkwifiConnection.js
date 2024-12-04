const wifi = require("node-wifi");
const ALLOWED_SSID = process.env.WIFI_SSID;
const ALLOWED_MODE = process.env.WIFI_MODE; // Replace with your office WiFi SSID
wifi.init({ iface: null });
exports.checkWiFiConnection = async (req, res, next) => {
  try {
    const currentConnections = await wifi.getCurrentConnections();

    if (
      currentConnections.length === 0 ||
      currentConnections[0].bssid !== ALLOWED_SSID ||
      currentConnections[0].mode !== ALLOWED_MODE
    ) {
      // return res.send(currentConnections[0].ssid)
      return res
        .status(403)
        .json({
          success: false,
          message: `You must be connected to the ${ALLOWED_SSID} to login`,
        });
    }
    next();
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Error checking WiFi connection" });
  }
};
