import Link from "next/link";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore Items" },
  { href: "/categories", label: "Categories" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="header">
      <nav className="container nav" aria-label="Main navigation">
        <Link className="brand" href="/">
          ShareBari
          <span>Borrow Nearby. Save More.</span>
        </Link>
        <div className="nav-links">
          {publicLinks.map((link) => (
            <Link href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
          <Link className="button-ghost" href="/login">Login</Link>
          <Link className="button" href="/register">Register</Link>
        </div>
      </nav>
    </header>
  );
}
