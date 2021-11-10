/*
 * Licensed Materials - Property of IBM
 *
 * Copyright IBM Corporation 2018-2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 */
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Main } from '@govhhs/govhhs-design-system-react';
import {
  ApplicationHeader,
  ApplicationHeaderComponent,
  ApplicationFooter,
  ScrollToTop,
  SessionTimeout,
  ErrorBoundary,
  SkipNav,
  Toaster,
  ConnectivityHandler,
} from '@spm/universal-access-ui';
import { AuthenticationRegistry } from '@spm/core';
import SSOAuthenticationExplicit from './features/SSOAuthenticationExplicit/SSOAuthenticationExplicit';
import SSOVerifier from './features/SSOVerifier/SSOVerifier';
import routes from './routes';
import ReduxInit from './redux/ReduxInit';
import IntlInit from './intl/IntlInit';

AuthenticationRegistry.registerAuthenticationType(SSOAuthenticationExplicit);

/**
 * App component entry point.
 */
const App = () => {
  return (
    <ReduxInit>
      <IntlInit>
        <Router basename={process.env.PUBLIC_URL}>
          <ScrollToTop>
            <ErrorBoundary
              footer={<ApplicationFooter />}
              header={<ApplicationHeaderComponent hasErrorBeenCaught />}
              isHeaderBoundary
            >
              <ConnectivityHandler>
                <SSOVerifier
                  placeholder={
                    <ApplicationHeaderComponent
                      isALinkedUser={() => false}
                      isAppealsEnabled={false}
                      isEmpty
                    />
                  }
                >
                  <SkipNav />
                  <ApplicationHeader />
                  <ErrorBoundary>
                    <SessionTimeout />
                    <Toaster />
                    <Main
                      className="wds-u-bg--page wds-u-text-word-break"
                      id="maincontent"
                      pushFooter
                    >
                      {routes}
                    </Main>
                  </ErrorBoundary>
                  <ApplicationFooter />
                </SSOVerifier>
              </ConnectivityHandler>
            </ErrorBoundary>
          </ScrollToTop>
        </Router>
      </IntlInit>
    </ReduxInit>
  );
};

export default App;
