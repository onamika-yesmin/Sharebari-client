"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { apiPost } from "@/lib/api";

type Mode = "login" | "register";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsLoading(true);

    const form = new FormData(event.currentTarget);
    const body = Object.fromEntries(form.entries());

    try {
      await apiPost(mode === "login" ? "/api/auth/login" : "/api/auth/register", body);
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="panel form-grid auth-panel" onSubmit={handleSubmit}>
      {mode === "register" ? (
        <>
          <input className="field" name="name" placeholder="Name" required />
          <input className="field" name="phone" placeholder="Phone" />
          <input className="field full" name="location" placeholder="Location" />
        </>
      ) : null}
      <input className="field full" name="email" type="email" placeholder="Email" defaultValue={mode === "login" ? "demo@sharebari.com" : ""} required />
      <input className="field full" name="password" type="password" placeholder="Password" defaultValue={mode === "login" ? "Demo1234" : ""} required minLength={6} />
      {mode === "register" ? <input className="field full" name="confirmPassword" type="password" placeholder="Confirm password" required minLength={6} /> : null}
      {message ? <p className="notice full">{message}</p> : null}
      <button className="button" type="submit" disabled={isLoading}>{isLoading ? "Please wait..." : mode === "login" ? "Login" : "Create Account"}</button>
      <Link className="button-ghost" href={mode === "login" ? "/register" : "/login"}>
        {mode === "login" ? "Create account" : "I have an account"}
      </Link>
    </form>
  );
}
