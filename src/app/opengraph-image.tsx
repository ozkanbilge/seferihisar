import { ImageResponse } from 'next/og';
import { site } from '@/lib/site';

export const runtime = 'edge';

export const alt = site.name;
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #0e0f12, #14161b)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ece8df',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(192, 160, 98, 0.15) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '40px',
            background: 'linear-gradient(to right, #c0a062, #d8b978)',
            backgroundClip: 'text',
            color: 'transparent',
            fontSize: '80px',
            fontWeight: 'bold',
            letterSpacing: '-0.02em',
          }}
        >
          {site.name}
        </div>
        <div
          style={{
            fontSize: '36px',
            color: '#a7a499',
            maxWidth: '800px',
            textAlign: 'center',
            lineHeight: 1.4,
          }}
        >
          {site.tagline}
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            color: '#c0a062',
            fontSize: '24px',
            fontWeight: 600,
          }}
        >
          <span>seferihisaremlak.com.tr</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
