const wifi = require("node-wifi");

wifi.init({ iface: null });
const check = async () => {
  const currentConnections = await wifi.getCurrentConnections();
  console.log(currentConnections[0].mode);
};
check();
