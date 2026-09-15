import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';

export interface SiteConfig {
  site: {
    name: string;
    title: string;
    description: string;
    url: string;
    slogan?: string;
  };
  author: {
    name: string;
    bio: string;
    avatar: string;
    email: string;
    github: string;
  };
  nav: Array<{
    label: string;
    href: string;
  }>;
  footer: {
    copyright: string;
    desc: string;
  };
}

const configFilePath = path.join(process.cwd(), 'config.yaml');
let configContent = '';

try {
  if (fs.existsSync(configFilePath)) {
    configContent = fs.readFileSync(configFilePath, 'utf-8');
  }
} catch (e) {
  console.warn('Failed to read config.yaml:', e);
}

const parsedConfig = configContent ? YAML.parse(configContent) : {};

export const siteConfig: SiteConfig = {
  site: {
    name: parsedConfig?.site?.name || "Marinus's Blog",
    title: parsedConfig?.site?.title || "Marinus's Blog",
    description:
      parsedConfig?.site?.description ||
      '记录技术、设计与审美的交叉点。分享前端工程化、排版与生活日常。',
    url: parsedConfig?.site?.url || 'https://marinus-blog.pages.dev',
    slogan:
      parsedConfig?.site?.slogan ||
      '记录技术、设计与审美的交叉点。\n分享前端工程化、排版与生活日常。',
  },
  author: {
    name: parsedConfig?.author?.name || 'Marinus',
    bio: parsedConfig?.author?.bio || '记录代码留下的痕迹，思考设计在工程中的边界。',
    avatar: parsedConfig?.author?.avatar || '/avatar.jpg',
    email: parsedConfig?.author?.email || 'marinusCr@outlook.com',
    github: parsedConfig?.author?.github || 'https://github.com/M-Crowe',
  },
  nav: parsedConfig?.nav || [
    { label: '首页', href: '/' },
    { label: '画集', href: '/gallery' },
    { label: '归档', href: '/archive' },
    { label: '关于', href: '/about' },
  ],
  footer: {
    copyright:
      parsedConfig?.footer?.copyright ||
      "© 2026 Marinus's Blog. Built with Astro & Pretext.",
    desc: parsedConfig?.footer?.desc || '记录技术、设计与生活的美好时刻。',
  },
};

export default siteConfig;
