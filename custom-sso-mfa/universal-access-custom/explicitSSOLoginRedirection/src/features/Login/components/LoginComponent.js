/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/no-unused-prop-types */
/*
 * Licensed Materials - Property of IBM
 *
 * Copyright IBM Corporation 2021. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 */

import { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

/**
 * The Login component allows the user to log in to their account.
 *
 * @export
 * @class LoginComponent
 * @extends {Component}
 */
export class LoginComponent extends Component {}

LoginComponent.propTypes = {
  applicationTypeDetails: PropTypes.object,
  changeOwnershipOfApplication: PropTypes.func.isRequired,
  changeOwnershipOfApplicationError: PropTypes.object,
  fillToaster: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  intakeApplicationTypes: PropTypes.array.isRequired,
  intl: PropTypes.object.isRequired,
  isAccountCreationAllowed: PropTypes.bool,
  isChangingOwnershipOfApplication: PropTypes.bool,
  isFetchingSystemConfiguration: PropTypes.bool,
  isLoginBeforeSubmitMandatory: PropTypes.bool,
  loadOnlineCategories: PropTypes.func.isRequired,
  loadSystemConfiguration: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  postDataError: PropTypes.object,
  resetError: PropTypes.func.isRequired,
  setIntakeApplicationType: PropTypes.func.isRequired,
  setValidationErrors: PropTypes.func.isRequired,
  systemConfigurationError: PropTypes.object,
  validationErrors: PropTypes.object,
};

LoginComponent.defaultProps = {
  applicationTypeDetails: null,
  changeOwnershipOfApplicationError: null,
  isAccountCreationAllowed: false,
  isChangingOwnershipOfApplication: false,
  isFetchingSystemConfiguration: false,
  isLoginBeforeSubmitMandatory: true,
  postDataError: null,
  systemConfigurationError: null,
  validationErrors: {},
};

export default withRouter(injectIntl(LoginComponent));
