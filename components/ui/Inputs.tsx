import React from 'react';
import { ChevronDown } from 'lucide-react';

export const CustomSelect = ({ value, onChange, options, className = "" }: { value: string, onChange: (val: string) => void, options: string[], className?: string }) => (
  <div className="relative group w-full">
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      className={`w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 pr-10 outline-none text-xs focus:border-purple-500/50 appearance-none transition-all cursor-pointer text-white ${className}`}
    >
      {options.map(opt => <option key={opt} value={opt} className="bg-[#1a1a1e]">{opt}</option>)}
    </select>
    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-hover:text-purple-400 transition-colors">
      <ChevronDown size={14} />
    </div>
  </div>
);

export const TimeInput = ({ value, onChange, className = "", ...props }: { value: string, onChange: (val: string) => void, className?: string } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'>) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/[^0-9]/g, '');
    if (raw.length > 6) raw = raw.slice(0, 6);
    let formatted = raw;
    if (raw.length >= 3) {
        formatted = raw.slice(0, 2) + ':' + raw.slice(2);
    }
    if (raw.length >= 5) {
        formatted = formatted.slice(0, 5) + ':' + raw.slice(4);
    }
    onChange(formatted);
  };
  return (
    <input type="text" inputMode="numeric" placeholder="00:00:00" value={value} onChange={handleChange} className={`${className} font-mono`} {...props} />
  );
};
