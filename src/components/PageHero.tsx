import type { ReactNode } from "react";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  lead?: string;
  image: string;
  imageAlt: string;
  actions?: ReactNode;
  children?: ReactNode;
};

export function PageHero({ eyebrow, title, lead, image, imageAlt, actions, children }: PageHeroProps) {
  return (
    <section className="page-hero">
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
