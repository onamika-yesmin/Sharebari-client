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
        <section className="page-title">
          <p className="eyebrow">Help</p>
          <h1>Frequently asked questions.</h1>
        </section>
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
