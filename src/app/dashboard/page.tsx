import { DashboardClient } from "@/components/DashboardClient";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function DashboardPage() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="container">
        <section className="page-title">
          <p className="eyebrow">Protected</p>
          <h1>Dashboard.</h1>
          <p className="lead">Track your own listings, availability, and pricing from live backend data.</p>
        </section>
        <DashboardClient />
      </main>
      <SiteFooter />
    </div>
  );
}
