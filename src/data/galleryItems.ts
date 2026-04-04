export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  dateLabel: string;
  place: string;
  overlayTitle?: string;
  image: string;
  readme?: string;
}

export const galleryItems: GalleryItem[] = [
  {
    id: 'dawn-ridge',
    title: '胶片风花花',
    category: 'Nature',
    dateLabel: 'Sep 2023',
    place: 'Zhenjiang, China',
    overlayTitle: 'Flower',
    image: '/covers/spings/night.jpg',
    readme: '花花',
  },
];
