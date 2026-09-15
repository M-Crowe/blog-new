import exifr from 'exifr';
import path from 'node:path';
import fs from 'node:fs';

export interface ExifInfo {
  camera?: string;
  lens?: string;
  focalLength?: string;
  aperture?: string;
  shutter?: string;
  iso?: string;
}

export interface ImageExifResult {
  exif: ExifInfo;
  dateLabel: string;
  place: string;
  width?: number;
  height?: number;
}

const formatShutter = (exposureTime?: number): string => {
  if (!exposureTime) return '-';
  if (exposureTime >= 1) return `${exposureTime}s`;
  const denominator = Math.round(1 / exposureTime);
  return `1/${denominator}s`;
};

const formatAperture = (fNumber?: number): string => {
  if (!fNumber) return '-';
  return `f/${Number(fNumber.toFixed(2))}`;
};

export async function parseImageExif(
  relativePathFromPublic: string,
  defaultPlace = 'Zhenjiang, China'
): Promise<ImageExifResult> {
  // Normalize leading slash
  const cleanRelPath = relativePathFromPublic.startsWith('/')
    ? relativePathFromPublic.slice(1)
    : relativePathFromPublic;
  const filePath = path.join(process.cwd(), 'public', cleanRelPath);

  if (!fs.existsSync(filePath)) {
    return {
      exif: {
        camera: '-',
        lens: '-',
        focalLength: '-',
        aperture: '-',
        shutter: '-',
        iso: '-',
      },
      dateLabel: '-',
      place: defaultPlace,
    };
  }

  try {
    const data = await exifr.parse(filePath, true);
    const camera = data?.Model
      ? `${data?.Make && !data.Model.includes(data.Make) ? data.Make + ' ' : ''}${data.Model}`.trim()
      : (data?.Make || '-');
    const lens = data?.LensModel || data?.LensMake || '-';
    const focalLength = data?.FocalLengthIn35mmFormat
      ? `${data.FocalLengthIn35mmFormat}mm eq.`
      : (data?.FocalLength ? `${Number(data.FocalLength.toFixed(1))}mm` : '-');
    const aperture = formatAperture(data?.FNumber);
    const shutter = formatShutter(data?.ExposureTime);
    const iso = data?.ISO ? `${data.ISO}` : '-';

    let dateLabel = '-';
    if (data?.DateTimeOriginal) {
      const d = new Date(data.DateTimeOriginal);
      dateLabel = new Intl.DateTimeFormat('zh-CN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(d);
    }

    return {
      exif: {
        camera,
        lens,
        focalLength,
        aperture,
        shutter,
        iso,
      },
      dateLabel,
      place: defaultPlace,
      width: data?.ImageWidth || data?.ExifImageWidth,
      height: data?.ImageHeight || data?.ExifImageHeight,
    };
  } catch (err) {
    console.error(`Failed to parse EXIF for ${filePath}:`, err);
    return {
      exif: {
        camera: '-',
        lens: '-',
        focalLength: '-',
        aperture: '-',
        shutter: '-',
        iso: '-',
      },
      dateLabel: '-',
      place: defaultPlace,
    };
  }
}
