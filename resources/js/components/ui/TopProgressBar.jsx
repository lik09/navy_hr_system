import React from 'react';
import useProgressStore from '../../store/progressStore';


const GREEN = '#16a34a';         // ពណ៌បន្ទាត់ progress
const GREEN_TRACK = 'rgba(22, 163, 74, 0.15)'; // ពណ៌ background ស្រាល

export default function TopProgressBar() {
  const { active, progress } = useProgressStore();

  if (!active) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '3px',
        backgroundColor: GREEN_TRACK,
        zIndex: 99999,
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${progress}%`,
          backgroundColor: GREEN,
          boxShadow: `0 0 8px ${GREEN}`,
          transition: 'width 0.25s ease-out',
        }}
      />
    </div>
  );
}