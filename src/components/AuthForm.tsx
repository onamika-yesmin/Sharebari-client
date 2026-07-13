"use client";

import { GoogleLogin } from "@react-oauth/google";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { apiPost } from "@/lib/api";

type Mode = "login" | "register";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  function finishAuth() {
    window.localStorage.setItem("sharebari_authenticated", "true");
    router.push("/dashboard");
    router.refresh();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsLoading(true);

    const form = new FormData(event.currentTarget);
    const body = Object.fromEntries(form.entries());

    try {
      await apiPost(mode === "login" ? "/api/auth/login" : "/api/auth/register", body);
      finishAuth();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="auth-panel">
      <div className="auth-panel-head">
        <p>{mode === "login" ? "Account access" : "New account"}</p>
        <h2>{mode === "login" ? "Sign in to ShareBari" : "Create your account"}</h2>
      </div>

      {googleClientId ? (
        <div className="google-auth-row">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              if (!credentialResponse.credential) {
                setMessage("Google login failed. Please try again.");
                return;
              }

              try {
                setMessage("");
                setIsLoading(true);
                await apiPost("/api/auth/google", { credential: credentialResponse.credential });
                finishAuth();
              } catch (error) {
                setMessage(error instanceof Error ? error.message : "Google login failed");
              } finally {
                setIsLoading(false);
              }
            }}
            onError={() => setMessage("Google login failed. Please try again.")}
            shape="rectangular"
            size="large"
            text={mode === "login" ? "signin_with" : "signup_with"}
            width="360"
          />
        </div>
      ) : null}

      <div className="auth-divider"><span>or use email</span></div>

      <form className="form-grid auth-form" onSubmit={handleSubmit}>
        {mode === "register" ? (
          <>
            <label>
              <span>Name</span>
              <input className="field" name="name" autoComplete="name" required />
            </label>
            <label>
              <span>Phone</span>
              <input className="field" name="phone" autoComplete="tel" />
            </label>
            <label className="full">
              <span>Location</span>
              <input className="field" name="location" autoComplete="address-level2" />
            </label>
          </>
        ) : null}
        <label className="full">
          <span>Email</span>
          <input className="field" name="email" type="email" autoComplete="email" required />
        </label>
        <label className="full">
          <span>Password</span>
          <input className="field" name="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} required minLength={6} />
        </label>
        {mode === "register" ? (
          <label className="full">
            <span>Confirm password</span>
            <input className="field" name="confirmPassword" type="password" autoComplete="new-password" required minLength={6} />
          </label>
        ) : null}
        {message ? <p className="notice full">{message}</p> : null}
        <button className="button auth-submit full" type="submit" disabled={isLoading}>{isLoading ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}</button>
      </form>

      <p className="auth-switch">
        {mode === "login" ? "New to ShareBari?" : "Already have an account?"}{" "}
        <Link href={mode === "login" ? "/register" : "/login"}>
          {mode === "login" ? "Create an account" : "Sign in"}
        </Link>
      </p>
    </div>
  );
}
