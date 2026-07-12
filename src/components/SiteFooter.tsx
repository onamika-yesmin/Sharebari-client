import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <h3>ShareBari</h3>
          <p>Borrow useful items from nearby people and keep one-time purchases out of your budget.</p>
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
    </footer>
  );
}
