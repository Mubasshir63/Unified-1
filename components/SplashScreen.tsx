import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

const SplashScreen: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center relative bg-white text-white overflow-hidden">
      <style>{`
        @keyframes fadeInScaleUp {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .splash-container {
          animation: fadeInScaleUp 1.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        .tagline {
          animation: fadeIn 1.5s ease-in-out 1s forwards;
          opacity: 0;
        }
      `}</style>
      <div className="splash-container flex flex-col items-center justify-center relative z-10">
        <div className="flex flex-col items-center justify-center space-y-4">
           <svg height="60" viewBox="0 0 200 40" className="w-64">
              <defs>
                  <linearGradient id="tricolorGradientSplash" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#FF9933" />
                      <stop offset="33%" stopColor="#FF9933" />
                      <stop offset="33.01%" stopColor="#FFFFFF" />
                      <stop offset="48%" stopColor="#FFFFFF" />
                      <stop offset="48.01%" stopColor="#000080" />
                      <stop offset="51.99%" stopColor="#000080" />
                      <stop offset="52%" stopColor="#FFFFFF" />
                      <stop offset="66.99%" stopColor="#FFFFFF" />
                      <stop offset="67%" stopColor="#138808" />
                      <stop offset="100%" stopColor="#138808" />
                  </linearGradient>
              </defs>
              <text
                  x="50%"
                  y="50%"
                  dy=".35em"
                  textAnchor="middle"
                  fontSize="36"
                  fontFamily="Inter, sans-serif"
                  fontWeight="900"
                  fill="url(#tricolorGradientSplash)"
                  stroke="#1e293b"
                  strokeWidth="0.4"
                  letterSpacing="3"
              >
                  UNIFIED
              </text>
          </svg>
        </div>
        <p className="tagline mt-4 text-sm text-slate-500 font-bold tracking-[0.2em] uppercase">
          A Digital India Initiative
        </p>
      </div>
      <p className="absolute bottom-10 text-center text-[10px] text-slate-400 font-black tracking-widest uppercase tagline" style={{animationDelay: '1.5s'}}>
        Connecting Citizens With City
      </p>
    </div>
  );
};

export default SplashScreen;