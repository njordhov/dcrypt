import {
  UserSession,
  AppConfig,
} from 'blockstack';

const appConfig = new AppConfig()
export const userSession = new UserSession({ appConfig: appConfig })
