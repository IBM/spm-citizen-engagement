# Universal Access customizations for explicit Single Sign-On login redirection

Please copy the provided src/features in your CE project. The rest of the files under /src are just examples on how to wire them up: compare them with the default files provided in @spm/universal-access-starter-pack to get started.

The customizations have been tested in below releases:

UA release | status
--- | --- 
2.6.1 | :white_check_mark:
3.0.6 | :white_check_mark:
4.0.1 | :white_check_mark:

The .env comes with the variable REACT_APP_SAMLSSO_EXPLICIT_URL. Set it to the location of the Rest service for SP-initiated SAML-SSO flow. The Target parameter contains the redirection from the identity provider after a successful login. The relayurl parameter in the samlredirect URL determines the page in CE to display after a successful login, by default src/features/Login/LoginContainer.js will set it to the account dashboard.

For instance: 

```
REACT_APP_SAMLSSO_EXPLICIT_URL=https://localhost/Rest?Target=https://localhost/universal/samlredirect?relayurl=
```

Please note for Curam SPM releases earlier than 7.0.9.0 iFix6, and as a good practice, please set the variable REACT_APP_LOGOUT_END_POINT=/logout.jsp or REACT_APP_LOGOUT_END_POINT=/logout (for later releases).

## For IBM Security Verify Access as Identity Provider:

### IDP-initiated:
REACT_APP_SAMLSSO_EXPLICIT_URL=https://localhost:12443/isam/sps/saml20idp/saml20/logininitial?RequestBinding=HTTPPost&PartnerId=https://localhost/samlsps/acs&NameIdFormat=Email&Target=https://localhost/idp/samlredirect?relayurl=

### SP-initiated:
REACT_APP_SAMLSSO_EXPLICIT_URL=/Rest?Target=https://localhost/sp/samlredirect?relayurl=