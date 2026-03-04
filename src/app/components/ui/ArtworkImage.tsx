import { useState } from 'react';
import { getProxiedImageUrl, getProxiedPlaceholderUrl } from '../../../lib/imageProxy';

interface ArtworkImageProps {
  src: string | null | undefined;
  alt: string;
  seed?: string | number;
  className?: string;
  fallbackClassName?: string;
}

export function ArtworkImage({ src, alt, seed, className = '', fallbackClassName = '' }: ArtworkImageProps) {
  const [failed, setFailed] = useState(false);
  const hasValidUrl = src && typeof src === 'string' && src.trim().length > 0;

  if (!hasValidUrl || failed) {
    const fallbackUrl = getProxiedPlaceholderUrl(seed ?? alt);
    return (
      <img
        src={fallbackUrl}
        alt={alt}
        className={className}
        loading="lazy"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = getProxiedPlaceholderUrl(String((seed ?? 0) + 1));
        }}
      />
    );
  }

  return (
    <img
      src={getProxiedImageUrl(src)}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
