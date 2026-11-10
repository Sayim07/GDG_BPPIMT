import * as React from "react";

export function TechDomainIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <line x1="2" y1="20" x2="22" y2="20" />
      <path d="m8 9 2.5 2.5L8 14" />
      <line x1="12" y1="14" x2="15" y2="14" />
    </svg>
  );
}

export function AimlDomainIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4" y="4" width="16" height="16" rx="2.5" />
      <rect x="8.5" y="8.5" width="7" height="7" rx="1.5" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M7 2v2M7 20v2M17 2v2M17 20v2M2 7h2M20 7h2M2 17h2M20 17h2" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function CloudDomainIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
      <path d="M12 13v5M9.5 15.5L12 13l2.5 2.5" />
    </svg>
  );
}

export function DesignDomainIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="14" height="16" rx="2" />
      <line x1="6" y1="8" x2="6.01" y2="8" strokeWidth="2.5" />
      <line x1="6" y1="12" x2="6.01" y2="12" strokeWidth="2.5" />
      <line x1="6" y1="16" x2="6.01" y2="16" strokeWidth="2.5" />
      <line x1="9" y1="4" x2="9" y2="20" strokeWidth="1.5" />
      <path d="m14 14 6-6 2 2-6 6-2.5.5.5-2.5Z" />
    </svg>
  );
}

export function ManagementDomainIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export function MarketingDomainIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="11" y="9" width="3" height="10" rx="1" />
      <rect x="16" y="5" width="3" height="14" rx="1" />
      <rect x="6" y="13" width="3" height="6" rx="1" />
      <path d="m4 10 4-4 5 5 6-6" />
      <path d="M15 5h4v4" />
    </svg>
  );
}

export function TeamsClusterIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <circle cx="5" cy="13" r="3" />
      <circle cx="12" cy="8.5" r="4" />
      <circle cx="19" cy="13" r="3" />
    </svg>
  );
}

