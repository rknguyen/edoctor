"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = __importStar(require("mongoose"));
const BookingSchema = new mongoose.Schema({
    status: {
        type: String,
        required: true,
        default: 'RUNNING',
    },
    name: {
        type: String,
        required: true,
    },
    symptom: {
        type: [String],
        required: false,
        default: [],
    },
    gender: {
        type: String,
        required: true,
    },
    dob: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    passportNumber: {
        type: String,
        required: true,
    },
    healthCareId: {
        type: String,
        required: true,
    },
    doctorId: {
        type: String,
        required: true,
    },
    bookingDateTimestamp: {
        type: Number,
        required: true,
    },
    startBlockTimeIndex: {
        type: Number,
        required: true,
    },
    endBlockTimeIndex: {
        type: Number,
        required: true,
    },
    zoomMeetingId: {
        type: Number,
        required: true,
    },
    rating: {
        type: Number,
        required: false,
        default: null,
    },
    description: {
        type: String,
        required: false,
    },
    createdAt: {
        type: Number,
        required: false,
    },
    modifiedAt: {
        type: Number,
        required: false,
    },
});
BookingSchema.pre('save', function (next) {
    this.modifiedAt = Date.now();
    if (!this.createdAt) {
        this.createdAt = this.modifiedAt;
    }
    next();
});
exports.BookingModel = mongoose.model('booking', BookingSchema, 'bookings');
/**
 * METHODS BEGIN HERE
 */
exports.Bookings = {
    getAllBookings: () => exports.BookingModel.find({}).sort({ createdAt: 'desc' }),
    findBookingById: (id) => exports.BookingModel.findById(id),
    create: (name) => exports.BookingModel.create({ name }),
    deleteById: (id) => exports.BookingModel.findByIdAndDelete(id),
};
//# sourceMappingURL=booking.js.map