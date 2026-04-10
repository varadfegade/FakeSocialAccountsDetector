import { parseProfileUrl, type PlatformInfo } from './urlParser';

/* ---- Types ---- */
export interface AnalysisMetric {
  label: string;
  value: string;
  score: number; // 0-100
  icon: string;
  description: string;
}

export type RiskLevel = 'safe' | 'suspicious' | 'fake';

export interface AnalysisResult {
  platform: PlatformInfo;
  username: string;
  trustScore: number; // 0-100
  riskLevel: RiskLevel;
  metrics: AnalysisMetric[];
  summary: string;
  recommendation: string;
  analyzedAt: Date;
}

/* ---- Helpers ---- */
function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getRiskLevel(score: number): RiskLevel {
  if (score >= 70) return 'safe';
  if (score >= 40) return 'suspicious';
  return 'fake';
}

function getSummary(riskLevel: RiskLevel, username: string): string {
  switch (riskLevel) {
    case 'safe':
      return `The account @${username} shows strong indicators of authenticity. Profile activity, engagement patterns, and account history are consistent with a genuine user.`;
    case 'suspicious':
      return `The account @${username} shows some red flags that may indicate suspicious activity. Further manual review is recommended before interacting.`;
    case 'fake':
      return `The account @${username} shows multiple indicators commonly associated with fake or bot accounts. Exercise extreme caution when interacting with this profile.`;
  }
}

function getRecommendation(riskLevel: RiskLevel): string {
  switch (riskLevel) {
    case 'safe':
      return 'This profile appears legitimate. You can interact with confidence, but always stay vigilant.';
    case 'suspicious':
      return 'Proceed with caution. Verify the account through other channels before sharing personal information or engaging in transactions.';
    case 'fake':
      return 'We strongly recommend avoiding interaction with this account. Consider reporting it to the platform for review.';
  }
}

/* ---- Mock Analysis Engine ---- */
function generateMetrics(username: string): { metrics: AnalysisMetric[]; overallScore: number } {
  // Seed the randomness with the username so same username gives same results
  const hash = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const bias = (hash % 100) / 100; // 0-1 value unique to username

  const profileAgeScore = Math.min(100, randomBetween(20, 60) + Math.floor(bias * 50));
  const followerRatioScore = Math.min(100, randomBetween(15, 55) + Math.floor(bias * 50));
  const postFrequencyScore = Math.min(100, randomBetween(25, 65) + Math.floor(bias * 40));
  const bioCompletenessScore = Math.min(100, randomBetween(30, 70) + Math.floor(bias * 35));
  const profilePicScore = Math.min(100, randomBetween(20, 60) + Math.floor(bias * 45));
  const engagementScore = Math.min(100, randomBetween(10, 50) + Math.floor(bias * 55));

  const metrics: AnalysisMetric[] = [
    {
      label: 'Profile Age',
      value: profileAgeScore > 60 ? '2+ years' : profileAgeScore > 35 ? '3-12 months' : '< 3 months',
      score: profileAgeScore,
      icon: '📅',
      description: 'Older accounts are generally more trustworthy. New accounts created recently may be suspicious.',
    },
    {
      label: 'Follower / Following Ratio',
      value:
        followerRatioScore > 60
          ? 'Healthy ratio'
          : followerRatioScore > 35
          ? 'Slightly imbalanced'
          : 'Highly imbalanced',
      score: followerRatioScore,
      icon: '👥',
      description: 'A balanced follower-to-following ratio suggests organic growth. Extreme imbalances may indicate bot activity.',
    },
    {
      label: 'Posting Frequency',
      value:
        postFrequencyScore > 60
          ? 'Regular activity'
          : postFrequencyScore > 35
          ? 'Irregular posting'
          : 'Mass posting detected',
      score: postFrequencyScore,
      icon: '📝',
      description: 'Consistent posting patterns suggest genuine activity. Burst posting or no activity can be red flags.',
    },
    {
      label: 'Bio Completeness',
      value:
        bioCompletenessScore > 60
          ? 'Detailed bio'
          : bioCompletenessScore > 35
          ? 'Partial bio'
          : 'Empty or generic bio',
      score: bioCompletenessScore,
      icon: '📋',
      description: 'Complete profiles with bio, links, and details indicate real users. Empty profiles are often fake.',
    },
    {
      label: 'Profile Picture Analysis',
      value:
        profilePicScore > 60
          ? 'Original photo'
          : profilePicScore > 35
          ? 'Stock-like image'
          : 'Default or AI-generated',
      score: profilePicScore,
      icon: '🖼️',
      description: 'Original photos are a strong authenticity indicator. Stock images or AI-generated avatars are common in fake accounts.',
    },
    {
      label: 'Engagement Rate',
      value:
        engagementScore > 60
          ? 'Healthy engagement'
          : engagementScore > 35
          ? 'Low engagement'
          : 'Suspicious engagement',
      score: engagementScore,
      icon: '💬',
      description: 'Genuine accounts show organic engagement. Fake accounts often have inflated followers but minimal real interaction.',
    },
  ];

  const overallScore = Math.round(
    metrics.reduce((sum, m) => sum + m.score, 0) / metrics.length
  );

  return { metrics, overallScore };
}

/* ---- Public API ---- */
export async function analyzeProfile(url: string): Promise<AnalysisResult> {
  const parsed = parseProfileUrl(url);

  if (!parsed.isValid || !parsed.platform || !parsed.username) {
    throw new Error('Invalid profile URL. Please enter a valid social media profile link.');
  }

  // Simulate API processing time
  await delay(randomBetween(1800, 3200));

  const { metrics, overallScore } = generateMetrics(parsed.username);
  const riskLevel = getRiskLevel(overallScore);

  return {
    platform: parsed.platform,
    username: parsed.username,
    trustScore: overallScore,
    riskLevel,
    metrics,
    summary: getSummary(riskLevel, parsed.username),
    recommendation: getRecommendation(riskLevel),
    analyzedAt: new Date(),
  };
}
