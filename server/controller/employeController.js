const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Employe = require("../models/Employe");
const SECRET = process.env.SECRET_KEY;
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(402)
        .json({ success: false, message: "credentials required" });
    }
    const employe = await Employe.findOne({ email });
    if (employe) {
      return res
        .status(400)
        .json({ success: false, message: "User already exist" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const employee = new Employe({ name, email, password: hashedPassword });
    await employee.save();

    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error registering user" });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(402)
        .json({ success: false, message: "credentials required" });
    }
    const employee = await Employe.findOne({ email });
    if (!employee) {
      return res.status(404).json({ success: false, message: "invalid email" });
    }
    const isMatch = await bcrypt.compare(password, employee.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "invalid password " });
    }
    const token = jwt.sign({ id: employee._id }, SECRET);
    employee.password = null;
    if (!token) res.status(403).json("token can't generated.");
    res.json({ success: true, token, employee });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

module.exports = { register, login };
