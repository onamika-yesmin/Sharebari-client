import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function RegisterPage() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="container">
        <section className="page-title">
          <p className="eyebrow">Register</p>
          <h1>Create your ShareBari account.</h1>
        </section>
        <form className="panel form-grid">
          <input className="field" placeholder="Name" />
          <input className="field" type="email" placeholder="Email" />
          <input className="field" placeholder="Phone" />
          <input className="field" placeholder="Location" />
          <input className="field" type="password" placeholder="Password" />
          <input className="field" type="password" placeholder="Confirm password" />
          <button className="button" type="submit">Create Account</button>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}
