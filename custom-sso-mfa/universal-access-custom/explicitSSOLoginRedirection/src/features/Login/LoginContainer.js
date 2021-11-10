/*
 * Licensed Materials - Property of IBM
 *
 * Copyright IBM Corporation 2021. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 */

import { connect } from 'react-redux';
import React, { useEffect } from 'react';
import {
  ApplicationFormOwnershipActions,
  ApplicationFormOwnershipSelectors,
  ApplyForBenefitsSelectors,
  LoginActions,
  LoginSelectors,
  SystemConfigurationActions,
  SystemConfigurationSelectors,
  ApplyForBenefitsActions,
  ToasterActions,
} from '@spm/universal-access';
import { AppSpinner } from '@spm/core-ui';
import SSOAuthenticationExplicit from '../SSOAuthenticationExplicit/SSOAuthenticationExplicit';

/**
 * The LoginContainer wraps the LoginComponent, which allows the user to log in to their account.
 *
 * @param {Object} props component properties
 */
const LoginContainer = props => {
  /**
   * Executed when the component did mount and return a function to be executed on unmount
   *
   * @memberof LoginContainer
   */
  useEffect(() => {
    (async () => {
      await SSOAuthenticationExplicit.logoutBeforeJump();
      window.location.href = `${process.env.REACT_APP_SAMLSSO_EXPLICIT_URL}${
        // eslint-disable-next-line react/prop-types
        props?.location?.params?.previousPathname ?? '/account'
      }`;
    })();
    return <AppSpinner />;
  }, []);

  return <AppSpinner />;
};

/**
 * Used to subscribe to Redux store updates. This will be called any time the store is updated. Will
 * be merged into the component props.
 *
 * @param {*} state the store state
 */
const mapStateToProps = state => ({
  userInput: LoginSelectors.userInput(state),
  validationErrors: LoginSelectors.validationErrors(state),
  isFetchingPostData: LoginSelectors.isFetchingPostData(state),
  postDataError: LoginSelectors.postDataError(state),
  isAccountCreationAllowed: SystemConfigurationSelectors.getBooleanValue(
    state,
    'curam.citizenworkspace.enable.account.creation'
  ),
  isLoginBeforeSubmitMandatory: SystemConfigurationSelectors.getBooleanValue(
    state,
    'curam.citizenworkspace.intake.submit.intake.mandatory.login'
  ),
  isFetchingSystemConfiguration: SystemConfigurationSelectors.isFetchingSystemConfiguration(state),
  systemConfigurationError: SystemConfigurationSelectors.systemConfigurationError(state),
  isChangingOwnershipOfApplication: ApplicationFormOwnershipSelectors.isChangingOwnership(state),
  changeOwnershipOfApplicationError: ApplicationFormOwnershipSelectors.changeOwnershipError(state),
  applicationTypeDetails: ApplyForBenefitsSelectors.getApplicationTypeDetails(state),
  intakeApplicationTypes: ApplyForBenefitsSelectors.getSortedIntakeApplicationTypes(state),
});

/**
 * Redux action creators that will be merged into the component props.
 *
 * @export
 * @param {any} dispatch the dispatch function
 * @returns the action creators
 */
export function mapDispatchToProps(dispatch) {
  return {
    fillToaster: data => {
      ToasterActions.fillToaster(dispatch, data);
    },
    loadOnlineCategories: callback => {
      ApplyForBenefitsActions.getOnlineCategoriesAction(dispatch, callback);
    },
    setIntakeApplicationType: data => {
      ApplyForBenefitsActions.setIntakeApplicationTypeAction(dispatch, data);
    },
    setUserInput: data => {
      LoginActions.setUserInput(dispatch, data);
    },
    setValidationErrors: errors => {
      LoginActions.setValidationErrors(dispatch, errors);
    },
    loadSystemConfiguration: callback => {
      SystemConfigurationActions.getSystemPropertiesAction(dispatch, callback);
    },
    changeOwnershipOfApplication: (applicationId, callback) => {
      ApplicationFormOwnershipActions.changeOwnership(dispatch, applicationId, callback);
    },
    resetError: () => LoginActions.resetError(dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);
