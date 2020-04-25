"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@tsed/common");
const Guards_1 = require("../../middlewares/Guards");
const BookingsCtrl_Erro_1 = __importDefault(require("./BookingsCtrl.Erro"));
const booking_1 = require("../../models/booking");
const user_1 = require("../../models/user");
const blockTime_1 = require("../../utils/blockTime");
const zoom_1 = require("../../utils/zoom");
const attachment_1 = require("../../models/attachment");
let BookingsCtrl = class BookingsCtrl {
    getAllBookings() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookings = yield booking_1.Bookings.getAllBookings();
                for (let i = 0; i < bookings.length; ++i) {
                    bookings[i] = bookings[i].toObject();
                    if (bookings[i].doctorId) {
                        bookings[i].doctor = yield user_1.Users.findUserById(bookings[i].doctorId).then((doctor) => { var _a; return (_a = doctor) === null || _a === void 0 ? void 0 : _a.toObject(); });
                        delete bookings[i].doctor.availableTimeBlock;
                    }
                }
                return { success: true, data: bookings };
            }
            catch (error) {
                return { error };
            }
        });
    }
};
__decorate([
    common_1.Get('/'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BookingsCtrl.prototype, "getAllBookings", null);
BookingsCtrl = __decorate([
    common_1.Controller('/bookings'),
    common_1.UseAuth(Guards_1.AuthCheck),
    common_1.MergeParams(true)
], BookingsCtrl);
exports.BookingsCtrl = BookingsCtrl;
let BookingCtrl = class BookingCtrl {
    findBookingIdByUser(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookings = yield booking_1.BookingModel.find({ doctorId: request.user.id });
                for (let i = 0; i < bookings.length; ++i) {
                    bookings[i] = bookings[i].toObject();
                    if (bookings[i].doctorId) {
                        bookings[i].doctor = yield user_1.Users.findUserById(bookings[i].doctorId).then((doctor) => { var _a; return (_a = doctor) === null || _a === void 0 ? void 0 : _a.toObject(); });
                        delete bookings[i].doctor.availableTimeBlock;
                    }
                }
                return { success: true, data: bookings };
            }
            catch (error) {
                return { error };
            }
        });
    }
    findBookingById(id) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let booking = yield booking_1.Bookings.findBookingById(id);
                if (!!booking) {
                    booking = booking.toObject();
                    if ((_a = booking) === null || _a === void 0 ? void 0 : _a.doctorId) {
                        booking.doctor = yield user_1.Users.findUserById(booking.doctorId).then((doctor) => { var _a; return (_a = doctor) === null || _a === void 0 ? void 0 : _a.toObject(); });
                        delete booking.doctor.availableTimeBlock;
                    }
                    return { success: true, data: booking };
                }
                else {
                    return { error: BookingsCtrl_Erro_1.default.BOOKING_NOT_FOUND };
                }
            }
            catch (error) {
                return { error };
            }
        });
    }
    findBookingByPhoneNumber(phoneNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            return booking_1.BookingModel.findOne({ phoneNumber })
                .then((booking) => !!booking ? { data: booking } : { error: BookingsCtrl_Erro_1.default.BOOKING_NOT_FOUND })
                .catch((error) => ({ error }));
        });
    }
    createNewBooking(name, description, symptom, gender, dob, address, phoneNumber, passportNumber, healthCareId, doctorId, bookingDateTimestamp, startBlockTimeIndex, endBlockTimeIndex, attachments) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!blockTime_1.isTimeBlockIndexValid(startBlockTimeIndex) || !blockTime_1.isTimeBlockIndexValid(endBlockTimeIndex)) {
                    return {
                        error: BookingsCtrl_Erro_1.default.INVALID_BLOCK_TIME_INDEX,
                    };
                }
                else {
                    let doctor = yield user_1.Users.findUserById(doctorId);
                    if (doctor === null) {
                        return {
                            error: BookingsCtrl_Erro_1.default.DOCTOR_NOT_FOUND,
                        };
                    }
                    else {
                        doctor = doctor.toObject();
                        const UTCDay = new Date(bookingDateTimestamp).getUTCDay();
                        let isBlockTimeRangeValid = true;
                        const doctorAvailableTimeBlock = doctor.availableTimeBlock;
                        for (let timeBlockIndex = startBlockTimeIndex; timeBlockIndex <= endBlockTimeIndex; ++timeBlockIndex) {
                            if (!doctorAvailableTimeBlock[UTCDay].includes(timeBlockIndex)) {
                                isBlockTimeRangeValid = false;
                                break;
                            }
                        }
                        if (!isBlockTimeRangeValid) {
                            return {
                                error: BookingsCtrl_Erro_1.default.INVALID_BLOCK_TIME_RANGE,
                            };
                        }
                        else {
                            let isTimeRangeNotConflict = yield blockTime_1.isTimeRangeAvailable(bookingDateTimestamp, startBlockTimeIndex, endBlockTimeIndex, doctor._id.toString());
                            if (!isTimeRangeNotConflict) {
                                return {
                                    error: BookingsCtrl_Erro_1.default.TIME_IS_NOT_AVAILABLE,
                                };
                            }
                            else {
                                const meeting = yield zoom_1.zoomScheduleMeeting();
                                for (let i = 0; i < attachments.length; ++i) {
                                    yield attachment_1.Attachments.create(attachments[i]);
                                }
                                const booking = yield booking_1.BookingModel.create({
                                    name,
                                    description,
                                    symptom,
                                    gender,
                                    dob,
                                    address,
                                    phoneNumber,
                                    passportNumber,
                                    healthCareId,
                                    doctorId,
                                    bookingDateTimestamp,
                                    startBlockTimeIndex,
                                    endBlockTimeIndex,
                                    zoomMeetingId: meeting.id,
                                    attachments,
                                });
                                return { success: true, data: booking };
                            }
                        }
                    }
                }
            }
            catch (error) {
                return { error };
            }
        });
    }
    ratingBooking(id, rating) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield booking_1.BookingModel.findByIdAndUpdate(id, { rating })
                .then(() => ({ success: true }))
                .catch((error) => ({ error }));
        });
    }
    finishBooking(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield booking_1.BookingModel.findByIdAndUpdate(id, { status: 'FINISHED' })
                .then(() => ({ success: true }))
                .catch((error) => ({ error }));
        });
    }
    deleteBookingById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield booking_1.Bookings.deleteById(id)
                .then(() => ({ success: true }))
                .catch((error) => ({ error }));
        });
    }
};
__decorate([
    common_1.Get('/me'),
    common_1.UseAuth(Guards_1.AuthCheck),
    __param(0, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BookingCtrl.prototype, "findBookingIdByUser", null);
__decorate([
    common_1.Get('/:id'),
    __param(0, common_1.Required()), __param(0, common_1.PathParams('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BookingCtrl.prototype, "findBookingById", null);
__decorate([
    common_1.Get('/phone/:phoneNumber'),
    __param(0, common_1.Required()), __param(0, common_1.PathParams('phoneNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BookingCtrl.prototype, "findBookingByPhoneNumber", null);
__decorate([
    common_1.Post('/new'),
    __param(0, common_1.Required()), __param(0, common_1.BodyParams('name')),
    __param(1, common_1.Required()), __param(1, common_1.BodyParams('description')),
    __param(2, common_1.Required()), __param(2, common_1.BodyParams('symptom')),
    __param(3, common_1.Required()), __param(3, common_1.BodyParams('gender')),
    __param(4, common_1.Required()), __param(4, common_1.BodyParams('dob')),
    __param(5, common_1.Required()), __param(5, common_1.BodyParams('address')),
    __param(6, common_1.Required()), __param(6, common_1.BodyParams('phoneNumber')),
    __param(7, common_1.Required()), __param(7, common_1.BodyParams('passportNumber')),
    __param(8, common_1.Required()), __param(8, common_1.BodyParams('healthCareId')),
    __param(9, common_1.Required()), __param(9, common_1.BodyParams('doctorId')),
    __param(10, common_1.Required()), __param(10, common_1.BodyParams('bookingDateTimestamp')),
    __param(11, common_1.Required()), __param(11, common_1.BodyParams('startBlockTimeIndex')),
    __param(12, common_1.Required()), __param(12, common_1.BodyParams('endBlockTimeIndex')),
    __param(13, common_1.BodyParams('attachments')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Array, String, String, String, String, String, String, String, Number, Number, Number, Array]),
    __metadata("design:returntype", Promise)
], BookingCtrl.prototype, "createNewBooking", null);
__decorate([
    common_1.Patch('/:id/rating'),
    __param(0, common_1.Required()), __param(0, common_1.PathParams('id')),
    __param(1, common_1.Required()), __param(1, common_1.BodyParams('rating')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], BookingCtrl.prototype, "ratingBooking", null);
__decorate([
    common_1.Patch('/:id/finish'),
    common_1.UseAuth(Guards_1.AuthCheck),
    __param(0, common_1.Required()), __param(0, common_1.PathParams('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BookingCtrl.prototype, "finishBooking", null);
__decorate([
    common_1.Delete('/:id'),
    common_1.UseAuth(Guards_1.AuthCheck),
    __param(0, common_1.Required()), __param(0, common_1.PathParams('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BookingCtrl.prototype, "deleteBookingById", null);
BookingCtrl = __decorate([
    common_1.Controller('/booking'),
    common_1.MergeParams(true)
], BookingCtrl);
exports.BookingCtrl = BookingCtrl;
//# sourceMappingURL=BookingsCtrl.js.map