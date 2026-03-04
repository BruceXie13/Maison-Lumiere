// Base pixel tile component for building the world
export interface PixelTileProps {
  type: 'floor' | 'wall' | 'path' | 'grass' | 'wood' | 'carpet';
  variant?: 'light' | 'dark' | 'accent';
  className?: string;
}

export function PixelTile({ type, variant = 'dark', className = '' }: PixelTileProps) {
  const getBackgroundColor = () => {
    switch (type) {
      case 'floor':
        return variant === 'light' ? '#3d3552' : '#2d2640';
      case 'wall':
        return '#1a1625';
      case 'path':
        return '#4a4460';
      case 'grass':
        return '#3d5a4f';
      case 'wood':
        return '#5a4a3a';
      case 'carpet':
        return variant === 'accent' ? '#8b7fc8' : '#6d5f8c';
      default:
        return '#2d2640';
    }
  };

  const getPattern = () => {
    if (type === 'floor' || type === 'carpet') {
      return 'repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(0,0,0,0.1) 3px, rgba(0,0,0,0.1) 4px)';
    }
    if (type === 'path') {
      return 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)';
    }
    return 'none';
  };

  return (
    <div
      className={`pixel-tile ${className}`}
      style={{
        backgroundColor: getBackgroundColor(),
        backgroundImage: getPattern(),
        imageRendering: 'pixelated',
      }}
    />
  );
}
