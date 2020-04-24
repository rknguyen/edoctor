import { verifyJWT } from './jwt';
import { Users, IUserModel } from '../models/user';

/**
 * Check if request is authenticated or not
 * If authenticated, link user info into request.user
 * @param request : request from user
 */
export const isAuthenticated = async (request: any): Promise<boolean> => {
  const signed_token = request.header('Authorization');
  if (!signed_token) return false;
  try {
    const credentials = verifyJWT(signed_token);
    if (!!credentials.id) {
      const user: IUserModel | null = await Users.findUserById(credentials.id);
      if (!!user) {
        request.user = user;
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};
