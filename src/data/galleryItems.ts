export interface ExifInfo {
  camera?: string;
  lens?: string;
  focalLength?: string;
  aperture?: string;
  shutter?: string;
  iso?: string;
}

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
  aspectRatio?: '4/5' | '16/9' | '1/1' | '3/2' | '3/4';
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

export const galleryItems: GalleryItem[] = [
  {
    id: 'dawn-ridge',
    title: '胶片风花花',
    subtitle: '微观世界的植物呼吸与胶片颗粒',
    plateNumber: '№ 01',
    category: 'Nature',
    dateLabel: 'Sep 2023',
    place: 'Zhenjiang, China',
    overlayTitle: 'Flower & Grain',
    image: '/covers/spings/night.jpg',
    aspectRatio: '4/5',
    layoutSpan: 'full',
    readme: '拍摄于初秋午后。花瓣在低色温光线里透出柔和的暖调，高感光度带来的细腻颗粒赋予了静物如油画般的呼吸感与岁月质感。',
    story: '拍摄于初秋午后。花瓣在低色温光线里透出柔和的暖调，高感光度带来的细腻颗粒赋予了静物如油画般的呼吸感与岁月质感。',
    exif: {
      camera: 'Fujifilm X-T4',
      lens: 'XF 35mm F1.4 R',
      focalLength: '35mm (53mm eq.)',
      aperture: 'f/1.4',
      shutter: '1/250s',
      iso: '400',
    },
  },
  {
    id: 'paper-wave',
    title: '纸浪褶皱',
    subtitle: '光影交织下的极简纸质起伏',
    plateNumber: '№ 02',
    category: 'Minimal',
    dateLabel: 'Oct 2023',
    place: 'Studio, Shanghai',
    overlayTitle: 'Paper Texture',
    image: '/covers/gallery/paper-wave.svg',
    aspectRatio: '3/4',
    layoutSpan: 'pair',
    readme: '探索手工纸质在侧光下的层叠律动。黑白灰的明暗过渡，勾勒出纯粹的形体节奏。',
    story: '探索手工纸质在侧光下的层叠律动。黑白灰的明暗过渡，勾勒出纯粹的形体节奏。',
    exif: {
      camera: 'Sony Alpha 7 IV',
      lens: 'FE 50mm F1.2 GM',
      focalLength: '50mm',
      aperture: 'f/4.0',
      shutter: '1/125s',
      iso: '100',
    },
  },
  {
    id: 'tech-grid',
    title: '矩阵节拍',
    subtitle: '数字秩序与理性构图的几何实验',
    plateNumber: '№ 03',
    category: 'Abstract',
    dateLabel: 'Nov 2023',
    place: 'Hangzhou, China',
    overlayTitle: 'Tech Geometry',
    image: '/covers/gallery/tech-grid.svg',
    aspectRatio: '3/4',
    layoutSpan: 'pair',
    readme: '结构与线条的对齐，理性秩序中的微小变量。程序化生成的几何切片，探讨虚拟与物理空间的张力。',
    story: '结构与线条的对齐，理性秩序中的微小变量。程序化生成的几何切片，探讨虚拟与物理空间的张力。',
    exif: {
      camera: 'Leica Q2',
      lens: 'Summilux 28mm f/1.7 ASPH',
      focalLength: '28mm',
      aperture: 'f/2.8',
      shutter: '1/500s',
      iso: '200',
    },
  },
  {
    id: 'midnight-editor',
    title: '午夜终端',
    subtitle: '夜幕深处流动的信息与光斑',
    plateNumber: '№ 04',
    category: 'Nightscape',
    dateLabel: 'Dec 2023',
    place: 'Tokyo, Japan',
    overlayTitle: 'Midnight Glow',
    image: '/covers/gallery/midnight-editor.svg',
    aspectRatio: '16/9',
    layoutSpan: 'feature',
    readme: '当城市陷入沉睡，屏幕的光芒投射在工作台上，冷暖色温在此交汇。一段代码、一杯咖啡，构成了漫漫长夜的沉浸篇章。',
    story: '当城市陷入沉睡，屏幕的光芒投射在工作台上，冷暖色温在此交汇。一段代码、一杯咖啡，构成了漫漫长夜的沉浸篇章。',
    exif: {
      camera: 'Ricoh GR IIIx',
      lens: 'GR Lens 26.1mm F2.8',
      focalLength: '40mm eq.',
      aperture: 'f/2.8',
      shutter: '1/60s',
      iso: '800',
    },
  },
];

export const artVolumes: ArtVolume[] = [
  {
    volId: 'vol-01',
    volNumber: 'VOL. 01',
    title: '光影切片 · 城市与自然',
    subtitle: 'Slices of Light & Shadow: Between Urban Grid and Organic Pulse',
    year: '2023 - 2026',
    curatorNote: '本卷画集收录了穿行于城市钢铁丛林与静谧自然之间的瞬间切片。每一帧影像不仅是光线的雕刻，也是一段独属时刻的情感注脚。',
    items: galleryItems,
  },
];

