import React from "react";
import { GoogleLogin as GoogleLoginButton } from "@react-oauth/google";
import useGoogleAuth from "@/hooks/useGoogleAuth";

const GoogleLogin = () => {
  const { handleSuccess, handleError } = useGoogleAuth();
  return (
    <div>
      <GoogleLoginButton onSuccess={handleSuccess} onError={handleError} shape="square" theme="filled_black" type="icon" />
    </div>
  );
};

export default GoogleLogin;
