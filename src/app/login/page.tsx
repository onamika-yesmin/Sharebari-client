import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function LoginPage() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="container">
        <section className="page-title">
          <p className="eyebrow">Login</p>
          <h1>Welcome back.</h1>
        </section>
        <form className="panel form-grid">
          <input className="field full" type="email" placeholder="Email" defaultValue="demo@sharebari.com" />
          <input className="field full" type="password" placeholder="Password" defaultValue="Demo1234" />
          <button className="button" type="submit">Login</button>
          <button className="button-secondary" type="button">Continue with Google</button>
          <p className="full">New here? <Link href="/register">Create an account</Link></p>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}
