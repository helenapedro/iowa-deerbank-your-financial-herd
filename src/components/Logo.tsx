import React from 'react';
import { useNavigate } from 'react-router-dom';


interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-3">
      <div className={`${sizeClasses[size]} relative`}>
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Deer head silhouette */}
          <circle cx="32" cy="32" r="30" className="fill-primary" />
          <path 
            d="M32 14c-2 0-3.5 1-4 3l-1 4c-3 0-5 2-6 4l-2-6c-.5-1.5-2-2-3-1s-1 2.5-.5 4l3 8c-2 3-3 6-3 9 0 8 7 15 16.5 15s16.5-7 16.5-15c0-3-1-6-3-9l3-8c.5-1.5 0-3-.5-4s-2.5 0-3 1l-2 6c-1-2-3-4-6-4l-1-4c-.5-2-2-3-4-3z"
            className="fill-primary-foreground"
          />
          <circle cx="26" cy="38" r="2" className="fill-primary" />
          <circle cx="38" cy="38" r="2" className="fill-primary" />
          <ellipse cx="32" cy="44" rx="3" ry="2" className="fill-primary/60" />
        </svg>
      </div>
      {showText && (
        <div className="flex flex-col">
          <span 
              className={`font-display font-bold ${textSizes[size]} text-foreground leading-tight`} 
              onClick={() => navigate('/')}
            >
              Iowa DeerBank
            </span>
          {size !== 'sm' && (
            <span className="text-xs text-muted-foreground tracking-wider uppercase">
              Banking Naturally
            </span>
          )}
        </div>
      )}
    </div>
  );
};
