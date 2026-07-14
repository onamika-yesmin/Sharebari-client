import type { ReactNode } from "react";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  lead?: string;
  image: string;
  imageAlt: string;
  variant?: string;
  actions?: ReactNode;
  children?: ReactNode;
};

function slugifyHeroVariant(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function PageHero({ eyebrow, title, lead, image, imageAlt, variant, actions, children }: PageHeroProps) {
  const heroVariant = variant || slugifyHeroVariant(eyebrow);

  return (
    <section className={`page-hero page-hero-${heroVariant}`}>
      <span className="page-hero-float page-hero-float-one" aria-hidden="true" />
      <span className="page-hero-float page-hero-float-two" aria-hidden="true" />
      <div className="page-hero-copy">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {lead ? <p className="lead">{lead}</p> : null}
        {children}
        {actions ? <div className="hero-actions">{actions}</div> : null}
      </div>
      <div className="page-hero-media" aria-hidden="true">
        <img src={image} alt={imageAlt} />
      </div>
    </section>
  );
}
