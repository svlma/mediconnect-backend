import User from "../models/UserSchema.js";
import Doctor from "../models/DoctorSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Function to generate a JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "15d",
    }
  );
};

export const register = async (req, res) => {
  const { email, password, name, role, photo, gender } = req.body;
  try {
    let user = null;
    if (role == "patient") {
      user = await User.findOne({ email });
    } else if (role == "doctor") {
      user = await Doctor.findOne({ email });
    }

    // Check if user exists
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt); // Correct usage of bcrypt for hashing

    if (role == "patient") {
      user = new User({
        name,
        email,
        password: hashPassword,
        photo,
        gender,
        role,
      });
    } else if (role == "doctor") {
      user = new Doctor({
        name,
        email,
        password: hashPassword,
        photo,
        gender,
        role,
      });
    }
    await user.save();
    const token = generateToken(user);
    res
      .status(200)
      .json({ success: true, message: "User successfully created", token });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res
      .status(500)
      .json({ success: false, message: "Internal server error, try again" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user =
      (await User.findOne({ email })) || (await Doctor.findOne({ email }));

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid password" });
    }

    // Generate token
    const token = generateToken(user);

    // Prepare user data for response, excluding password and version key
    const { password: pwd, __v, ...userData } = user.toObject();

    res.status(200).json({
      status: true,
      message: "Successfully login",
      data: { ...userData, token },
    });
  } catch (err) {
    console.error(err); // Log the error for more detailed debugging
    res.status(500).json({ status: false, message: "Failed to login" });
  }
};
