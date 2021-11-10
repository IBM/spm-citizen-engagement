/*
 * Licensed Materials - Property of IBM
 *
 * Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 */

import React from 'react';
import { Switch } from 'react-router-dom';
import { Routes as UARoutes, TitledRoute, AppSpinner, LoadingPage } from '@spm/universal-access-ui';
import Loadable from 'react-loadable';
import routeTitles from './routesMessages';
import paths from './paths';

/*  This routes.jsx file can be customized to add new components or
    Redirect the existing components to new routes:

   Sample:
     <Switch>
       <Route path="/ourPayments" component={OurPayments} />
       <Redirect from="/payments" to="/ourPayments" />
       <UARoutes />
     </Switch>
*/

/**
 * Default loading component to display while loading other components.
 */
const loadingComponent = () => <AppSpinner />;

const SAMLRedirect = Loadable({
  loader: () =>
    import(/* webpackChunkName: "SAMLRedirect" */ './features/SAMLRedirect/SAMLRedirect'),
  loading: LoadingPage,
});

const Login = Loadable({
  loader: () => import(/* webpackChunkName: "Login" */ './features/Login'),
  loading: LoadingPage,
});

const SampleApplication = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: "SampleApplication" */ './features/sampleApplication/SampleApplicationComponent'
    ),
  loading: loadingComponent,
});
const SampleApplicationForm = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: "SampleApplicationForm" */ './features/sampleApplication/form/SampleApplicationFormComponent'
    ),
  loading: loadingComponent,
});
const SampleApplicationOverview = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: "SampleApplicationOverview" */ './features/sampleApplication/overview/SampleApplicationOverviewComponent'
    ),
  loading: loadingComponent,
});
const SampleApplicationConfirmation = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: "SampleApplicationConfirmation" */ './features/sampleApplication/confirmation/SampleApplicationConfirmation'
    ),
  loading: loadingComponent,
});

export default (
  <>
    <Switch>
      <TitledRoute
        component={SAMLRedirect}
        exact
        path={paths.SAML_REDIRECT}
        title={routeTitles.samlRedirect}
      />
      <TitledRoute component={Login} exact path={paths.LOGIN} title={routeTitles.login} />
      {/* Sample Routes - Example features. Not intended to run in production. */}
      <TitledRoute
        component={SampleApplicationForm}
        exact
        path={`${paths.SAMPLE_APPLICATION.FORM}/:formId`}
        title={routeTitles.sampleApplicationForm}
      />
      <TitledRoute
        component={SampleApplicationConfirmation}
        exact
        path={`${paths.SAMPLE_APPLICATION.CONFIRMATION}/:formId`}
        title={routeTitles.sampleApplicationConfirmation}
      />
      <TitledRoute
        component={SampleApplicationOverview}
        exact
        path={paths.SAMPLE_APPLICATION.OVERVIEW}
        title={routeTitles.sampleApplicationOverview}
      />
      <TitledRoute
        component={SampleApplication}
        exact
        path={paths.SAMPLE_APPLICATION.ROOT}
        title={routeTitles.sampleApplication}
      />

      {/* UA Routes */}
      <UARoutes />
    </Switch>
  </>
);
