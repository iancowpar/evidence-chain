import {
  BookOpenCheck,
  ClipboardList,
  GitBranch,
  Layers3,
  PackageCheck,
} from "lucide-react";

const navItems = [
  { label: "Evidence", icon: GitBranch },
  { label: "Signals", icon: ClipboardList },
  { label: "Triad", icon: Layers3 },
  { label: "Decision", icon: BookOpenCheck },
  { label: "Ship Log", icon: PackageCheck },
];

export function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Evidence Chain navigation">
      <div className="brand-lockup">
        <span className="brand-mark">
          <GitBranch size={20} aria-hidden="true" />
        </span>
        <div>
          <strong>Evidence Chain</strong>
          <span>From raw signal to shipped product decision.</span>
        </div>
      </div>

      <nav className="nav-list">
        {navItems.map((item) => (
          <a key={item.label} href={`#${item.label.toLowerCase().replace(" ", "-")}`}>
            <item.icon size={17} aria-hidden="true" />
            {item.label}
          </a>
        ))}
      </nav>

      <div className="sidebar-card">
        <span className="eyebrow">Operating Model</span>
        <p>
          Product owns outcomes and scope. Design owns clarity and tone.
          Engineering owns reliability and state.
        </p>
      </div>
    </aside>
  );
}
