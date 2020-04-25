import {
  Req,
  Controller,
  UseAuth,
  MergeParams,
  Get,
  Required,
  Patch,
  PathParams,
  Post,
  BodyParams,
  Delete,
} from '@tsed/common';
import { AuthCheck } from '../../middlewares/Guards';
import Error from './BookingsCtrl.Erro';
import { IBookingModel, Bookings, BookingModel } from '../../models/booking';
import { Users, IUserModel } from '../../models/user';
import { isTimeBlockIndexValid, isTimeRangeAvailable } from '../../utils/blockTime';
import { zoomScheduleMeeting } from '../../utils/zoom';
import { Attachments } from '../../models/attachment';

@Controller('/bookings')
@UseAuth(AuthCheck)
@MergeParams(true)
export class BookingsCtrl {
  @Get('/')
  async getAllBookings() {
    try {
      const bookings = await Bookings.getAllBookings();
      for (let i = 0; i < bookings.length; ++i) {
        bookings[i] = bookings[i].toObject();
        if (bookings[i].doctorId) {
          (bookings[i] as any).doctor = await Users.findUserById(bookings[i].doctorId).then((doctor) =>
            doctor?.toObject()
          );
          delete (bookings[i] as any).doctor.availableTimeBlock;
        }
      }
      return { success: true, data: bookings };
    } catch (error) {
      return { error };
    }
  }
}

@Controller('/booking')
@MergeParams(true)
export class BookingCtrl {
  @Get('/me')
  @UseAuth(AuthCheck)
  async findBookingIdByUser(@Req() request: any) {
    try {
      const bookings = await BookingModel.find({ doctorId: request.user.id });
      for (let i = 0; i < bookings.length; ++i) {
        bookings[i] = bookings[i].toObject();
        if (bookings[i].doctorId) {
          (bookings[i] as any).doctor = await Users.findUserById(bookings[i].doctorId).then((doctor) =>
            doctor?.toObject()
          );
          delete (bookings[i] as any).doctor.availableTimeBlock;
        }
      }
      return { success: true, data: bookings };
    } catch (error) {
      return { error };
    }
  }

  @Get('/:id')
  async findBookingById(@Required() @PathParams('id') id: string) {
    try {
      let booking: any = await Bookings.findBookingById(id);
      if (!!booking) {
        booking = booking.toObject() as IUserModel;
        if (booking?.doctorId) {
          (booking as any).doctor = await Users.findUserById(booking.doctorId).then((doctor) =>
            doctor?.toObject()
          );
          delete (booking as any).doctor.availableTimeBlock;
        }
        return { success: true, data: booking };
      } else {
        return { error: Error.BOOKING_NOT_FOUND };
      }
    } catch (error) {
      return { error };
    }
  }

  @Get('/phone/:phoneNumber')
  async findBookingByPhoneNumber(@Required() @PathParams('phoneNumber') phoneNumber: string) {
    return BookingModel.find({ phoneNumber })
      .then((booking: IBookingModel[] | null) =>
        !!booking ? { data: booking } : { error: Error.BOOKING_NOT_FOUND }
      )
      .catch((error) => ({ error }));
  }

  @Post('/new')
  async createNewBooking(
    @Required() @BodyParams('name') name: string,
    @Required() @BodyParams('description') description: string,
    @Required() @BodyParams('symptom') symptom: string[],
    @Required() @BodyParams('gender') gender: string,
    @Required() @BodyParams('dob') dob: string,
    @Required() @BodyParams('address') address: string,
    @Required() @BodyParams('phoneNumber') phoneNumber: string,
    @Required() @BodyParams('passportNumber') passportNumber: string,
    @Required() @BodyParams('healthCareId') healthCareId: string,
    @Required() @BodyParams('doctorId') doctorId: string,
    @Required() @BodyParams('bookingDateTimestamp') bookingDateTimestamp: number,
    @Required() @BodyParams('startBlockTimeIndex') startBlockTimeIndex: number,
    @Required() @BodyParams('endBlockTimeIndex') endBlockTimeIndex: number,
    @BodyParams('attachments') attachments: string[]
  ) {
    try {
      if (!isTimeBlockIndexValid(startBlockTimeIndex) || !isTimeBlockIndexValid(endBlockTimeIndex)) {
        return {
          error: Error.INVALID_BLOCK_TIME_INDEX,
        };
      } else {
        let doctor: IUserModel | null = await Users.findUserById(doctorId);
        if (doctor === null) {
          return {
            error: Error.DOCTOR_NOT_FOUND,
          };
        } else {
          doctor = doctor.toObject() as IUserModel;

          const UTCDay = new Date(bookingDateTimestamp).getUTCDay();

          let isBlockTimeRangeValid = true;
          const doctorAvailableTimeBlock = doctor.availableTimeBlock;
          for (
            let timeBlockIndex = startBlockTimeIndex;
            timeBlockIndex <= endBlockTimeIndex;
            ++timeBlockIndex
          ) {
            if (!doctorAvailableTimeBlock[UTCDay].includes(timeBlockIndex)) {
              isBlockTimeRangeValid = false;
              break;
            }
          }

          if (!isBlockTimeRangeValid) {
            return {
              error: Error.INVALID_BLOCK_TIME_RANGE,
            };
          } else {
            let isTimeRangeNotConflict = await isTimeRangeAvailable(
              bookingDateTimestamp,
              startBlockTimeIndex,
              endBlockTimeIndex,
              doctor._id.toString()
            );
            if (!isTimeRangeNotConflict) {
              return {
                error: Error.TIME_IS_NOT_AVAILABLE,
              };
            } else {
              const meeting = await zoomScheduleMeeting();

              for (let i = 0; i < attachments.length; ++i) {
                await Attachments.create(attachments[i]);
              }

              const booking = await BookingModel.create({
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
    } catch (error) {
      return { error };
    }
  }

  @Patch('/:id/rating')
  async ratingBooking(
    @Required() @PathParams('id') id: string,
    @Required() @BodyParams('rating') rating: number
  ) {
    return await BookingModel.findByIdAndUpdate(id, { rating })
      .then(() => ({ success: true }))
      .catch((error) => ({ error }));
  }

  @Patch('/:id/finish')
  @UseAuth(AuthCheck)
  async finishBooking(@Required() @PathParams('id') id: string) {
    return await BookingModel.findByIdAndUpdate(id, { status: 'FINISHED' })
      .then(() => ({ success: true }))
      .catch((error) => ({ error }));
  }

  @Delete('/:id')
  @UseAuth(AuthCheck)
  async deleteBookingById(@Required() @PathParams('id') id: string) {
    return await Bookings.deleteById(id)
      .then(() => ({ success: true }))
      .catch((error) => ({ error }));
  }
}
