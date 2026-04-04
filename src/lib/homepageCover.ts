export type CoverSeason = 'spring' | 'summer' | 'autumn' | 'winter';
export type CoverMoment = 'morning' | 'noon' | 'evening' | 'night';

export interface CoverVariant {
  season: CoverSeason;
  moment: CoverMoment;
  label: string;
  title: string;
  subtitle: string;
  imageUrl: string;
}

export interface CoverSnapshot {
  localTime: string;
  gregorianDate: string;
  lunarDate: string;
  seasonLabel: string;
  momentLabel: string;
}

export const homepageCoverConfig = {
  mode: 'auto' as 'auto' | 'manual',
  manualCover: '/covers/spings/night.jpg',
  manualLabel: 'Night Cover',
};

const seasonLabels: Record<CoverSeason, string> = {
  spring: '春',
  summer: '夏',
  autumn: '秋',
  winter: '冬',
};

const momentLabels: Record<CoverMoment, string> = {
  morning: '清晨',
  noon: '正午',
  evening: '傍晚',
  night: '夜晚',
};

const seasonPalettes: Record<
  CoverSeason,
  {
    base: string;
    panel: string;
    glowA: string;
    glowB: string;
    accent: string;
  }
> = {
  spring: { base: '#f4efe7', panel: '#fef8ef', glowA: '#ffd9a8', glowB: '#8be0bf', accent: '#ff8d6b' },
  summer: { base: '#e9f5f2', panel: '#f6fffd', glowA: '#8be7ff', glowB: '#68d39b', accent: '#3eb7f3' },
  autumn: { base: '#f6efe5', panel: '#fff7ed', glowA: '#ffbd7a', glowB: '#d89a5f', accent: '#e06a3e' },
  winter: { base: '#eceff7', panel: '#f8fbff', glowA: '#b7d5ff', glowB: '#8cb3f7', accent: '#6b7cf2' },
};

const momentPalettes: Record<
  CoverMoment,
  {
    tint: string;
    shadow: string;
    line: string;
  }
> = {
  morning: { tint: 'rgba(255, 255, 255, 0.28)', shadow: 'rgba(255, 197, 132, 0.22)', line: 'rgba(255, 255, 255, 0.56)' },
  noon: { tint: 'rgba(255, 255, 255, 0.18)', shadow: 'rgba(73, 178, 255, 0.2)', line: 'rgba(255, 255, 255, 0.45)' },
  evening: { tint: 'rgba(255, 255, 255, 0.14)', shadow: 'rgba(255, 143, 102, 0.24)', line: 'rgba(255, 255, 255, 0.38)' },
  night: { tint: 'rgba(255, 255, 255, 0.1)', shadow: 'rgba(47, 62, 120, 0.26)', line: 'rgba(255, 255, 255, 0.32)' },
};

function getSeason(date: Date): CoverSeason {
  const month = date.getMonth();

  if (month >= 2 && month <= 4) {
    return 'spring';
  }

  if (month >= 5 && month <= 7) {
    return 'summer';
  }

  if (month >= 8 && month <= 10) {
    return 'autumn';
  }

  return 'winter';
}

function getMoment(date: Date): CoverMoment {
  const hour = date.getHours();

  if (hour >= 5 && hour < 11) {
    return 'morning';
  }

  if (hour >= 11 && hour < 16) {
    return 'noon';
  }

  if (hour >= 16 && hour < 20) {
    return 'evening';
  }

  return 'night';
}

function buildCoverSvg(season: CoverSeason, moment: CoverMoment) {
  const seasonPalette = seasonPalettes[season];
  const momentPalette = momentPalettes[moment];
  const seasonLabel = seasonLabels[season];
  const momentLabel = momentLabels[moment];
  const title = `${seasonLabel}${momentLabel}`;
  const subtitle = `${seasonLabel}季的${momentLabel}`;

  const svg = `
    <svg width="1200" height="1400" viewBox="0 0 1200 1400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="1400" gradientUnits="userSpaceOnUse">
          <stop stop-color="${seasonPalette.base}"/>
          <stop offset="0.55" stop-color="${seasonPalette.panel}"/>
          <stop offset="1" stop-color="${seasonPalette.base}"/>
        </linearGradient>
        <linearGradient id="glowA" x1="150" y1="150" x2="860" y2="860" gradientUnits="userSpaceOnUse">
          <stop stop-color="${seasonPalette.glowA}" stop-opacity="0.95"/>
          <stop offset="1" stop-color="${seasonPalette.accent}" stop-opacity="0.15"/>
        </linearGradient>
        <linearGradient id="glowB" x1="300" y1="520" x2="980" y2="1160" gradientUnits="userSpaceOnUse">
          <stop stop-color="${seasonPalette.glowB}" stop-opacity="0.95"/>
          <stop offset="1" stop-color="${momentPalette.shadow}" stop-opacity="0.7"/>
        </linearGradient>
        <filter id="blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="42"/>
        </filter>
      </defs>

      <rect width="1200" height="1400" fill="url(#bg)"/>
      <circle cx="310" cy="300" r="250" fill="url(#glowA)" filter="url(#blur)"/>
      <circle cx="885" cy="980" r="280" fill="url(#glowB)" filter="url(#blur)"/>
      <circle cx="960" cy="260" r="118" fill="${momentPalette.tint}"/>
      <circle cx="780" cy="410" r="40" fill="${momentPalette.line}"/>
      <circle cx="1030" cy="650" r="72" fill="${momentPalette.tint}"/>

      <path d="M0 1060C190 930 320 860 490 900C650 940 720 1080 910 1110C1040 1130 1130 1105 1200 1068V1400H0V1060Z" fill="${momentPalette.shadow}" fill-opacity="0.28"/>
      <path d="M0 1140C210 1000 350 950 510 980C690 1010 760 1170 970 1200C1080 1215 1140 1192 1200 1168V1400H0V1140Z" fill="${momentPalette.tint}"/>

      <g opacity="0.9">
        <rect x="112" y="102" width="976" height="116" rx="58" fill="${momentPalette.tint}"/>
        <rect x="112" y="254" width="784" height="28" rx="14" fill="${momentPalette.line}"/>
        <rect x="112" y="300" width="610" height="28" rx="14" fill="${momentPalette.line}" fill-opacity="0.78"/>
        <rect x="112" y="346" width="690" height="28" rx="14" fill="${momentPalette.line}" fill-opacity="0.66"/>
      </g>

      <g>
        <rect x="112" y="520" width="228" height="228" rx="44" fill="${momentPalette.tint}"/>
        <rect x="372" y="520" width="228" height="228" rx="44" fill="${momentPalette.shadow}" fill-opacity="0.18"/>
        <rect x="632" y="520" width="456" height="228" rx="44" fill="${momentPalette.tint}"/>
      </g>

      <circle cx="292" cy="634" r="58" fill="${seasonPalette.accent}" fill-opacity="0.9"/>
      <circle cx="430" cy="634" r="58" fill="${seasonPalette.glowA}" fill-opacity="0.9"/>
      <circle cx="550" cy="634" r="58" fill="${seasonPalette.glowB}" fill-opacity="0.88"/>

      <text x="112" y="910" fill="#111111" fill-opacity="0.9" font-family="Inter, Arial, sans-serif" font-size="88" font-weight="700" letter-spacing="-4">${title}</text>
      <text x="112" y="1006" fill="#111111" fill-opacity="0.62" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="500">${subtitle}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function getCoverVariant(date = new Date()): CoverVariant {
  const season = getSeason(date);
  const moment = getMoment(date);

  return {
    season,
    moment,
    label: `${seasonLabels[season]} · ${momentLabels[moment]}`,
    title: `${seasonLabels[season]}${momentLabels[moment]}`,
    subtitle: `${seasonLabels[season]}季的${momentLabels[moment]}`,
    imageUrl: buildCoverSvg(season, moment),
  };
}

export function getCoverSnapshot(date = new Date()): CoverSnapshot {
  const timeFormatter = new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const dateFormatter = new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  const lunarFormatter = new Intl.DateTimeFormat('zh-CN-u-ca-chinese', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const season = getSeason(date);
  const moment = getMoment(date);

  return {
    localTime: timeFormatter.format(date),
    gregorianDate: dateFormatter.format(date),
    lunarDate: lunarFormatter.format(date),
    seasonLabel: seasonLabels[season],
    momentLabel: momentLabels[moment],
  };
}
