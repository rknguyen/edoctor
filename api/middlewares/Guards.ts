import { EndpointInfo, IMiddleware, Middleware, Req } from '@tsed/common';
import { Forbidden, Unauthorized } from 'ts-httpexceptions';
import { isAuthenticated } from '../utils/isAuthenticated';

@Middleware()
export class AuthCheck implements IMiddleware {
  public async use(@Req() request: Express.Request, @EndpointInfo() endpoint: EndpointInfo) {
    const authMeta = endpoint.get(AuthCheck) || {};
    const signedIn = await isAuthenticated(request);

    if (!authMeta.guest && !signedIn) {
      throw new Unauthorized('Unauthorized');
    }

    if (authMeta.guest && signedIn) {
      throw new Forbidden('Forbidden');
    }
  }
}
