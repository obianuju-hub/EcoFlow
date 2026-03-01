"use client";

import React from 'react'
import { signIn } from 'next-auth/react'

const GithubSignIn = () => {
  const handleGithubSignIn = async () => {
    await signIn("github");
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleGithubSignIn();
    }}>


        <button className=' border-4 '>git hub 

        </button>
    </form>
  )
}

export  {GithubSignIn}