import React from 'react';
import { QuickOption } from '../types';

interface QuickOptionsProps {
  options: QuickOption[];
  onSelect: (value: string) => void;
}

export const QuickOptions: React.FC<QuickOptionsProps> = ({ options, onSelect }) => {
  if (!options || options.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => onSelect(option.value)}
          className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
        >
          {option.text}
        </button>
      ))}
    </div>
  );
};