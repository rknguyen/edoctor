import * as mongoose from 'mongoose';

/**
 * INTERFACES ARE DECLARE HERE
 */

export interface IBookingModel extends mongoose.Document {
  status: string;
  name: string;
  symptom: string[];
  gender: string;
  dob: string;
  address: string;
  phoneNumber: string;
  passportNumber: string;
  healthCareId: string;
  doctorId: string;
  bookingDateTimestamp: number;
  startBlockTimeIndex: number;
  endBlockTimeIndex: number;
  zoomMeetingId: number;
  rating: number;
  description: string;
  createdAt: number;
  modifiedAt: number;
}

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

BookingSchema.pre<IBookingModel>('save', function (next) {
  this.modifiedAt = Date.now();
  if (!this.createdAt) {
    this.createdAt = this.modifiedAt;
  }
  next();
});

/**
 * GROUPS BEGIN HERE
 */

export type IBookingQuery = mongoose.DocumentQuery<IBookingModel | null, IBookingModel, {}>;

export type IBookingsQuery = mongoose.DocumentQuery<IBookingModel[], IBookingModel, {}>;

export const BookingModel = mongoose.model<IBookingModel>('booking', BookingSchema, 'bookings');

/**
 * METHODS BEGIN HERE
 */
export const Bookings = {
  getAllBookings: (): IBookingsQuery => BookingModel.find({}).sort({ createdAt: 'desc' }),
  findBookingById: (id: string): IBookingQuery => BookingModel.findById(id),
  create: (name: string): Promise<IBookingModel> => BookingModel.create({ name }),
  deleteById: (id: string): IBookingQuery => BookingModel.findByIdAndDelete(id),
};
