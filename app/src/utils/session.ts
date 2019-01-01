import { SessionAPIs, SessionResource } from '@/resources/session'
import { Resource } from '@/resources/Resource'

export class SessionUtil {
  public static token: string = '';

  public static get sessionStarted() {
    return !!SessionUtil.token;
  }

  public static async startSession() {
    const {token} = await SessionResource.request(SessionAPIs.START);
    SessionUtil.token = token;
    Resource.setAuthorizationToken(token)
  }
}
