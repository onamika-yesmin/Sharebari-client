import Link from "next/link";
import { CreditCard, ShieldCheck, Star } from "lucide-react";
import Image from "next/image";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Link className="brand footer-brand" href="/">
            <Image className="site-logo-image" src="/ShareBari Dark Green.png" width={52} height={52} alt="ShareBari" />
          </Link>
          <p>Borrow useful items from nearby people and keep one-time purchases out of your budget.</p>
          <div className="footer-trust" aria-label="Marketplace trust signals">
            <span><ShieldCheck size={16} aria-hidden="true" /> Verified account flows</span>
            <span><CreditCard size={16} aria-hidden="true" /> Stripe Checkout payments</span>
            <span><Star size={16} aria-hidden="true" /> Review-led marketplace</span>
          </div>
        </div>
        <div className="footer-links">
          <strong>Marketplace</strong>
          <Link href="/explore">Explore</Link>
          <Link href="/categories">Categories</Link>
          <Link href="/items/add">Add Item</Link>
        </div>
        <div className="footer-links">
          <strong>Company</strong>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/help">Help</Link>
        </div>
        <div className="footer-links">
          <strong>Legal</strong>
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms">Terms</Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>&copy; {year} ShareBari. All rights reserved.</p>
        <p>Built for neighborhood rentals in Bangladesh.</p>
      </div>
    </footer>
  );
}
