// Pixel art floor plan - walls, floors, zones drawn with CSS
import { ReactNode } from 'react';

export interface FloorPlanProps {
  children?: ReactNode;
}

export function FloorPlan({ children }: FloorPlanProps) {
  return (
    <div className="absolute inset-0">
      {/* Main floor */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 60% 40% at 50% 50%, #3d3552 0%, #2d2640 50%, #1a1625 100%)
          `,
        }}
      />

      {/* Left wall - Gallery area */}
      <div
        className="absolute top-0 left-0 bottom-0"
        style={{
          width: '25%',
          background: 'linear-gradient(to right, var(--pixel-bg-dark) 0%, transparent 100%)',
          borderRight: '2px solid rgba(139, 127, 200, 0.2)',
        }}
      >
        {/* Wall texture */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent 0px, transparent 8px, rgba(0,0,0,0.1) 8px, rgba(0,0,0,0.1) 9px)',
          }}
        />
      </div>

      {/* Right wall - Commission board & Exchange */}
      <div
        className="absolute top-0 right-0 bottom-0"
        style={{
          width: '25%',
          background: 'linear-gradient(to left, var(--pixel-bg-dark) 0%, transparent 100%)',
          borderLeft: '2px solid rgba(139, 127, 200, 0.2)',
        }}
      >
        {/* Wall texture */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent 0px, transparent 8px, rgba(0,0,0,0.1) 8px, rgba(0,0,0,0.1) 9px)',
          }}
        />
      </div>

      {/* Top wall - Studios */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{
          height: '20%',
          background: 'linear-gradient(to bottom, var(--pixel-bg-dark) 0%, transparent 100%)',
          borderBottom: '2px solid rgba(139, 127, 200, 0.2)',
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'repeating-linear-gradient(90deg, transparent 0px, transparent 8px, rgba(0,0,0,0.1) 8px, rgba(0,0,0,0.1) 9px)',
          }}
        />
      </div>

      {/* Central carpet path */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: '40%',
          height: '50%',
          background: 'linear-gradient(135deg, rgba(139, 127, 200, 0.15) 0%, rgba(107, 205, 146, 0.15) 100%)',
          border: '2px solid rgba(139, 127, 200, 0.3)',
          borderRadius: '8px',
        }}
      >
        {/* Carpet pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              repeating-linear-gradient(45deg, transparent 0px, transparent 4px, rgba(139, 127, 200, 0.1) 4px, rgba(139, 127, 200, 0.1) 8px),
              repeating-linear-gradient(-45deg, transparent 0px, transparent 4px, rgba(139, 127, 200, 0.1) 4px, rgba(139, 127, 200, 0.1) 8px)
            `,
          }}
        />
      </div>

      {/* Accent lights - ceiling spots */}
      <div
        className="absolute top-[15%] left-[20%] w-24 h-24 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(232, 154, 199, 0.15) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute top-[15%] right-[20%] w-24 h-24 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(105, 180, 232, 0.15) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute bottom-[20%] left-[30%] w-32 h-32 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255, 214, 112, 0.15) 0%, transparent 70%)',
        }}
      />

      {/* Content */}
      {children}
    </div>
  );
}
