package curam.sso;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.TimeZone;

import javax.servlet.http.HttpServletRequest;

import com.ibm.websphere.security.NotImplementedException;
import com.ibm.wsspi.security.web.saml.AuthnRequestProvider;

public class SPInitTAIKeyCloak implements AuthnRequestProvider {

	@Override
	public String getIdentityProviderOrErrorURL(HttpServletRequest arg0, String arg1, String arg2,
			ArrayList<String> arg3) throws NotImplementedException {
		
		return null;
	}

	@Override
	public HashMap<String, String> getAuthnRequest(HttpServletRequest arg0, String arg1, String arg2,
			ArrayList<String> paramArrayList) throws NotImplementedException {

		
		
	//create map with following keys
	HashMap <String, String> map = new HashMap <String, String>();
	
	String ssoUrl = "%SSOURL%";
	String acsUrl = "%ACSURL%";
	String targetRequest = arg0.getParameter("Target");
	String relayStateUrl;
	if (targetRequest != null){
		relayStateUrl = targetRequest;
	} else {
		relayStateUrl = "%CEREDIRECT%";
	}
	String issuer = acsUrl;
        String destination = ssoUrl;
        
        map.put(AuthnRequestProvider.SSO_URL, ssoUrl);

       // String relayState = Double.toString(Math.random());
        map.put(AuthnRequestProvider.RELAY_STATE, relayStateUrl);

        String requestID = "Test" + Double.toString(Math.random());
        map.put(AuthnRequestProvider.REQUEST_ID, requestID);
   
        
        String authnMessageNew = "<samlp:AuthnRequest xmlns:samlp=\"urn:oasis:names:tc:SAML:2.0:protocol\" "
        		+ "ID=\""+requestID+"\" "
        		+ "Version=\"2.0\" "
        		+ "IssueInstant=\""+getDateTime()+"\" ForceAuthn=\"false\" IsPassive=\"false\" "
        		+ "ProtocolBinding=\"urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST\" "
        		+ "AssertionConsumerServiceURL=\""+acsUrl+"\" " 
        		+ "Destination=\""+destination+"\"> "
        		+ "<saml:Issuer xmlns:saml=\"urn:oasis:names:tc:SAML:2.0:assertion\">"+issuer
        		+ "</saml:Issuer> <samlp:NameIDPolicy Format=\"urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified\" AllowCreate=\"true\" />"
        		+"<samlp:RequestedAuthnContext Comparison=\"exact\"> <saml:AuthnContextClassRef xmlns:saml=\"urn:oasis:names:tc:SAML:2.0:assertion\">"
        		+ "urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport</saml:AuthnContextClassRef></samlp:RequestedAuthnContext> </samlp:AuthnRequest>";
        
        
        //System.out.println("authMessage " + authnMessageNew);
        
        String encodedAuth = Base64.getEncoder().encodeToString(authnMessageNew.getBytes());
        
        map.put(AuthnRequestProvider.AUTHN_REQUEST, encodedAuth);
        
            return map;
	}
	
	
	private String getDateTime() {
		//2018-11-11T23:52:45Z
		String pattern =  "yyyy-MM-dd'T'HH:mm:ss'Z'";
		SimpleDateFormat simpleDateFormat = new SimpleDateFormat(pattern);
        simpleDateFormat.setTimeZone(TimeZone.getTimeZone("Zulu"));
		String date = simpleDateFormat.format(new Date());
		 return date;
	}


}
