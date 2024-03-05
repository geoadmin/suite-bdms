import { useEffect, useState } from "react";
import { AuthProvider } from "react-oidc-context";
import { UserManager, WebStorageStateStore } from "oidc-client-ts";
import { CognitoLogoutHandler } from "./commons/auth/CognitoLogoutHandler.js";
import { AuthenticationStoreSync } from "./commons/auth/AuthenticationStoreSync";

export const BdmsAuthProvider = props => {
  const [serverConfig, setServerConfig] = useState(undefined);
  const [oidcConfig, setOidcConfig] = useState(undefined);

  useEffect(() => {
    fetch("/api/v2/settings/auth")
      .then(res => (res.ok ? res.json() : Promise.reject(Error("Failed to get auth settings from API"))))
      .then(setServerConfig)
      .catch(setServerConfig(undefined));
  }, []);

  useEffect(() => {
    if (!serverConfig) return;

    const oidcClientSettings = {
      authority: serverConfig.authority,
      client_id: serverConfig.audience,
      scope: serverConfig.scopes,
      redirect_uri: window.location.origin,
      post_logout_redirect_uri: window.location.origin,
      userStore: new WebStorageStateStore({ store: window.localStorage }),
    };

    var userManager = new UserManager(oidcClientSettings);

    const onSigninCallback = user => {
      const preLoginState = JSON.parse(atob(user.url_state));
      // restore location after login.
      window.history.replaceState({}, document.title, preLoginState.href);
    };

    setOidcConfig({
      onSigninCallback,
      userManager,
    });
  }, [serverConfig]);

  return oidcConfig ? (
    <AuthProvider {...oidcConfig}>
      <AuthenticationStoreSync />
      <CognitoLogoutHandler userManager={oidcConfig.userManager} />
      {props.children}
    </AuthProvider>
  ) : null;
};