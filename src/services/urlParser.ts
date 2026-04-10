export interface PlatformInfo {
  name: string;
  icon: string;
  color: string;
  domain: string;
}

const PLATFORMS: Record<string, PlatformInfo> = {
  instagram: {
    name: 'Instagram',
    icon: '📸',
    color: '#E1306C',
    domain: 'instagram.com',
  },
  twitter: {
    name: 'Twitter / X',
    icon: '🐦',
    color: '#1DA1F2',
    domain: 'twitter.com',
  },
  x: {
    name: 'Twitter / X',
    icon: '🐦',
    color: '#1DA1F2',
    domain: 'x.com',
  },
  facebook: {
    name: 'Facebook',
    icon: '📘',
    color: '#1877F2',
    domain: 'facebook.com',
  },
  tiktok: {
    name: 'TikTok',
    icon: '🎵',
    color: '#ff0050',
    domain: 'tiktok.com',
  },
  linkedin: {
    name: 'LinkedIn',
    icon: '💼',
    color: '#0A66C2',
    domain: 'linkedin.com',
  },
  youtube: {
    name: 'YouTube',
    icon: '▶️',
    color: '#FF0000',
    domain: 'youtube.com',
  },
};

export interface ParseResult {
  platform: PlatformInfo | null;
  username: string | null;
  isValid: boolean;
}

export function parseProfileUrl(url: string): ParseResult {
  const trimmed = url.trim();

  if (!trimmed) {
    return { platform: null, username: null, isValid: false };
  }

  // Normalise: add https:// if missing
  let normalised = trimmed;
  if (!/^https?:\/\//i.test(normalised)) {
    normalised = 'https://' + normalised;
  }

  try {
    const parsed = new URL(normalised);
    const hostname = parsed.hostname.replace(/^www\./, '').toLowerCase();

    // Find matching platform
    for (const [, info] of Object.entries(PLATFORMS)) {
      if (hostname.includes(info.domain)) {
        // Extract username from path
        const pathParts = parsed.pathname
          .split('/')
          .filter((p) => p && p !== 'in' && p !== 'channel');
        const username = pathParts[0]?.replace('@', '') || null;

        return {
          platform: info,
          username,
          isValid: !!username,
        };
      }
    }
  } catch {
    // Not a valid URL
  }

  return { platform: null, username: null, isValid: false };
}
