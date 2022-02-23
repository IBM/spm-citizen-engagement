
# Configuring a WebSphere Application Server traditional profile as a service provider (SP)

The following steps describe how to configure a WebSphere Application Server traditional profile as a service provider in an SP-initiated SAML SSO login scenario for the HTTP browser profile.

# Prerequisites

- A Social Program Management Application server that is configured with either WebSphere Application Server 8.5.5 or 9.
- An IBM HTTP Server configured with the WebSphere plug-ins module to serve Social Program Management applications.

# Customize and install a SAML service provider (SP) application

In this section, we will modify the default WebSphereSamlSP.ear file and then install it.

## Procedure

1. Open a root login session to the ``<was-host>``, and copy acs_java_dev/CEFilter into a folder, for example, /root.
2. Run the following commands in your terminal to extract and compile the curam.filter.CEFilter class that WebSphereSamlSP needs to avoid CORS-related issues. The commands assume that $WAS_HOME is /opt/IBM/WebSphere/AppServer and uses the WebSphere Application Server Java SDK 1.8.

   ```
   cd /root/acs_java_dev/CEFilter
   /opt/IBM/WebSphere/AppServer/java/8.0/bin/javac -cp /opt/IBM/WebSphere/AppServer/dev/JavaEE/j2ee.jar -d classes/ curam/filter/CEFilter.java
   /opt/IBM/WebSphere/AppServer/java/8.0/bin/jar cvf CEFilter.jar -C classes/ curam/filter/CEFilter.class
   ```

3. Run the following commands to add the filter to the WebSphereSamlSP.ear file:

   ```
   \cp -a /opt/IBM/WebSphere/AppServer/installableApps/WebSphereSamlSP.ear /tmp
   cd /tmp
   unzip WebSphereSamlSP.ear WebSphereSamlSPWeb.war
   unzip WebSphereSamlSPWeb.war WEB-INF/web.xml
   mkdir -p WEB-INF/lib/
   \cp -a /root/acs_java_dev/CEFilter/CEFilter.jar WEB-INF/lib/
   \cp -a /root/acs_java_dev/CEFilter/classes WEB-INF/
   sed -i 's|</web-app>|<filter><filter-name>CEFilter</filter-name><filter-class>curam.filter.CEFilter</filter-class></filter><filter-mapping><filter-name>CEFilter</filter-name><url-pattern>/*</url-pattern></filter-mapping></web-app>|' WEB-INF/web.xml
   zip -u WebSphereSamlSPWeb.war WEB-INF/web.xml WEB-INF/lib/ WEB-INF/lib/CEFilter.jar WEB-INF/classes/curam/ WEB-INF/classes/curam/filter/ WEB-INF/classes/curam/filter/CEFilter.class
   zip -u WebSphereSamlSP.ear WebSphereSamlSPWeb.war
   ```

4. Open a browser in your client and navigate to your WebSphere Application Server admin console: `https://<was-host>:9043/ibm/console`
5. Go to the WebSphere enterprise application link, and click **Install**.
6. Select **Remote file system**, and in the full path, specify `/tmp/WebSphereSamlSP.ear`. Then, click **Next**.
7. Select the **Detailed** option, and click **Next**.
8. Click **Continue**.
9. On Step 1, do not modify and click **Next**.
10. On Step 2, select both IHS and WebSphere Application Server, and click **Apply** to the WebSphereSamlSPWeb module, with both servers showing in the module. Click **Next**.
11. On Step 3, do not modify and click **Next**.
12. On Step 4, do not modify and **Next**.
13. On Step 5, do not modify and click **Next**.
14. On Step 6, select **client_host** as the virtual host for the WebSphereSamlSPWeb module.
15. On Step 7, leave samlsps as the default context root, and click **Next**.
16. On Step 8, do not modify and click **Next**.
17. On Step 9, do not modify and click **Next**.
18. On Step 10, do not modify and click **Next**.
19. On Step 11, do not modify and click **Next**.
20. On Step 12, review the settings and click **Finish**.
21. Upon completion, click **Save link**.
22. Now you have an application called WebSphereSamlSP in your list. Select the application, and click **Start** to open it.

# Implementing the Trust Association Interceptor for SP-initiated SSO

1. Open a root login session to the ``<was-host>``, and copy acs_java_dev/SPInitTAI into a folder, for example, /root. If you are configuring KeyCloak, instead copy acs_java_dev/SPInitTAIKeyCloak.
2. In your terminal, run the following commands to extract and compile the curam.sso.SPInitTAI class that WebSphereSamlSP needs to intercept calls to /Rest and initiate SAML SSO. The commands assume that $WAS_HOME is /opt/IBM/WebSphere/AppServer and uses the WebSphere Application Server Java SDK 1.8.

Note: substitute the `<idp-hosturl>` for the identity provider SAML login URL, and also substitute the ``<acs-url>`` for the service provider assertion consumer service URL (`https://<was-host>/samlsps/acs`). Also, substitute ``<ce-redirect>`` for the location of your Universal Access application (for example: `https://<web-host>/universal/samlredirect?relayurl=account`).

```
cd /root/acs_java_dev/SPInitTAI/
sed -i -e 's|%SSOURL%|<idp-host-url>|' -e 's|%ACSURL%|<acs-url>|' -e 's|%CEREDIRECT%|<ce-redirect>|' curam/sso/SPInitTAI.java
# for keycloak
sed -i -e 's|%SSOURL%|<idp-host-url>|' -e 's|%ACSURL%|<acs-url>|' -e 's|%CEREDIRECT%|<ce-redirect>|' curam/sso/SPInitTAIKeyCloack.java
/opt/IBM/WebSphere/AppServer/java/8.0/bin/javac -cp /opt/IBM/WebSphere/AppServer/dev/JavaEE/j2ee.jar:/opt/IBM/WebSphere/AppServer/dev/was_public.jar -d classes/ curam/sso/SPInitTAI.java
/opt/IBM/WebSphere/AppServer/java/8.0/bin/javac -cp /opt/IBM/WebSphere/AppServer/dev/JavaEE/j2ee.jar:/opt/IBM/WebSphere/AppServer/dev/was_public.jar -d classes/ curam/sso/SPInitTAIKeyCloak.java
/opt/IBM/WebSphere/AppServer/java/8.0/bin/jar cvf SPInitTAI.jar -C classes/ curam/sso/SPInitTAI.class curam/sso/SPInitTAIKeyCloak.class
\cp -a SPInitTAI.jar /opt/IBM/WebSphere/AppServer/lib/ext
```

In the following service provider security configuration section, we will add a reference to either the `curam.sso.SPInitTAI` class, or the `curam.sso.SPInitTAIKeyCloak` class for KeyCloak identity provider.

# Adding the identity provider as a trusted inbound realm

1. In the WebSphere Application Server admin console, click **Security -> Global Security**.
2. In the available realm definitions, click **Configure**.
3. Click **Trusted authentication realms – inbound**.
4. Click **Add External Realm…**.
5. For **External realm name**, enter the ``<idp-host>`` value.
6. Click **OK**. The value of ``<idp-host>`` will be displayed in the list of trusted realms.
7. Save the configuration.

# Service provider security configuration

For more information, see the steps that are documented at [Enabling your system to use the SAML web single sign-on (SSO) feature](https://www.ibm.com/support/knowledgecenter/en/SSAW57_9.0.0/com.ibm.websphere.nd.multiplatform.doc/ae/twbs_enablesamlsso.html). The following configuration is for an IdP-initiated flow.

1. In the active WebSphere Application Server admin session (``https://<was-host>:9043/ibm/console``), click **Security -> Global Security -> Web and Sip Security -> Trust association**.
2. Select **Enable trust association**, click **OK**, and save the configuration.
3. Go back to **Trust association**, and click **Interceptors**.
4. Click **New**.
5. Enter the values as shown in the following list (click **New** to add custom properties as needed):
   - Interceptor class name: `com.ibm.ws.security.web.saml.ACSTrustAssociationInterceptor`
   - Custom properties:
     - Name: `sso_1.sp.acsUrl` Value: ``https://<was-host>/samlsps/acs``
     - Name: `sso_1.sp.filter` Value: `request-url!=j_security_check`
     - Name: `sso_1.sp.enforceTaiCookie` Value: `false`
     - Name: `sso_1.sp.login.error.page` Value: `curam.sso.SPInitTAI` or for KeyCloak `curam.sso.SPInitTAIKeyCloak`
     - Name: `sso_1.sp.preserveRequestState` Value: `false`
     - (Applies only to KeyCloak) Name: `sso_1.sp.wantAssertionsSigned` Value: `false`
6. Click **OK**, and save the configuration.
7. To either add or modify custom security properties in WebSphere Application Server, go to Global security, and then to Custom Properties:
   - Name: `com.ibm.websphere.security.DeferTAItoSSO` Value: `com.ibm.ws.security.web.saml.ACSTrustAssociationInterceptor`
   - Name: `com.ibm.websphere.security.InvokeTAIbeforeSSO` Value: `com.ibm.ws.security.web.saml.ACSTrustAssociationInterceptor`
   - Name: `com.ibm.ws.security.web.logoutOnHTTPSessionExpire` Value: `false`
   The property `com.ibm.ws.security.web.logoutOnHTTPSessionExpire = false` enables SSO-initiated sessions to log on without first creating an HTTP session.
8. Save the configuration.

# Exporting the service provider metadata

1. Open a root session to ``<was-host>``, and run the following commands to export the SP metadata through wsadmin.sh. For the test environment, $WAS_HOME is /opt/IBM/WebSphere/AppServer.

   ```
   /opt/IBM/WebSphere/AppServer/profiles/AppSrv01/bin/wsadmin.sh -lang jython
   AdminTask.exportSAMLSpMetadata('-spMetadataFileName /root/sp_metadata.xml -ssoId 1')
   exit
   ```

2. Copy the /root/sp_metadata.xml file to your client, in case you need to send it to your identity provider.

# Importing the identity provider metadata

1. Copy the file that you exported from the identity provider, which in this example is named federation-metadata.xml, to the ``<was-host>`` in a folder such as /root.
2. Open a root session to ``<was-host>``, and run the following commands to import the IdP metadata through wsadmin.sh. Note that for our environment, $WAS_HOME is /opt/IBM/WebSphere/AppServer.

   ```
   /opt/IBM/WebSphere/AppServer/profiles/AppSrv01/bin/wsadmin.sh -lang jython
   AdminTask.importSAMLIdpMetadata('-idpMetadataFileName /root/federation_metadata.xml -idpId 1 -ssoId 1 -signingCertAlias idp-signcert')
   AdminConfig.save()
   exit
   ```

3. (Optional) As a validation, you can go to the WebSphere Application Server admin console and click **Security -> Global Security -> Web and Sip Security -> Trust association -> Interceptors -> com.ibm.ws.security.web.samlACSTrustAssociationInterceptor**, where two new properties are listed with the prefix ``sso_1.idp_1``. If you have an existing web session in that page, you will need to either navigate away or refresh the page.
4. Restart the WebSphere Application Server.
