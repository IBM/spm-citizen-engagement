# Support for Multi-Factor authentication via 3rd party solutions.
We know that the security of a citizens information is critical to our customers. We recommend that all of our customers use the strongest security strategies available to secure their clients information. Multi-factor authentication is one such strategy that can ensure a citizens account can not be easily accessed via stolen credentials or weak passwords.

The Citizen Engagement application has been verified to work with 3rd party authentication solutions that provide multi-factor authentication flows **via the SAML protocol**. The Application can be configured to delegate the entire authentication process to a 3rd party solution, which will now provide the login screens and MFA challenges before authenticating the user with the Service Provider (IBM Social Program Management) and redirecting back to the users account in the Citizen Engagement application.

This repository provides a working example of how this can be achieved using Auth0 as an example. The same has also been verified to work with KeyCloak.

Please follow the documentation in the sub-folders for each piece of the jigsaw
 1. [Configuring the IdP](https://github.ibm.com/WH-GovSPM/spm-webapps-customssomfa/tree/master/identity-provider/Auth0)
 2. [Configuring the SP](https://github.ibm.com/WH-GovSPM/spm-webapps-customssomfa/tree/master/service-provider/WebSphere_traditional)
 3. [Configuring the Citizen Engagement App](https://github.ibm.com/WH-GovSPM/spm-webapps-customssomfa/tree/master/universal-access-custom/explicitSSOLoginRedirection)
