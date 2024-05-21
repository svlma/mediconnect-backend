import User from "../models/UserSchema.js";
import Booking from "../models/BookingSchema.js";
import Doctor from "../models/DoctorSchema.js";
//Update user

export const updateUser = async (req, res) => {
  const id = req.params.id;

  try {
    const updateUser = await User.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "successfully updated",
      data: updateUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "failed to update" });
  }
};

//Delete User
export const deleteUser = async (req, res) => {
  const id = req.params.id;

  try {
    await User.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "successfully deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "failed to delete" });
  }
};
//Get one user
export const getSingleUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id).select("-password");

    res.status(200).json({ success: true, message: "User found", data: user });
  } catch (error) {
    res.status(404).json({ success: false, message: "No user found" });
  }
};

//Get All users
export const getAllUser = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");

    res
      .status(200)
      .json({ success: true, message: "Users found", data: users });
  } catch (error) {
    res.status(404).json({ success: false, message: "No users found" });
  }
};

export const getUserProfile = async (req, res) => {
  const userId = req.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const { password, ...rest } = user._doc;
    res.status(200).json({
      success: true,
      message: "Profile info is getting",
      data: { ...rest },
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Something went wrong,cannot get " });
  }
};

export const getMyAppointments = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.userId });
    const doctorIds = bookings.map((el) => el.doctor._id);
    const doctors = await Doctor.find({ _id: { $in: doctorIds } }).select(
      "-password"
    );
    res.status(200).json({
      success: true,
      message: "Appointments are getting",
      data: doctors,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Something went wrong,cannot get " });
  }
};
