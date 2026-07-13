"use client";

import Link from "next/link";
import { LogIn, Save } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { LoadingState } from "@/components/LoadingState";
import { PageHero } from "@/components/PageHero";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { showError, showSuccess } from "@/lib/alerts";
import { getCurrentUser, updateCurrentUser, type CurrentUser } from "@/lib/api";
import { uploadAvatar } from "@/lib/upload";

function hasAuthMarker() {
  return typeof window !== "undefined" && window.localStorage.getItem("sharebari_authenticated") === "true";
}

export default function ProfilePage() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [message, setMessage] = useState("Loading profile...");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  useEffect(() => {
    if (!hasAuthMarker()) {
      Promise.resolve().then(() => {
        setIsUnauthorized(true);
        setMessage("Please log in to update your profile.");
      });
      return;
    }

    getCurrentUser()
      .then((data) => {
        setUser(data);
        setAvatarPreview(data.avatar || "");
        setMessage("");
      })
      .catch((error) => {
        setMessage(error instanceof Error ? error.message : "Could not load profile");
      });
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    const form = new FormData(event.currentTarget);
    const avatarFile = form.get("avatarFile");

    try {
      const avatar = avatarFile instanceof File && avatarFile.size > 0
        ? await uploadAvatar(avatarFile)
        : avatarPreview;
      const updatedUser = await updateCurrentUser({
        name: String(form.get("name") || ""),
        email: String(form.get("email") || ""),
        phone: String(form.get("phone") || ""),
        location: String(form.get("location") || ""),
        avatar,
      });
      setUser(updatedUser);
      setAvatarPreview(updatedUser.avatar || "");
      await showSuccess("Profile saved", "Your profile has been updated.");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Could not save profile";
      setMessage(errorMessage);
      await showError("Could not save profile", errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="site-shell ">
      <SiteHeader />
      <main className="container py-10">
        <PageHero
          eyebrow="Protected"
          title="Your profile."
          lead="Keep your name, contact details, location, and profile image ready for smooth rentals."
          image="https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1400&q=80"
          imageAlt="Person updating a profile on a laptop"
        />
        {!user ? (
          isUnauthorized ? (
            <div className="panel empty-state">
              <p>{message}</p>
              <Link className="button" href="/login">
                <LogIn size={17} aria-hidden="true" />
                Login
              </Link>
            </div>
          ) : (
            <LoadingState label={message} />
          )
        ) : (
          <form className="panel form-grid profile-form" onSubmit={handleSubmit}>
            <label className="full avatar-upload-field">
              <span>Profile image</span>
              <div className="avatar-upload-row">
                <span className="avatar profile-avatar-preview" aria-hidden="true">
                  {avatarPreview ? <img src={avatarPreview} alt="" /> : user.name.slice(0, 1).toUpperCase()}
                </span>
                <input
                  className="field"
                  name="avatarFile"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(event) => {
                    const file = event.currentTarget.files?.[0];
                    setAvatarPreview(file ? URL.createObjectURL(file) : user.avatar || "");
                  }}
                />
              </div>
            </label>
            <input className="field" name="name" defaultValue={user.name} placeholder="Name" required minLength={2} />
            <input className="field" name="email" type="email" defaultValue={user.email} placeholder="Email" required />
            <input className="field" name="phone" defaultValue={user.phone || ""} placeholder="Phone" />
            <input className="field" name="location" defaultValue={user.location || ""} placeholder="Location" />
            {message ? <p className="notice full">{message}</p> : null}
            <button className="button" type="submit" disabled={isLoading}>
              <Save size={17} aria-hidden="true" />
              {isLoading ? "Saving..." : "Save Profile"}
            </button>
          </form>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
