import { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "react-oidc-context";
import { useDispatch } from "react-redux";
import { setAuthentication, unsetAuthentication } from "./api-lib";
import { WebStorageStateStore } from "oidc-client-ts";

const AuthenticationStoreSync = () => {
  const auth = useAuth();
  const dispatch = useDispatch();

  const [userValueExpired, setUserValueExpired] = useState(false);

  useEffect(() => {
    if (auth.isLoading) return;

    if (auth.user && !auth.user.expired) {
      // Trigger delayed rerender to reevaluate user.expired value.
      setTimeout(
        () => setUserValueExpired(current => !current),
        auth.user.expires_in * 1000,
      );
      dispatch(setAuthentication(auth.user));
    } else {
      dispatch(unsetAuthentication());
    }
  }, [auth.user, userValueExpired, dispatch, auth.isLoading]);
};

export const BdmsAuthProvider = props => {
  const [serverConfig, setServerConfig] = useState(undefined);
  const [oidcConfig, setOidcConfig] = useState(undefined);

  useEffect(() => {
    fetch("/api/v2/settings/auth")
      .then(res =>
        res.ok
          ? res.json()
          : Promise.reject(Error("Failed to get auth settings from API")),
      )
      .then(setServerConfig)
      .catch(setServerConfig(undefined));
  }, []);

  useEffect(() => {
    if (!serverConfig) return;

    const onSigninCallback = user => {
      const preLoginState = JSON.parse(atob(user.url_state));
      // restore location after login.
      window.history.replaceState({}, document.title, preLoginState.href);
    };

    setOidcConfig({
      authority: serverConfig.authority,
      client_id: serverConfig.audience,
      scope: serverConfig.scopes,
      redirect_uri: window.location.origin,
      post_logout_redirect_uri: window.location.origin,
      userStore: new WebStorageStateStore({ store: window.localStorage }),
      onSigninCallback,
    });
  }, [serverConfig]);

  return oidcConfig ? (
    <AuthProvider {...oidcConfig}>
      <AuthenticationStoreSync />
      {props.children}
    </AuthProvider>
  ) : null;
};
