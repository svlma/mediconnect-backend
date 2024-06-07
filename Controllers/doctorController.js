import Booking from "../models/BookingSchema.js";
import Doctor from "../models/DoctorSchema.js";

// Update Doctor
export const updateDoctor = async (req, res) => {
  const id = req.params.id;

  try {
    const updateDoctor = await Doctor.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Successfully updated",
      data: updateDoctor,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update" });
  }
};

// Delete Doctor
export const deleteDoctor = async (req, res) => {
  const id = req.params.id;

  try {
    await Doctor.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Successfully deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete" });
  }
};

// Get one Doctor
export const getSingleDoctor = async (req, res) => {
  const id = req.params.id;

  try {
    const doctor = await Doctor.findById(id)
      .populate("reviews")
      .select("-password");

    res
      .status(200)
      .json({ success: true, message: "Doctor found", data: doctor });
  } catch (error) {
    res.status(404).json({ success: false, message: "No Doctor found" });
  }
};

// Get All Doctors
export const getAllDoctor = async (req, res) => {
  try {
    const { query, location } = req.query;
    let doctors;

    if (query) {
      doctors = await Doctor.find({
        isApproved: "approved",
        $or: [
          { name: { $regex: query, $options: "i" } },
          { specialization: { $regex: query, $options: "i" } },
          { location: { $regex: query, $options: "i" } },
        ],
      }).select("-password");
    } else if (location) {
      doctors = await Doctor.find({
        isApproved: "approved",
        location: { $regex: location, $options: "i" },
      }).select("-password");
    } else {
      doctors = await Doctor.find({ isApproved: "approved" }).select(
        "-password"
      );
    }

    res
      .status(200)
      .json({ success: true, message: "Doctors found", data: doctors });
  } catch (error) {
    res.status(404).json({ success: false, message: "No Doctors found" });
  }
};

// Get Doctor Profile
export const getDoctorProfile = async (req, res) => {
  const doctorId = req.userId;
  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }
    const { password, ...rest } = doctor._doc;
    const appointments = await Booking.find({ doctor: doctorId })
      .populate("user")
      .select("-password");

    res.status(200).json({
      success: true,
      message: "Profile info is getting",
      data: { ...rest, appointments },
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Something went wrong, cannot get " });
  }
};

// Get Doctors by Location
export const getDoctorsByLocation = async (req, res) => {
  const { location } = req.query;

  try {
    if (!location) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Location query parameter is required",
        });
    }

    const doctors = await Doctor.find({
      isApproved: "approved",
      location: { $regex: location, $options: "i" },
    }).select("-password");

    res.status(200).json({
      success: true,
      message: "Doctors found",
      data: doctors,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to retrieve doctors" });
  }
};
