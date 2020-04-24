import { Controller, MergeParams, Post, Required, BodyParams, UseAuth } from '@tsed/common';
import { Users, IUserModel, UserModel } from '../../models/user';
import Error from './AuthCtrl.Erro';
import { signJWT } from '../../utils/jwt';
import { AuthCheck } from '../../middlewares/Guards';

@Controller('/auth')
@UseAuth(AuthCheck, { guest: true })
@MergeParams(true)
export class AuthCtrl {
  @Post('/sign-in')
  async signIn(
    @Required() @BodyParams('username') username: string,
    @Required() @BodyParams('password') password: string
  ) {
    try {
      const user = await UserModel.findOne({ username, password });
      if (user === null) {
        return { error: Error.INVALID_CREDENTIALS };
      } else {
        return signJWT(user._id.toString());
      }
    } catch (error) {
      return { error };
    }
  }
}
