import { PageHero } from "@/components/PageHero";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

const faqs = [
  ["Can guests browse items?", "Yes. Public listings and item details are visible before login."],
  ["When do renters see owner contact?", "Owner phone and email are shown after authentication."],
  ["Does the frontend decide payment totals?", "No. The server will recalculate totals from trusted item data."],
  ["Can owners delete any listing?", "No. The server will verify JWT identity and ownership first."],
];

export default function HelpPage() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="container">
        <PageHero
          eyebrow="Help"
          title="Frequently asked questions."
          lead="Quick answers for renters, owners, payments, and listing safety."
          image="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1400&q=80"
          imageAlt="Desk with notes and support documents"
        />
        <section className="grid grid-2">
          {faqs.map(([question, answer]) => (
            <div className="card" key={question}>
              <h3>{question}</h3>
              <p>{answer}</p>
            </div>
          ))}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
