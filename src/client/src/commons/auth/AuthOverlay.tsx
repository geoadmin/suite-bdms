import React, { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Button, CircularProgress } from "@mui/material";
import { loadUser } from "../../api-lib";
import { SplashScreen } from "./SplashScreen";

interface AuthOverlayProps {
    children?: React.ReactNode
}

export const AuthOverlay: React.FC<AuthOverlayProps> = ({ children }) => {
    const auth = useAuth();
    const dispatch = useDispatch();
    const user = useSelector(state => state.core_user);
    const { t, i18n } = useTranslation();

    const signIn = () => {
        auth.signinRedirect({
            url_state: btoa(JSON.stringify({ href: window.location.href })),
        });
    };

    const signOut = () => { auth.signoutRedirect() };

    useEffect(() => {
        if (auth.isAuthenticated) {
            dispatch(loadUser())
        }
    }, [auth.isAuthenticated])


    if (auth.isAuthenticated && user.data) {
        return children;
    }
    else if (!auth.isLoading && !auth.isAuthenticated) {
        // Perform automatic login if user is not authenticated.
        signIn();
    }
    else if (user?.error) {
        return (
            <SplashScreen>
                 <Alert severity="error">
                    {t("userUnauthorized")}
                </Alert>
                <Button
                    variant="contained"
                    color="error"
                    onClick={signOut}
                >Logout</Button>
            </SplashScreen>
        );
    }
    else {
        return (
            <SplashScreen>
                <CircularProgress />
            </SplashScreen>
        );
    }
};
