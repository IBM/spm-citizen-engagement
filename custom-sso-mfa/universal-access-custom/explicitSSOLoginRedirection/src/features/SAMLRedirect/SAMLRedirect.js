/* eslint-disable react/prefer-stateless-function */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { AuthenticationSelectors } from '@spm/core';
import { AppSpinner } from '@spm/core-ui';

/**
 * SamlRedirect
 */
class SAMLRedirect extends Component {
  /**
   * The AuthenticatedRoute component. See further documentation below.
   */
  render() {
    const { userAccount } = this.props;
    const query = this.props.location.search;
    const nextPage = query.match(/relayurl=([^&]*)/)[1];
    if (!userAccount) {
      return <AppSpinner />;
    }
    return (
      <Redirect
        to={{
          pathname: `${nextPage}`,
        }}
      />
    );
  }
}

SAMLRedirect.propTypes = {
  location: PropTypes.object,
  userAccount: PropTypes.object,
};
SAMLRedirect.defaultProps = {
  location: null,
  userAccount: null,
};
/**
 *
 * @param {*} state
 */
const mapStateToProps = state => ({
  userAccount: AuthenticationSelectors.getUserAccount(state),
});

/**
 * Handles the authorization of a page based on the specified user types that are passed
 * as an input prop. If the current user is authorized to access the requested page, then they
 * can access the page directly. Otherwise they will be redirected to the login page.
 *
 * @param {Array} authUserTypes The list of authentication user types. It is mandatory.
 * @param {string} title A react-intl message that will dynamically prefix the application title with the page title
 * in order to provide a meaningful page title. It is mandatory.
 *
 */
export default withRouter(connect(mapStateToProps)(SAMLRedirect));
