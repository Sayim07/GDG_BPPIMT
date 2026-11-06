export interface ChapterConfig {
  name: string;
  chapterName: string;
  chapterId: string;
  badge?: string;
  headline: string;
  subtitle?: string;
  primaryCtaText?: string;
  primaryCtaUrl?: string;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
  communityUrl: string;
  socials: {
    discord?: string;
    whatsapp?: string;
    linkedin?: string;
    github?: string;
  };
}

export interface StatItem {
  label: string;
  value: string;
}

export interface PillarItem {
  id: string;
  title: string;
  description: string;
  ctaText?: string;
  icon?: "connect" | "learn" | "grow";
  accentColor?: "blue" | "red" | "green";
}

export interface TrackItem {
  id: string;
  title: string;
  description: string;
  icon?: "cloud" | "ai" | "mobile" | "security";
  accentColor?: "blue" | "red" | "yellow" | "green";
  tags?: string[];
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  month: string;
  day: string;
  location: string;
  mode: "in-person" | "virtual" | "hybrid";
  domainId?: string;
  seats?: string;
  rsvpUrl: string;
  status: "upcoming" | "past";
  tags?: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  tagline?: string;
  avatarUrl?: string;
  badgeColor?: "blue" | "red" | "yellow" | "green";
  socials?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
}
