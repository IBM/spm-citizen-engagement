# Support for multi-factor authentication through third-party solutions

The security of a citizen's information is critical to customers. We recommend that all customers use the strongest security strategies available to secure their clients' information. Multi-factor authentication is one such strategy that can ensure that a citizen's account cannot be easily accessed through stolen credentials or weak passwords.

The Universal Access Responsive Web Application has been verified to work with third-party authentication solutions that provide multi-factor authentication flows **through the SAML protocol**. You can configure the application to delegate the entire authentication process to a third-party solution. A third-party solution can provide the login screens and multi-factor authentication challenges before authenticating the user with the service provider (IBM Social Program Management) and then redirecting back to the user's account in the Universal Access application.

The following steps provide a working example of an implementation of multi-factor authentication through a third-party solution by using Auth0. A similar implementation has also been verified to work with KeyCloak.

 1. [Configuring an identity provider (IdP)](./identity-provider/Auth0/README.md)
 2. [Configuring a service provider (SP)](./service-provider/WebSphere_traditional/README.md)
 3. [Customizing Universal Access](./universal-access-custom/explicitSSOLoginRedirection/README.md)

You can also view the example in the [Gihub open source repository](https://github.com/IBM/spm-citizen-engagement/tree/main/custom-sso-mfa).
