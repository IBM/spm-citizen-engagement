
# Configuring Auth0 as an identity provider (IdP)

The following steps describe how to set up Auth0 as an identity provider in a service-initiated SAML SSO login scenario for the HTTP browser profile, and optionally set up multi-factor authentication.

## Prerequisites

Set up an Auth0 account with the default application.

## Procedure

1. Click **Authentication -> Database -> Username-Password-Authentication connection -> Settings**, and enable the **Requires Username** option.
2. Click **User Management -> Users -> Create user**, and add a user whose username is present in the ExternalUser table in Social Program Management.
3. Click **Applications -> Applications -> Default App**, and configure the following parameters:
   1. Click **Application Properties -> Application Type -> Single Page Application**.
   2. Under Application URIs, configure the following URLs:
      1. Allowed callback URLs: enter your authorization consumer service URL, for example, [https://localhost/samlsps/acs](https://localhost/samlsps/acs).
      2. Allowed web origins: enter the location of your Universal Access Responsive Web Application, for example, [https://localhost](https://localhost).
4. In the **Addons** tab, enable the SAML2 WEB APP module, and then click the module:
   1. In the **Settings** tab, the application callback URL should already be populated. If it is not populated, specify your authorization consumer service URL, for example, [https://localhost/samlsps/acs](https://localhost/samlsps/acs).
   2. The **Settings** code box shows a set of default settings. Specify the settings in the `sample_samladdon_config_twas.json` file to work with traditional WebSphere Application Server as a service provider.
5. In the **Usage** tab, download the identity provider metadata XML file, which is required to configure your service provider.

# Configure a multi-factor authentication profile

You can configure a multi-factor authentication profile for your application, as shown in the following example.

1. Click **Security -> Multi-factor Authentication**:
   1. Click **Phone Message**, and enable messages. By default, Auth0 provides 100 free SMS messages.
   2. Go back to **Multi-factor Authentication**. Under **2 Define policies**, select **Require Multi-factor Auth -> Always**, and click **Save**.
2. The next time that a user logs on, the user will be asked to provide a valid mobile number so that they can be onboarded for multi-factor authentication.
