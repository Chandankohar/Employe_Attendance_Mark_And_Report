# This project is basically for the login when employe connected to the office router and mark himself as present at specific geolocation. At specific time if he/she cant able to mark his attendance as present then by default its will be Absent.

Technology Used:
Mongodb
Express.Js
Node.Js
React
node-wifi

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `Backend`
//in terminal cd server then do all this things
### `first of all create .env in /server folder and initilize`
DATABASE_URL="URL OF YOUR DATABASE"
SECRET_KEY="YOUR SECRET KEY"
LONGITUDE=*****
LATITUDE=******
RANGE=0.001  //IT INDICATE 1 METER RANGE
WIFI_SSID='YOUR WIFI SSID'
PORT=4000
WIFI_MODE='YOUR WIFI MODE'  // you get your wifi mode after npm install and run the following code by creating any file like abc.js and put the given code into this file and run by: node abc.js:

const wifi = require("node-wifi");

wifi.init({ iface: null });
const currentConnections = await wifi.getCurrentConnections();
console.log(currentConnections)

you can gate WIFI_MODE in console

### `npm start`
Runs the backend



### `frontend`
/back to your project root directory
### `create .env`
/initalize:
REACT_APP_API_URL=your_api_url

### `npm start`
Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

