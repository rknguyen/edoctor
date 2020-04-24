"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const booking_1 = require("../models/booking");
const MINUTES_PER_BLOCK = 15;
const BLOCK_PER_HOUR = 60 / MINUTES_PER_BLOCK;
const MINTUTE_LIST = [0, 15, 30, 45];
const ONE_DAYS_TIMESTAMP = 60 * 60 * 24 * 1000;
function isTimeBlockIndexValid(blockTimeIndex) {
    return toBlockTimeId(0, 0) <= blockTimeIndex && blockTimeIndex <= toBlockTimeId(23, 45);
}
exports.isTimeBlockIndexValid = isTimeBlockIndexValid;
function toBlockTimeId(hours, minutes) {
    return hours * BLOCK_PER_HOUR + MINTUTE_LIST.indexOf(minutes);
}
exports.toBlockTimeId = toBlockTimeId;
function toRealTime(blockTimeId) {
    return [Math.floor(blockTimeId / BLOCK_PER_HOUR), MINTUTE_LIST[Math.max(3, blockTimeId % BLOCK_PER_HOUR)]];
}
exports.toRealTime = toRealTime;
function isTimeRangeAvailable(bookingDateTimestamp, startBlockTime, endBlockTime, doctorId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let doctorCurrentBooking = yield booking_1.BookingModel.find({
                doctorId,
                bookingDateTimestamp: { $gte: bookingDateTimestamp, $lt: bookingDateTimestamp + ONE_DAYS_TIMESTAMP },
                startBlockTimeIndex: { $lte: endBlockTime },
                endBlockTimeIndex: { $gte: startBlockTime },
            });
            return doctorCurrentBooking.length === 0;
        }
        catch (error) {
            return false;
        }
    });
}
exports.isTimeRangeAvailable = isTimeRangeAvailable;
//# sourceMappingURL=blockTime.js.map