import Review from "../models/ReviewSchema.js"
import Doctor from "../models/DoctorSchema.js"

// Get all reviews
export const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find({});
        res.status(200).json({ success: true, message: 'Successfully retrieved all reviews', data: reviews });
    } catch (error) {
        res.status(404).json({ success: false, message: 'Not found', error: error.message });
    }
}

// Create Review
export const createReview = async (req, res) => {
    if (!req.body.doctor) {
        req.body.doctor = req.params.doctorId;
    }
    if (!req.body.user) {
        req.body.user = req.params.userId;
    }

    const newReview = new Review(req.body);
    try {
        const savedReview = await newReview.save();

        const updatedDoctor = await Doctor.findByIdAndUpdate(req.body.doctor, {
            $push: { reviews: savedReview._id }
        }, { new: true, runValidators: true });

        if (!updatedDoctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        res.status(200).json({ success: true, message: "Review submitted", data: savedReview });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}


