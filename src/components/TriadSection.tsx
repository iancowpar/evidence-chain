import { BadgeCheck, ShieldCheck, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import type { Pattern } from "../store";

export function TriadSection({ pattern }: { pattern: Pattern }) {
  return (
    <section id="triad" className="section-grid">
      <div className="section-header">
        <div>
          <span className="eyebrow">Product Triad</span>
          <h2>Review</h2>
        </div>
        <p>{pattern.opportunityStatement}</p>
      </div>

      <div className="triad-grid">
        <TriadCard
          icon={<BadgeCheck size={18} />}
          title="Product"
          subtitle="Outcomes + Scope"
          items={[pattern.triadReview.productOutcome, pattern.triadReview.scopeFit]}
        />
        <TriadCard
          icon={<Sparkles size={18} />}
          title="Design"
          subtitle="Clarity + Tone"
          items={[pattern.triadReview.designFriction, pattern.triadReview.toneRisk]}
        />
        <TriadCard
          icon={<ShieldCheck size={18} />}
          title="Engineering"
          subtitle="Reliability + State"
          items={[
            pattern.triadReview.engineeringRisk,
            pattern.triadReview.stateReliabilityConcern,
          ]}
        />
      </div>
    </section>
  );
}

function TriadCard({
  icon,
  title,
  subtitle,
  items,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
  items: string[];
}) {
  return (
    <article className="triad-card">
      <div className="triad-title">
        <span>{icon}</span>
        <div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
      </div>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}
