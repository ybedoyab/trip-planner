import { ExternalLink } from "lucide-react";
import { quickLinks } from "../data/quickLinks";

export function QuickLinks() {
  return (
    <section className="quick-links-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Herramientas útiles</span>
          <h2>Accesos rápidos</h2>
        </div>
      </div>
      <div className="quick-links-grid">
        {quickLinks.map(({ label, url, icon: Icon, note }) => (
          <a key={label} href={url} target="_blank" rel="noreferrer" className="quick-link-card">
            <Icon size={20} />
            <div>
              <strong>{label}</strong>
              <small>{note}</small>
            </div>
            <ExternalLink size={14} />
          </a>
        ))}
      </div>
    </section>
  );
}
