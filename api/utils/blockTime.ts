import { BookingModel, IBookingModel } from '../models/booking';

const MINUTES_PER_BLOCK = 15;
const BLOCK_PER_HOUR = 60 / MINUTES_PER_BLOCK;
const MINTUTE_LIST = [0, 15, 30, 45];

const ONE_DAYS_TIMESTAMP = 60 * 60 * 24 * 1000;

export function isTimeBlockIndexValid(blockTimeIndex: number): boolean {
  return toBlockTimeId(0, 0) <= blockTimeIndex && blockTimeIndex <= toBlockTimeId(23, 45);
}

export function toBlockTimeId(hours: number, minutes: number): number {
  return hours * BLOCK_PER_HOUR + MINTUTE_LIST.indexOf(minutes);
}

export function toRealTime(blockTimeId: number): [number, number] {
  return [Math.floor(blockTimeId / BLOCK_PER_HOUR), MINTUTE_LIST[Math.max(3, blockTimeId % BLOCK_PER_HOUR)]];
}

export async function isTimeRangeAvailable(
  bookingDateTimestamp: number,
  startBlockTime: number,
  endBlockTime: number,
  doctorId: string
): Promise<boolean> {
  try {
    let doctorCurrentBooking = await BookingModel.find({
      doctorId,
      bookingDateTimestamp: { $gte: bookingDateTimestamp, $lt: bookingDateTimestamp + ONE_DAYS_TIMESTAMP },
      startBlockTimeIndex: { $lte: endBlockTime },
      endBlockTimeIndex: { $gte: startBlockTime },
    });
    return doctorCurrentBooking.length === 0;
  } catch (error) {
    return false;
  }
}
