
import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  label?: string;
  color?: string; // Tailwind color class e.g. bg-blue-500
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, label, color = 'bg-primary' }) => {
  const clampedValue = Math.max(0, Math.min(100, value));

  return (
    <div>
      {label && <p className="text-sm text-gray-700 mb-1">{label} - {clampedValue.toFixed(0)}%</p>}
      <div className="w-full bg-gray-200 rounded-full h-5 overflow-hidden shadow-inner">
        <div
          className={`h-full rounded-full ${color} transition-all duration-500 ease-out flex items-center justify-center text-white text-xs font-medium`}
          style={{ width: `${clampedValue}%` }}
        >
          {clampedValue.toFixed(0)}%
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
