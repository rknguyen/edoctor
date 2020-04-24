import {
  Controller,
  Get,
  MergeParams,
  Post,
  Required,
  PathParams,
  BodyParams,
  Delete,
  Patch,
  UseAuth,
  Req,
} from '@tsed/common';
import { Users, IUserModel, IUserQuery, UserModel } from '../../models/user';
import Error from './UsersCtrl.Erro';
import { AuthCheck } from '../../middlewares/Guards';
import { Groups } from '../../models/group';

@Controller('/users')
@MergeParams(true)
export class UsersCtrl {
  @Get('/')
  async getUsers() {
    try {
      const users = await Users.getAllUsers();
      for (let i = 0; i < users.length; ++i) {
        users[i] = users[i].toObject();
        if (users[i].groupId) {
          (users[i] as any).group = await Groups.findGroupById(users[i].groupId);
          delete users[i].password;
        }
      }
      return { success: true, data: users };
    } catch (error) {
      return { error };
    }
  }
}

@Controller('/user')
@MergeParams(true)
export class UserCtrl {
  @Get('/me')
  @UseAuth(AuthCheck)
  async findUserByMe(@Req() req: any) {
    try {
      const user: IUserModel | null = await Users.findUserById(req.user._id);
      if (!!user) {
        if (user.groupId) {
          (user as any).group = await Groups.findGroupById(user.groupId);
        }
        delete user.password;
        return { success: true, data: user };
      } else {
        return { error: Error.USER_NOT_FOUND };
      }
    } catch (error) {
      return { error };
    }
  }

  @Get('/:id')
  async findUserById(@Req() req: any, @Required() @PathParams('id') userId: string) {
    try {
      let user: IUserModel | null = await Users.findUserById(userId);
      if (!!user) {
        user = user.toObject() as IUserModel;
        if (user.groupId) {
          (user as any).group = await Groups.findGroupById(user.groupId);
        }
        delete user.password;
        return { success: true, data: user };
      } else {
        return { error: Error.USER_NOT_FOUND };
      }
    } catch (error) {
      return { error };
    }
  }

  @Post('/new')
  @UseAuth(AuthCheck)
  async createNewUser(
    @Required() @BodyParams('username') username: string,
    @Required() @BodyParams('password') password: string,
    @Required() @BodyParams('fullName') fullName: string,
    @Required() @BodyParams('phoneNumber') phoneNumber: string,
    @Required() @BodyParams('email') email: string,
    @Required() @BodyParams('passportNumber') passportNumber: string,
    @Required() @BodyParams('groupId') groupId: string
  ) {
    try {
      const group = await Groups.findGroupById(groupId);
      if (group === null) {
        return {
          error: Error.INVALID_GROUP_ID,
        };
      } else {
        const user = await UserModel.create({
          username,
          password,
          fullName,
          phoneNumber,
          email,
          passportNumber,
          groupId,
        });
        return { success: true, data: user };
      }
    } catch (error) {
      return { error };
    }
  }

  @Patch('/me/available-time')
  @UseAuth(AuthCheck)
  async updateUserAvailableTime(
    @Req() request: any,
    @Required() @BodyParams('availableTimeBlock') availableTimeBlock: number[][]
  ) {
    try {
      const user = await UserModel.findByIdAndUpdate(request.user.id, {
        availableTimeBlock,
      });
      return { success: true, data: user };
    } catch (error) {
      return { error };
    }
  }

  @Patch('/me/information')
  @UseAuth(AuthCheck)
  async updateUserInformation(
    @Req() request: any,
    @Required() @BodyParams('fullName') fullName: string,
    @Required() @BodyParams('phoneNumber') phoneNumber: string,
    @Required() @BodyParams('email') email: string,
    @Required() @BodyParams('passportNumber') passportNumber: string,
    @Required() @BodyParams('groupId') groupId: string
  ) {
    try {
      const user = await UserModel.findByIdAndUpdate(request.user.id, {
        fullName,
        phoneNumber,
        email,
        passportNumber,
        groupId,
      });
      return { success: true, data: user };
    } catch (error) {
      return { error };
    }
  }

  @Patch('/me/password')
  @UseAuth(AuthCheck)
  async updateUserPassword(@Req() request: any, @Required() @BodyParams('password') password: string) {
    return await Users.updatePasswordById(request.user.id, password)
      .then(() => ({ success: true }))
      .catch((error) => ({ error }));
  }

  @Patch('/:id/password')
  @UseAuth(AuthCheck)
  async updateUserPasswordById(
    @Req() request: any,
    @Required() @PathParams('id') userId: string,
    @Required() @BodyParams('password') password: string
  ) {
    return await Users.updatePasswordById(userId, password)
      .then(() => ({ success: true }))
      .catch((error) => ({ error }));
  }

  @Delete('/:id')
  @UseAuth(AuthCheck)
  async deleteUserById(@Req() request: any, @Required() @PathParams('id') userId: string) {
    return await Users.deleteById(userId)
      .then(() => ({ success: true }))
      .catch((error) => ({ error }));
  }
}
