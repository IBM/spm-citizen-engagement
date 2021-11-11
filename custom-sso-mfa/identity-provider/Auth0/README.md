
# About this doc

It describes the set-up of Auth0 as Identity Provider in a SP-initiated SAML SSO login scenario for the HTTP Browser profile, and optionally set up MFA.

# Auth0 configuration as Identity Provider

## Prerequisites

- An Auth0 account set up with the default app

## Procedure

1. Under Authentication -> Database -> Username-Password-Authentication connection -> Settings, turn on the **Requires Username** toggle.
2. Under User Management -> Users, click on Create user, and add an user whose Username is present in the ExternalUser table in Cúram SPM.
3. Under Applications -> Applications -> Default App configure these parameters:
   1. Application Properties -> Application Type -> Single Page Application
   2. Appliaction URIs:
      1. Allowed Callback URLs: your Authorisation Consumer Service URL (for instance, https://localhost/samlsps/acs).
      2. Allowed Web Origins: the location of your CE application (for instance, https://localhost).
4. In Addons tab, enable the SAML2 WEB APP module, and click on it:
   1. In settings tab, the Application Callback URL should be already populated - if not, specify your Authorisation Consumer Service URL (for instance, https://localhost/samlsps/acs).
   2. The Settings code box shows a set of default settings - specify the ones in the file `sample_samladdon_config_twas.json` to work with Traditional Websphere Application Server as a service provider.
5. In the usage tab, download the Identity Provider Metadata xml - required to configure your service provider.

# Multi-Factor Authentication

You can configure a MFA profile for your app, for example:

1. Under Security -> Multi-factor Auth:
   1. Click on Phone Message, and turn on the toggle. By default, Auth0 provides 100 free SMSs.
   2. Back to Multi-factor Authentication, under 2 Define policies, you can select Require Multi-factor Auth =  Always, and click save.
2. Next time your user will log in, will be asked to be onboarded for MFA by providing a valid mobile number.