# Customizing Universal Access for explicit single sign-on logon redirection

Copy the provided src/features in your Universal Access Responsive Web Application project. The remaining files under /src are examples that show how to set up the features. To get started, compare the /src files with the default files that are provided in the @spm/universal-access-starter-pack.

The customizations have been tested in the following releases:

UA release | status
--- | ---
2.6.1 | :white_check_mark:
3.0.6 | :white_check_mark:
4.0.1 | :white_check_mark:

The .env includes the ``REACT_APP_SAMLSSO_EXPLICIT_URL`` variable. Set the variable to the location of the REST service for the SP-initiated SAML-SSO flow. The target parameter contains the redirection location for the identity provider after a successful login. The ``relayurl`` parameter in the samlredirect URL determines the page in Universal Access to display after a successful login. Be default, the src/features/Login/LoginContainer.js file sets the page to the account dashboard.

The following example shows how the ``REACT_APP_SAMLSSO_EXPLICIT_URL`` variable might be configured:

```
REACT_APP_SAMLSSO_EXPLICIT_URL=https://localhost/Rest?Target=https://localhost/universal/samlredirect?relayurl=
```

For Cúram releases earlier than 7.0.9.0 iFix6, and as a good practice, set the REACT_APP_LOGOUT_END_POINT=/logout.jsp variable. For 7.0.9.0 iFix6 and later releases, set the REACT_APP_LOGOUT_END_POINT=/logout variable.

## Variable configuration with IBM Security Verify access as an identity provider

Configure the ``REACT_APP_SAMLSSO_EXPLICIT_URL`` variable as shown in the following examples.

### IDP-initiated

```
REACT_APP_SAMLSSO_EXPLICIT_URL=https://localhost:12443/isam/sps/saml20idp/saml20/logininitial?RequestBinding=HTTPPost&PartnerId=https://localhost/samlsps/acs&NameIdFormat=Email&Target=https://localhost/idp/samlredirect?relayurl=
```

### SP-initiated

```
REACT_APP_SAMLSSO_EXPLICIT_URL=/Rest?Target=https://localhost/sp/samlredirect?relayurl=
```
