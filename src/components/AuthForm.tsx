"use client";

import { GoogleLogin } from "@react-oauth/google";
import { LogIn, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { apiPost } from "@/lib/api";
import { showError, showSuccess } from "@/lib/alerts";
import { uploadAvatar } from "@/lib/upload";

type Mode = "login" | "register";
type AuthResponse = {
  token?: string;
  accessToken?: string;
  data?: {
    token?: string;
    accessToken?: string;
  };
};

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("");
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  async function finishAuth(payload?: AuthResponse) {
    const token = payload?.token || payload?.accessToken || payload?.data?.token || payload?.data?.accessToken;
    if (token) {
      window.localStorage.setItem("sharebari_auth_token", token);
    }
    window.localStorage.setItem("sharebari_authenticated", "true");
    await showSuccess(mode === "login" ? "Welcome back" : "Account created", "Your ShareBari workspace is ready.");
    router.push("/dashboard");
    router.refresh();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsLoading(true);

    const form = new FormData(event.currentTarget);
    const body = Object.fromEntries(form.entries());
    const avatarFile = form.get("avatarFile");
    delete body.avatarFile;

    try {
      if (mode === "register" && avatarFile instanceof File && avatarFile.size > 0) {
        body.avatar = await uploadAvatar(avatarFile);
      }
      const payload = await apiPost<AuthResponse>(mode === "login" ? "/api/auth/login" : "/api/auth/register", body);
      await finishAuth(payload);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Authentication failed";
      setMessage(errorMessage);
      await showError("Authentication failed", errorMessage);
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
                const payload = await apiPost<AuthResponse>("/api/auth/google", { credential: credentialResponse.credential });
                await finishAuth(payload);
              } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Google login failed";
                setMessage(errorMessage);
                await showError("Google login failed", errorMessage);
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
            <label className="full avatar-upload-field">
              <span>Profile image</span>
              <div className="avatar-upload-row">
                <span className="avatar avatar-large" aria-hidden="true">
                  {avatarPreview ? <img src={avatarPreview} alt="" /> : "SB"}
                </span>
                <input
                  className="field"
                  name="avatarFile"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(event) => {
                    const file = event.currentTarget.files?.[0];
                    setAvatarPreview(file ? URL.createObjectURL(file) : "");
                  }}
                />
              </div>
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
        <button className="button auth-submit full" type="submit" disabled={isLoading}>
          {mode === "login" ? <LogIn size={17} aria-hidden="true" /> : <UserPlus size={17} aria-hidden="true" />}
          {isLoading ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
        </button>
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
