// components/GoogleLogin.tsx
"use client";

import React from "react";
import { GoogleLogin as GoogleLoginButton } from "@react-oauth/google";
import useGoogleAuth from "@/hooks/useGoogleAuth";

const GoogleLogin = () => {
  const { handleSuccess, handleError } = useGoogleAuth();

  return (
    <div className="w-full">
      <GoogleLoginButton
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap={true}
        auto_select={false}
        theme="filled_blue"
        size="large"
        text="signin_with"
        shape="rectangular"
        width="100%"
      />
    </div>
  );
};

export default GoogleLogin;