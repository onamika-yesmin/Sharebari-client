import { DashboardClient } from "@/components/DashboardClient";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function DashboardPage() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="container">
        <section className="page-title">
          <p className="eyebrow">Protected workspace</p>
          <h1>Your dashboard.</h1>
          <p className="lead">A role-aware control room for renter activity, owner listings, availability, and pricing from live backend data.</p>
        </section>
        <DashboardClient />
      </main>
      <SiteFooter />
    </div>
  );
}
