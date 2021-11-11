# About this doc

It describes the set-up of KeyCloak as Identity Provider in a SP-initiated SAML SSO login scenario for the HTTP Browser profile.

# KeyCloak configuration as Identity Provider

## Prerequisites

- An KeyCloak instance running. If using the containerized version, a way to start it for dev/test purposes is:

```
docker run -d -p 8080:8080 -p 8443:8443 -e DB_VENDOR=h2 -e KEYCLOAK_USER=admin -e KEYCLOAK_PASSWORD=admin --name keycloak quay.io/keycloak/keycloak:15.0.2
```

See [https://www.keycloak.org/getting-started/getting-started-docker](https://www.keycloak.org/getting-started/getting-started-docker) for instructions.

## Procedure

0. Authenticate in the admin console, for example: https://localhost:8443/auth/admin
1. Hover over "Select realm", and click on "Add Realm": Give it a name and create it.
2. Once created, click on Endpoints -> SAML 2.0 Identity Provider Metadata, and save the metadata XML to configure the Service Provider.
3. Under the new realm, go to Clients -> Create button. 
   1. As Client ID specify the SAML Issuer, in our case, the URI for the Assertion Consumer Service ( for example https://localhost/samlsps/acs )
   2. Set protocol to saml and save.
4. Make sure below settings are set:
   1. Enabled: ON
   2. Sign Documents: OFF
   3. Sign Assertions: OFF
   4. Encrypt Assertions: OFF
   5. Force POST Binding
   6. Name ID Format: username
   7. Valid Redirect URIs: the URI for the Assertion Consumer Service ( for example https://localhost/samlsps/acs )
5. Under Fine Grain SAML Endpoint Configuration:
   1. Assertion Consumer Service POST Binding URL: the URI for the Assertion Consumer Service ( for example https://localhost/samlsps/acs )
6. Before switching to other tabs, save the changes.
7. In the Mappers tab, select "Add Builtin", and select the three X500 ones: email, surname and givenName. Add the selected ones.
8. Go to Manage -> Users. Select "Add Users", and fill in the details:
   1. Username corresponds to an entry in the ExternalUser table in SPM Cúram database.
   2. Email
   3. First Name
   4. Last Name
   5. User Enabled: ON
   6. Email Verified ON
   7. Save
9. Once the user is added, either filter search or click on view all users, and click on the one just added.
10. In the credentials tab, fill in the Password info (Temporary set to OFF if you do not want the user to change the pwd upon first login) and save.