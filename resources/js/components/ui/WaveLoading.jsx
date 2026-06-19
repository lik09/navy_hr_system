import React from 'react';
import "../../../css/WaveLoading.css";
export default function WaveLoading({ text = 'កំពុងផ្ទុក...', minHeight = 300 }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight,
      gap: 16,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        height: 48,
      }}>
        {[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6].map((delay, i) => (
          <div key={i} style={{
            width: 5,
            height: 32,
            borderRadius: 3,
            background: 'var(--wave-bar-color, #002366)',
            animation: 'waveAnim 1s ease-in-out infinite',
            animationDelay: `${delay}s`,
          }} />
        ))}
      </div>
      {text && (
        <span style={{
          fontSize: 14,
          color: 'var(--color-text-secondary)',
          letterSpacing: '0.05em',
        }}>
          {text}
        </span>
      )}
    </div>
  );
}