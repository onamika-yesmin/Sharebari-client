import { PageHero } from "@/components/PageHero";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

const steps = ["Find a nearby item", "Review price and deposit", "Confirm pickup details", "Return on time"];

export default function HowItWorksPage() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="container">
        <PageHero
          eyebrow="How It Works"
          title="Rent locally in four simple steps."
          lead="Find the right item, confirm the details, pay securely, and return it on time."
          image="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&w=1400&q=80"
          imageAlt="People reviewing a rental agreement"
        />
        <section className="grid grid-4">
          {steps.map((step, index) => (
            <div className="card" key={step}>
              <span className="badge">Step {index + 1}</span>
              <h3>{step}</h3>
              <p>ShareBari keeps the workflow clear for both renters and owners.</p>
            </div>
          ))}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
