
# About this doc

It describes the set-up of Websphere Application Server Traditional profile as Service Provider in a SP-initiated SAML SSO login scenario for the HTTP Browser profile.

# Prerequisites

- A set up Cúram Application server in Websphere 8.5.5 or 9.
- An IBM HTTP Server configured with the WebSphere Plugins module to serve Cúram apps.

# Customise and install SAML Service Provider (SP) app

In this section, we are going to make some changes to the default WebSphereSamlSP.ear and then proceed to install it.

## Procedure

1. Open a root login session to the ``<was-host>``, and copy acs_java_dev/CEFilter onto a folder (ie. /root).
2.	Run below commands in your terminal to unzip and compile the curam.filter.CEFilter class needed in WebSphereSamlSP to avoid CORS-related issues. It assumes the $WAS_HOME is /opt/IBM/WebSphere/AppServer and uses WAS Java SDK 1.8.

```
cd /root/acs_java_dev/CEFilter
/opt/IBM/WebSphere/AppServer/java/8.0/bin/javac -cp /opt/IBM/WebSphere/AppServer/dev/JavaEE/j2ee.jar -d classes/ curam/filter/CEFilter.java
/opt/IBM/WebSphere/AppServer/java/8.0/bin/jar cvf CEFilter.jar -C classes/ curam/filter/CEFilter.class
```

3. Run below commands to add the filter to WebSphereSamlSP.ear:

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

4. Open a browser in your client and navigate to your WAS admin console: `https://<was-host>:9043/ibm/console`
5. Go to WebSphere enterprise application link, and click on Install button.
6. Select Remote file system, and in the Full Path: specify `/tmp/WebSphereSamlSP.ear`. Then click “Next” button.
7.	Select the “Detailed” option, and click “Next”.
8.	Click “Continue”.
9.	On Step 1, do not modify and click “Next”.
10. On Step 2, select both servers IHS and WAS, and click “Apply” to the WebSphereSamlSPWeb module, showing both servers in the module. Then click “Next”.
11. On Step 3, do not modify and click “Next”.
12. On Step 4, do not modify and click “Next”.
13. On Step 5, do not modify and click “Next”.
14. On Step 6, select client_host as the Virtual Host of the WebSphereSamlSPWeb module
15. On Step 7, leave samlsps as the default Context Root, and click “Next”.
16. On Step 8, do not modify and click “Next”.
17. On Step 9, do not modify and click “Next”.
18. On Step 10, do not modify and click “Next”.
19. On Step 11, do not modify and click “Next”.
20. On Step 12, review the settings and click “Finish”.
21. Upon completion, click Save link.
22. Now you have an app called WebSphereSamlSP in your list, select it and click Start to bring it up.

# Implementing the Trust Association Interceptor for SP-initiated SSO

1.	Open a root login session to the ``<was-host>``, and copy acs_java_dev/SPInitTAI onto a folder (ie. /root), or the acs_java_dev/SPInitTAIKeyCloak in case of configuring for KeyCloak.
2.	Run below commands in your terminal to unzip and compile the curam.sso.SPInitTAI class needed in WebSphereSamlSP to intercept calls to /Rest and initiate SAML SSO. It assumes the $WAS_HOME is /opt/IBM/WebSphere/AppServer and uses WAS Java SDK 1.8.

Note: substitute the `<idp-hosturl>` for the Identity Provider SAML login URL, as well as the ``<acs-url>`` for the Service Provider Assertion Consumer Service URL (`https://<was-host>/samlsps/acs`). Also substitute ``<ce-redirect>`` for the location of your CE application (for example: `https://<web-host>/universal/samlredirect?relayurl=account`)

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

During the Service-provider Security configuration section below, we'll add a reference to the class `curam.sso.SPInitTAI`, or `curam.sso.SPInitTAIKeyCloak` for KeyCloak Identity Provider.

# Adding the Identity provider as a trusted inbound realm

1. In WAS admin console, go to Security -> Global Security.
2. In the Available realm definitions, click “Configure” button.
3. Click on “Trusted authentication realms – inbound” link.
4.	Click on “Add External Realm…” button.
5.	In the “External realm name”, type in the ``<idp-host>``
6.	Click “OK” button.
7.	``<idp-host>`` will appear in the list of realms as trusted. Save the configuration.

# Service-provider Security configuration

These steps can be followed in https://www.ibm.com/support/knowledgecenter/en/SSAW57_9.0.0/com.ibm.websphere.nd.multiplatform.doc/ae/twbs_enablesamlsso.html This first configuration is for IdP-initiated flow.

1.	In the active WAS admin session (``https://<was-host>:9043/ibm/console``), navigate to “Security -> Global Security -> Web and Sip Security -> Trust association” 
2.	Tick the box on “Enable trust association”, click OK button, and save the config.
3.	Go back to Trust association link, and now click on “Interceptors” link.
4.	Click on “New” button.
5.	Fill the values as shown below (click on “New” button to add new custom properties as needed):
   - Interceptor class name: `com.ibm.ws.security.web.saml.ACSTrustAssociationInterceptor`
   - Custom properties:
     - Name: `sso_1.sp.acsUrl` Value: ``https://<was-host>/samlsps/acs``
     - Name: `sso_1.sp.filter` Value: `request-url!=j_security_check`
     - Name: `sso_1.sp.enforceTaiCookie` Value: `false`
     - Name: `sso_1.sp.login.error.page` Value: `curam.sso.SPInitTAI` or for KeyCloak `curam.sso.SPInitTAIKeyCloak`
     - Name: `sso_1.sp.preserveRequestState` Value: `false`
     - [**KeyCloak** specific] Name: `sso_1.sp.wantAssertionsSigned` Value: `false`
6.	Click OK button, and save the configuration.
7.	Add and/or modify custom security properties in WAS: navigate to Global security, and then to Custom Properties:
   - Name: `com.ibm.websphere.security.DeferTAItoSSO ` Value: `com.ibm.ws.security.web.saml.ACSTrustAssociationInterceptor`
   - Name: `com.ibm.websphere.security.InvokeTAIbeforeSSO` Value: `com.ibm.ws.security.web.saml.ACSTrustAssociationInterceptor`
   - Name: `com.ibm.ws.security.web.logoutOnHTTPSessionExpire` Value: `false`
The property com.ibm.ws.security.web.logoutOnHTTPSessionExpire = false is to allow SSO-initiated sessions to log in without first creating a HTTP session.
8. Save the configuration.

# Exporting the Service Provider metadata.

1. Open a root session to ``<was-host>``, and run below commands to export the SP metadata via wsadmin.sh – note that $WAS_HOME for the test environment was /opt/IBM/WebSphere/AppServer

```
/opt/IBM/WebSphere/AppServer/profiles/AppSrv01/bin/wsadmin.sh -lang jython
AdminTask.exportSAMLSpMetadata('-spMetadataFileName /root/sp_metadata.xml -ssoId 1')
exit
```
2.	Copy the /root/sp_metadata.xml file to your client, you may need to send it over your identity provider.

# Importing the Identiy Provider metadata.

1.	Copy the file that you exported from the Identity Provider - called federation-metadata.xml for this example - to the ``<was-host>`` in a folder like /root.
2.	Open a root session to ``<was-host>``, and run below commands to import the IdP metadata via wsadmin.sh – note that $WAS_HOME for our environment was /opt/IBM/WebSphere/AppServer

```
/opt/IBM/WebSphere/AppServer/profiles/AppSrv01/bin/wsadmin.sh -lang jython
AdminTask.importSAMLIdpMetadata('-idpMetadataFileName /root/federation_metadata.xml -idpId 1 -ssoId 1 -signingCertAlias idp-signcert')
AdminConfig.save()
exit
```
3.	 (Optional) As a validation, you can go to WAS admin console -> Security -> Global Security -> Web and Sip Security -> Trust association -> Interceptors -> com.ibm.ws.security.web.saml.ACSTrustAssociationInterceptor , and you’ll see there are two new properties listed, with prefix sso_1.idp_1 . If you have a web session already in that page, you’ll need to navigate away or refresh it.
4. Restart the WebSphere Application Server.