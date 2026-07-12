import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

const steps = ["Find a nearby item", "Review price and deposit", "Confirm pickup details", "Return on time"];

export default function HowItWorksPage() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="container">
        <section className="page-title">
          <p className="eyebrow">How It Works</p>
          <h1>Rent locally in four simple steps.</h1>
        </section>
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
