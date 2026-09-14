import { parseImageExif, type ExifInfo } from '../lib/exifLoader';

export type { ExifInfo };

export interface GalleryItem {
  id: string;
  volumeId: string;
  volumeName: string;
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
  coverImage: string;
  curatorNote: string;
  items: GalleryItem[];
}

// 自动从实际图片文件中提取识别真实 EXIF 信息与拍摄时间
const [
  nightExif,
  flower1Exif,
  flower2Exif,
  suzhou1Exif,
  suzhou2Exif,
] = await Promise.all([
  parseImageExif('covers/spings/night.jpg', 'Zhenjiang, China'),
  parseImageExif('covers/spings/flower1.jpg', 'Zhenjiang, China'),
  parseImageExif('covers/spings/flower2.jpg', 'Zhenjiang, China'),
  parseImageExif('covers/gallery/SuZhou/suzhou1.jpg', 'Suzhou, China'),
  parseImageExif('covers/gallery/SuZhou/suzhou2.jpg', 'Suzhou, China'),
]);

const spingsItems: GalleryItem[] = [
  {
    id: 'spings-night',
    volumeId: 'vol-01',
    volumeName: '春影幽光 · 镇江春夜录',
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
    volumeId: 'vol-01',
    volumeName: '春影幽光 · 镇江春夜录',
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
    volumeId: 'vol-01',
    volumeName: '春影幽光 · 镇江春夜录',
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

const suzhouItems: GalleryItem[] = [
  {
    id: 'suzhou-morning',
    volumeId: 'vol-02',
    volumeName: '姑苏纪行 · 苏州江南录',
    title: '平江晨光',
    subtitle: '初夏水乡的石阶粉墙与晨间光影',
    plateNumber: '№ 01',
    category: 'Street / Jiangnan',
    dateLabel: suzhou1Exif.dateLabel,
    place: suzhou1Exif.place,
    overlayTitle: 'Pingjiang Dawn',
    image: '/covers/gallery/SuZhou/suzhou1.jpg',
    aspectRatio: '4/3',
    layoutSpan: 'full',
    readme: '清晨漫步平江路，晨光初透，水波如镜。记录下水乡石板路与粉墙黛瓦之间的静谧时光。',
    story: '清晨漫步平江路，晨光初透，水波如镜。记录下水乡石板路与粉墙黛瓦之间的静谧时光。',
    exif: suzhou1Exif.exif,
  },
  {
    id: 'suzhou-night',
    volumeId: 'vol-02',
    volumeName: '姑苏纪行 · 苏州江南录',
    title: '姑苏夜色',
    subtitle: '晚风拂过的古街灯影与深巷余韵',
    plateNumber: '№ 02',
    category: 'Night / Jiangnan',
    dateLabel: suzhou2Exif.dateLabel,
    place: suzhou2Exif.place,
    overlayTitle: 'Suzhou Dusk',
    image: '/covers/gallery/SuZhou/suzhou2.jpg',
    aspectRatio: '4/3',
    layoutSpan: 'full',
    readme: '暮色四合，红灯初上。老街游人渐稀，夜色里的苏州展现出温婉沉静的另一面。',
    story: '暮色四合，红灯初上。老街游人渐稀，夜色里的苏州展现出温婉沉静的另一面。',
    exif: suzhou2Exif.exif,
  },
];

export const galleryItems: GalleryItem[] = [...spingsItems, ...suzhouItems];

export const artVolumes: ArtVolume[] = [
  {
    volId: 'vol-01',
    volNumber: 'VOL. 01',
    title: '春影幽光 · 镇江春夜录',
    subtitle: 'Spring Monograph: Night Blossoms in Zhenjiang, 2024',
    year: '2024.04',
    coverImage: '/covers/spings/night.jpg',
    curatorNote: '本卷画集收录拍摄于 2024 年 4 月春夜的 3 帧花卉切片。在暗光与微距之间，记录植物在夜色下的细腻呼吸与色彩。',
    items: spingsItems,
  },
  {
    volId: 'vol-02',
    volNumber: 'VOL. 02',
    title: '姑苏纪行 · 苏州江南录',
    subtitle: 'Suzhou Monograph: Jiangnan Light & Streetscapes, 2024',
    year: '2024.05',
    coverImage: '/covers/gallery/SuZhou/suzhou1.jpg',
    curatorNote: '本卷画集收录 2024 年 5 月初夏的苏州光影切片。从平江路的晨光微曦到古巷夜色，记录江南水乡的建筑肌理与时光痕迹。',
    items: suzhouItems,
  },
];


