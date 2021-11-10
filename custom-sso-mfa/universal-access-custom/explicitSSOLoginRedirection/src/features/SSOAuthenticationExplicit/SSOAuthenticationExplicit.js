/*
 * Licensed Materials - Property of IBM
 *
 * Copyright IBM Corporation 2021. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 */

import {
  Authentication,
  AuthenticationActions,
  AuthenticationTypes,
  CoreReduxStore,
  SSOVerifierActions,
  EnvUtils,
} from '@spm/core';

/** Component that will be used in order to login using SSO IDP Authentication */
export default class SSOAuthenticationExplicit {
  static login = async input => {
    AuthenticationTypes.SSOSPAuthentication.login(input);
  };

  /**
   * Logs the current user out.
   * This kills the server session associated with the current window, as well
   * as clearing the sessionStorage for the current window.
   *
   * @param {function} callback a function that will be invoked on completion.
   * The callback function will be passed a boolean indicating success and an
   * object representing the response.
   *
   * @static
   * @memberof Authentication
   */
  static logout = async (callback = () => {}, reportLogoutError = true) => {
    if (
      !Authentication.userTypeIs([
        Authentication.USER_TYPES.STANDARD,
        Authentication.USER_TYPES.LINKED,
      ])
    ) {
      const logoutUrl = `${EnvUtils.getEnvironmentProperty(
        'REACT_APP_REST_URL',
        '/Rest'
      )}${EnvUtils.getEnvironmentProperty('REACT_APP_LOGOUT_END_POINT', '/logout.jsp')}`;
      const data = {};
      Authentication.clearSessionStorage();
      CoreReduxStore.internalStore.dispatch(AuthenticationActions.logout());
      const logoutResult = await Authentication.postCall(logoutUrl, data);
      if (logoutResult.success) {
        Authentication.clearCookiesFromStorage();
      }
    } else {
      Authentication.clearSessionStorage();
      Authentication.clearCookiesFromStorage();
      CoreReduxStore.internalStore.dispatch(AuthenticationActions.logout());
      const logoutUrl = Authentication.getIDPSSOLogoutUrl();
      const getIDPSSOLogoutUrlResponse = await Authentication.getCall(logoutUrl);
      if (getIDPSSOLogoutUrlResponse.success) {
        // clear the cookies
        Authentication.clearCookiesFromStorage();
      } else if (!getIDPSSOLogoutUrlResponse.success && reportLogoutError) {
        throw new Error(getIDPSSOLogoutUrlResponse.response);
      }
    }
    if (callback) {
      callback();
    }
  };

  /**
   * Logs the current user out before jumping out (clicking )
   *
   * @param {function} callback a function that will be invoked on completion.
   * The callback function will be passed a boolean indicating success and an
   * object representing the response.
   *
   * @static
   * @memberof SSOAuthenticationExplicit
   */
  static logoutBeforeJump = async (callback, reportLogoutError) => {
    const logoutUrl = `${EnvUtils.getEnvironmentProperty(
      'REACT_APP_REST_URL',
      '/Rest'
    )}${EnvUtils.getEnvironmentProperty('REACT_APP_LOGOUT_END_POINT', '/logout')}`;
    const data = {};

    Authentication.clearSessionStorage();
    CoreReduxStore.internalStore.dispatch(AuthenticationActions.logout());
    const logoutResult = await Authentication.postCall(logoutUrl, data);
    if (logoutResult.success) {
      Authentication.clearCookiesFromStorage();
      SSOVerifierActions.setSSOVerifier(CoreReduxStore.internalStore.dispatch, false);
    } else if (!logoutResult.success && reportLogoutError) {
      throw new Error(logoutResult.response);
    }
    if (callback) {
      callback();
    }
  };
}
