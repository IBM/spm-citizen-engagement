# Configuring KeyCloak as an identity provider (IdP)

The following steps describe how to set up KeyCloak as an identity provider in a service-initiated SAML SSO login scenario for the HTTP browser profile.

## Prerequisites

- A KeyCloak instance is running. If you use the containerized version, you can use the following command to start an instance for development or test:

```
docker run -d -p 8080:8080 -p 8443:8443 -e DB_VENDOR=h2 -e KEYCLOAK_USER=admin -e KEYCLOAK_PASSWORD=admin --name keycloak quay.io/keycloak/keycloak:15.0.2
```

For more information, see [https://www.keycloak.org/getting-started/getting-started-docker](https://www.keycloak.org/getting-started/getting-started-docker).

## Procedure

1. Authenticate in the admin console, for example, [https://localhost:8443/auth/admin]([https://localhost:8443/auth/admin).
2. Hover over **Select realm**, and click **Add Realm**. Then, enter a name and create the realm.
3. After you create the realm, click **Endpoints -> SAML 2.0 Identity Provider Metadata**, and save the metadata XML, which is required to configure your service provider.
4. Under the new realm, click **Clients -> Create**:
   1. For the Client ID, specify the SAML issuer, which in this case is the URI for the assertion consumer service, for example [https://localhost/samlsps/acs](https://localhost/samlsps/acs).
   2. Set the protocol to SAML, and save.
5. Ensure that the following settings are configured:
   1. Enabled: ON
   2. Sign Documents: OFF
   3. Sign Assertions: OFF
   4. Encrypt Assertions: OFF
   5. Force POST Binding
   6. Name ID Format: username
   7. Valid Redirect URIs: the URI for the assertion consumer service, for example [https://localhost/samlsps/acs](https://localhost/samlsps/acs).
6. Under **Fine Grain SAML Endpoint Configuration -> Assertion Consumer Service POST Binding URL**, enter the URI for the assertion consumer service, for example, [https://localhost/samlsps/acs](https://localhost/samlsps/acs).
7. Before you switch to other tabs, save the changes.
8. In the **Mappers** tab, click **Add Builtin**, and select the three X500 options, which are email, surname, and givenName. Add the selected options.
9. Click **Manage -> Users**. Click **Add Users**, enter the following details and then save:
    1. Username corresponds to an entry in the ExternalUser table in the Social Program Management database.
    2. Email
    3. First Name
    4. Last Name
    5. User Enabled: ON
    6. Email Verified ON
10. After you add the user, either filter search or click view all users, and then click the user that you just added.
11. In the **Credentials** tab, enter the Password information and then save. You can set **Temporary** to OFF if you do not want the user to change the password after the first login.
