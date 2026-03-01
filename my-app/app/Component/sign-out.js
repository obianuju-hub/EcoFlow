"use client"

import { signOut } from "next-auth/react";

const SignOut = () => {

  const handleSubmit = async () => {
    await signOut({ callbackUrl: "/Landing" }); 
  };

  return (
    <div>
      <button onClick={handleSubmit}>Sign Out</button>
    </div>
  );
};

export default SignOut;