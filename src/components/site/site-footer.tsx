import { Link, type LinkProps } from "@tanstack/react-router";
import { Mail, Phone, Linkedin, Youtube, Facebook, Instagram } from "lucide-react";

import { company, footerColumns } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="relative border-t border-border bg-navy-deep">
      <div className="container-page py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_2fr]">
          <div className="min-w-0">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/images/brand/CSG.png"
                alt="CSG"
                className="h-10 w-auto shrink-0 object-contain [filter:invert(100%)_sepia(33%)_saturate(130%)_hue-rotate(41deg)_brightness(105%)]"
                loading="lazy"
                decoding="async"
              />
              <span className="font-display text-base font-semibold">Career Source Group</span>
            </Link>
            <p className="mt-5 max-w-sm footer-text text-muted-foreground">
              Career Source Group is a technology staffing and talent delivery company headquartered
              in Alpharetta, Georgia. We help US companies hire AI, Data, Cloud, Software, Product
              and GRC professionals across the United States, LATAM and Pakistan.
            </p>
            <div className="mt-7 space-y-3">
              <p className="footer-text text-muted-foreground">
                Headquartered in Alpharetta, Georgia | Serving clients across the United States
              </p>
              <a
                href={company.phoneHref}
                className="footer-text flex items-center gap-3 text-muted-foreground transition-colors hover:text-foreground"
              >
                <Phone className="h-4 w-4 shrink-0 text-gold" />
                {company.phone}
              </a>
              <a
                href={`mailto:${company.email}`}
                className="footer-text flex items-center gap-3 text-muted-foreground transition-colors hover:text-foreground"
              >
                <Mail className="h-4 w-4 shrink-0 text-gold" />
                {company.email}
              </a>
            </div>
          </div>

          <div className="grid gap-8 sm:gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {footerColumns.map((col) => (
              <div key={col.title} className="min-w-0">
                <h3 className="eyebrow">{col.title}</h3>
                <ul className="mt-5 space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to as Exclude<LinkProps["to"], undefined>}
                        className="footer-text text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 border-t border-border pt-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-7">
            <div className="flex flex-col gap-2">
              <p className="caption-text text-muted-foreground">
                © {new Date().getFullYear()} {company.legalName}. All rights reserved.
              </p>
              <p className="caption-text text-gold font-semibold">Powered by AJ</p>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 caption-text text-muted-foreground">
              <Link to="/legal-notice" className="hover:text-foreground">
                Legal Notice
              </Link>
              <Link to="/privacy" className="hover:text-foreground">
                Privacy Policy
              </Link>
            </div>
          </div>

          {(company.social.linkedin ||
            company.social.youtube ||
            company.social.facebook ||
            company.social.instagram) && (
            <div className="flex flex-wrap items-center gap-4">
              {company.social.linkedin && (
                <a
                  href={company.social.linkedin}
                  rel="noopener noreferrer"
                  target="_blank"
                  aria-label="Career Source Group on LinkedIn"
                  className="text-muted-foreground transition-colors hover:text-gold"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
              {company.social.youtube && (
                <a
                  href={company.social.youtube}
                  rel="noopener noreferrer"
                  target="_blank"
                  aria-label="Career Source Group on YouTube"
                  className="text-muted-foreground transition-colors hover:text-gold"
                >
                  <Youtube className="h-5 w-5" />
                </a>
              )}
              {company.social.facebook && (
                <a
                  href={company.social.facebook}
                  rel="noopener noreferrer"
                  target="_blank"
                  aria-label="Career Source Group on Facebook"
                  className="text-muted-foreground transition-colors hover:text-gold"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {company.social.instagram && (
                <a
                  href={company.social.instagram}
                  rel="noopener noreferrer"
                  target="_blank"
                  aria-label="Career Source Group on Instagram"
                  className="text-muted-foreground transition-colors hover:text-gold"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
