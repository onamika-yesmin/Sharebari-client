import { DashboardClient } from "@/components/DashboardClient";
import { PageHero } from "@/components/PageHero";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function DashboardPage() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="container">
        <PageHero
          eyebrow="Protected workspace"
          title="Your dashboard."
          lead="A role-aware control room for renter activity, owner listings, availability, and pricing from live backend data."
          image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80"
          imageAlt="Marketplace dashboard on a laptop"
        />
        <DashboardClient />
      </main>
      <SiteFooter />
    </div>
  );
}
