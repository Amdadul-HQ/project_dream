import Login from "@/pages/auth/Login/Login";
import React from "react";

const LoginPage = () => {
  console.log(process.env.NEXT_PUBLIC_BASE_API);
  return (
    <div>
      <Login />
    </div>
  );
};

export default LoginPage;
