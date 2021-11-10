/*
 * Licensed Materials - Property of IBM
 *
 * Copyright IBM Corporation 2021. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 */

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Authentication,
  SystemConfigurationActions,
  SSOVerifierActions,
  SSOVerifierSelectors,
  CoreReduxStore,
  AuthenticationActions,
  ProfileActions,
  UserActions,
} from '@spm/core';
import { AppSpinner } from '@spm/core-ui';

/**
 * Logs the user in as the 'publiccitizen' account.
 *
 * If we are not authenticated at all we need to log in as PublicCitizen so that we can access the system configuration
 *
 * @param {function} dispatch function that dispatches values to Redux
 * @returns {Promise} Promise object represents if the login as public citizen completed
 */
function loginAsPublicCitizen(dispatch) {
  return new Promise(resolve => {
    /**
     * Loads the system configuration if the previous call was successful.
     * @param {success} boolean
     */
    const callback = success => {
      if (success) {
        SystemConfigurationActions.getSystemPropertiesAction(dispatch, () => {
          resolve();
        });
      }
    };
    if (Authentication.userTypeIs([Authentication.USER_TYPES.NO_USER_TYPE])) {
      Authentication.loginAsPublicCitizen(callback);
    } else {
      SystemConfigurationActions.getSystemPropertiesAction(dispatch, () => {
        resolve();
      });
    }
  });
}

/**
 * Callback function executed after getting curam user account.
 *
 * @param {any} success Indicates if curam account successfully retrieved or not.
 * @param {any} response The HTTP response.
 * @param {function} dispatch function that dispatches values to Redux
 *
 */
const populateUserAccountInformation = async (success, response, dispatch) => {
  if (success) {
    sessionStorage.setItem('username', null);
    sessionStorage.setItem('user_account', JSON.stringify(response));
    CoreReduxStore.internalStore.dispatch(AuthenticationActions.setLoggedInUser(null));
    CoreReduxStore.internalStore.dispatch(AuthenticationActions.setUserAccount(response));
    if (
      Authentication.userTypeIs([
        Authentication.USER_TYPES.STANDARD,
        Authentication.USER_TYPES.LINKED,
      ])
    ) {
      ProfileActions.getUserProfile(CoreReduxStore.internalStore.dispatch);
      UserActions.fetchUser(CoreReduxStore.internalStore.dispatch);
    }
  } else {
    Authentication.clearSessionStorage();
    Authentication.clearCookiesFromStorage();
    await loginAsPublicCitizen(dispatch);
  }
};

/**
 * Executes the precheck for Single-Sign-On. The SSO precheck establishes the current logged-in status for the user against the IdP.
 *
 * The precheck is required as a user may already be authenticated with the IdP prior to navigating to Universal Access. When they arrive, we need to determine their authentication status and make initial communication with the application server/IdP (for call interception)
 * If the user is already authenticated with the IdP, then the user can also be logged-in to Universal Access (by retrieving their user account and loading their user profile).
 * If the user is not already authenticated with the IdP, then the user can continue to use Universal Access as normal as a public/generated user. The user can decide at a later point to login which will use the login function configured for their registered Authentication Method.
 *
 * In situations where Single-Sign-On is not configured, the user is found to be unauthenticated with the IdP, or any error occurs during the precheck, the user will be logged-in to to Universal Access application as a public citizen
 *
 * @param {function} dispatch function that dispatches values to Redux
 */
async function executeSSOPreCheck(dispatch) {
  // set flag to indicate we are verifying against the SSO
  SSOVerifierActions.setSSOVerifier(dispatch, true);

  const RESOURCE_NAMES = {
    userAccountLogin: 'v1/ua/user_account_login',
  };
  const userAccountLoginGetResult = await Authentication.getCall(
    Authentication.getApiUrl(RESOURCE_NAMES.userAccountLogin),
    {}
  );
  if (userAccountLoginGetResult.success) {
    populateUserAccountInformation(
      userAccountLoginGetResult.success,
      userAccountLoginGetResult.response,
      dispatch
    );
  } else {
    populateUserAccountInformation(false, userAccountLoginGetResult.response, dispatch);
  }

  // regardless of precheck, we set a flag in Redux not to re-execute on render again
  SSOVerifierActions.setSSOVerifier(dispatch, false);
}

/**
 * This component will be responsible for verifying if the user was logged in an
 * SSO environment and try to use that in order to have it already logged in
 * the application
 *
 * @param {Object} children children that the component will render
 * @param {Object} placeholder place holder that the object will render when it is loading
 */
const SSOVerifier = ({ children, placeholder = <AppSpinner block small /> }) => {
  const dispatch = useDispatch();
  const isVerifyingSSO = useSelector(state => SSOVerifierSelectors.ssoVerifier(state));

  useEffect(() => {
    executeSSOPreCheck(dispatch);
  }, [dispatch]);

  useEffect(() => {
    if (isVerifyingSSO) {
      executeSSOPreCheck(dispatch);
    }
  }, [dispatch, isVerifyingSSO]);

  return isVerifyingSSO ? placeholder : children;
};

export default SSOVerifier;
