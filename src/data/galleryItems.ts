import { parseImageExif, type ExifInfo } from '../lib/exifLoader';

export type { ExifInfo };

export interface GalleryItem {
  id: string;
  title: string;
  subtitle?: string;
  plateNumber: string;
  category: string;
  dateLabel: string;
  place: string;
  overlayTitle?: string;
  image: string;
  aspectRatio?: '4/5' | '16/9' | '1/1' | '3/2' | '3/4' | '4/3';
  layoutSpan?: 'full' | 'pair' | 'feature' | 'standard';
  readme?: string;
  story?: string;
  exif?: ExifInfo;
}

export interface ArtVolume {
  volId: string;
  volNumber: string;
  title: string;
  subtitle: string;
  year: string;
  curatorNote: string;
  items: GalleryItem[];
}

// 自动从实际图片文件中提取识别真实 EXIF 信息与拍摄时间
const [nightExif, flower1Exif, flower2Exif] = await Promise.all([
  parseImageExif('covers/spings/night.jpg', 'Zhenjiang, China'),
  parseImageExif('covers/spings/flower1.jpg', 'Zhenjiang, China'),
  parseImageExif('covers/spings/flower2.jpg', 'Zhenjiang, China'),
]);

export const galleryItems: GalleryItem[] = [
  {
    id: 'spings-night',
    title: '夜色幽微',
    subtitle: '暗光微澜与春夜里的花卉呼吸',
    plateNumber: '№ 01',
    category: 'Night / Blossom',
    dateLabel: nightExif.dateLabel,
    place: nightExif.place,
    overlayTitle: 'Night Blossom',
    image: '/covers/spings/night.jpg',
    aspectRatio: '3/4',
    layoutSpan: 'full',
    readme: '拍摄于江苏镇江春日夜晚。在暗光微距下，花瓣在夜幕中透出温润的质感，高感光度呈现出丰富的夜色氛围。',
    story: '拍摄于江苏镇江春日夜晚。在暗光微距下，花瓣在夜幕中透出温润的质感，高感光度呈现出丰富的夜色氛围。',
    exif: nightExif.exif,
  },
  {
    id: 'spings-flower-1',
    title: '春野初绽 · 序',
    subtitle: '微距视角下的花簇与柔和散景',
    plateNumber: '№ 02',
    category: 'Spring / Flora',
    dateLabel: flower1Exif.dateLabel,
    place: flower1Exif.place,
    overlayTitle: 'Spring Petals I',
    image: '/covers/spings/flower1.jpg',
    aspectRatio: '4/3',
    layoutSpan: 'pair',
    readme: '微距记录花瓣在侧光下的层叠轮廓与柔美散景，低照度下呈现纯粹的花卉形体。',
    story: '微距记录花瓣在侧光下的层叠轮廓与柔美散景，低照度下呈现纯粹的花卉形体。',
    exif: flower1Exif.exif,
  },
  {
    id: 'spings-flower-2',
    title: '春野初绽 · 续',
    subtitle: '花芯脉络与枝叶间的光线流动',
    plateNumber: '№ 03',
    category: 'Spring / Flora',
    dateLabel: flower2Exif.dateLabel,
    place: flower2Exif.place,
    overlayTitle: 'Spring Petals II',
    image: '/covers/spings/flower2.jpg',
    aspectRatio: '4/3',
    layoutSpan: 'pair',
    readme: '近距离捕捉花芯细节与色彩交织，低 ISO 带来清爽干净的画质细节。',
    story: '近距离捕捉花芯细节与色彩交织，低 ISO 带来清爽干净的画质细节。',
    exif: flower2Exif.exif,
  },
];

export const artVolumes: ArtVolume[] = [
  {
    volId: 'vol-01',
    volNumber: 'VOL. 01',
    title: '春影微光 · 镇江春夜录',
    subtitle: 'Spring Monograph: Night Blossoms in Zhenjiang, 2024',
    year: '2024',
    curatorNote: '本卷画集仅收录拍摄于 2024 年 4 月春夜的 3 帧花卉切片。在暗光与微距之间，记录植物在夜色下的细腻呼吸与色彩。',
    items: galleryItems,
  },
];


