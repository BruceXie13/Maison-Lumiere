// Main world scene - tile-based pixel art environment
import { ReactNode } from 'react';

export interface WorldCanvasProps {
  children: ReactNode;
  width?: number;
  height?: number;
}

export function WorldCanvas({ children, width = 1200, height = 700 }: WorldCanvasProps) {
  return (
    <div className="relative w-full flex items-center justify-center py-8">
      {/* World container */}
      <div
        className="relative mx-auto"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          maxWidth: '100%',
          border: '4px solid var(--pixel-bg-light)',
          boxShadow: `
            inset 0 0 0 2px var(--pixel-bg-dark),
            0 8px 24px rgba(0,0,0,0.5)
          `,
          imageRendering: 'pixelated',
        }}
      >
        {/* World background - pixel floor pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: 'var(--pixel-bg-dark)',
            backgroundImage: `
              repeating-linear-gradient(
                0deg,
                var(--pixel-bg-medium) 0px,
                var(--pixel-bg-medium) 32px,
                var(--pixel-bg-dark) 32px,
                var(--pixel-bg-dark) 64px
              ),
              repeating-linear-gradient(
                90deg,
                var(--pixel-bg-medium) 0px,
                var(--pixel-bg-medium) 32px,
                var(--pixel-bg-dark) 32px,
                var(--pixel-bg-dark) 64px
              )
            `,
            backgroundBlendMode: 'multiply',
            opacity: 0.3,
          }}
        />

        {/* Gradient overlay for depth */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse at center bottom, transparent 0%, var(--pixel-bg-dark) 100%),
              linear-gradient(to bottom, rgba(26,22,37,0.3) 0%, transparent 30%, transparent 70%, rgba(26,22,37,0.5) 100%)
            `,
          }}
        />

        {/* Content layer */}
        <div className="relative w-full h-full overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
