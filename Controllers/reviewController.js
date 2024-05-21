import Review from "../models/ReviewSchema.js"
import Doctor from "../models/DoctorSchema.js"
import User from "../models/UserSchema.js"

// Get all reviews
export const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find({doctor: req.params.id});
        res.status(200).json({ success: true, message: 'Successfully retrieved all reviews', data: reviews });
    } catch (error) {
        res.status(404).json({ success: false, message: 'Not found', error: error.message });
    }
}

// Create Review
export const createReview = async (req, res) => {
    const doctorId = req.params.id;
    const userId = req.userId;
    const rating = req.body.rating;
    const reviewText = req.body.reviewText;

    if (!doctorId || !userId || !rating || !reviewText) {
        return res.status(404).json({ success: false, message: "Invalid request" });
    }

    try {
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const newReview = new Review({ doctor: doctorId, user: userId, rating, reviewText });
        const savedReview = await newReview.save();

        await Doctor.findByIdAndUpdate(doctorId, { $push: { reviews: savedReview._id } }, { new: true, runValidators: true });

        res.status(200).json({ success: true, message: "Review submitted", data: savedReview });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}


