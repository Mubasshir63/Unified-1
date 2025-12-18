import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

const SplashScreen: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center relative bg-gradient-to-br from-cyan-50 via-white to-blue-100 text-white overflow-hidden">
      <style>{`
        @keyframes fadeInScaleUp {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(0, 150, 57, 0.4); }
          50% { box-shadow: 0 0 30px rgba(0, 150, 57, 0.7); }
        }
        .splash-container {
          animation: fadeInScaleUp 1.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        .tagline {
          animation: fadeIn 1.5s ease-in-out 1s forwards;
          opacity: 0;
        }
        .logo-circle {
          animation: pulseGlow 3s infinite ease-in-out;
          border-radius: 50%;
        }
      `}</style>
      <div className="splash-container flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center space-y-3">
          {/* New Logo SVG with Palestine Colors */}
          <div className="logo-circle">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                  <linearGradient id="palestineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#009639" />
                      <stop offset="50%" stopColor="#000000" />
                      <stop offset="100%" stopColor="#CE1126" />
                  </linearGradient>
              </defs>
              <circle cx="12" cy="12" r="11.5" fill="url(#palestineGradient)" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
              <path d="M12.5 8.5C12.5 8.22386 12.2761 8 12 8C11.7239 8 11.5 8.22386 11.5 8.5V12.559C11.5 12.7538 11.5947 12.934 11.7516 13.0416L12.0125 13.212C12.3553 13.4363 12.5 13.8213 12.5 14.2231V15.5C12.5 15.7761 12.2761 16 12 16C11.7239 16 11.5 15.7761 11.5 15.5V14.2231C11.5 13.5937 11.233 12.9928 10.7716 12.5711L10.5 12.3216V11.5C10.5 10.1193 11.6193 9 13 9H13.5C13.7761 9 14 8.77614 14 8.5C14 8.22386 13.7761 8 13.5 8H13C12.7239 8 12.5 8.22386 12.5 8.5Z" fill="white"/>
            </svg>
          </div>
           {/* Unified Text with updated Tricolor */}
           <svg height="35" viewBox="0 0 200 40" className="w-48">
              <defs>
                  <linearGradient id="tricolorGradient" x1="0%" y1="0%" x2="100%" y2="0%">
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
                  fontSize="30"
                  fontFamily="Inter, sans-serif"
                  fontWeight="800"
                  fill="url(#tricolorGradient)"
                  stroke="#475569"
                  strokeWidth="0.3"
              >
                  UNIFIED
              </text>
          </svg>
        </div>
        <p className="tagline mt-2 text-base text-slate-600 font-medium tracking-wider">
          Smart City in Smart Phone
        </p>
      </div>
      <p className="absolute bottom-6 text-center text-xs text-slate-500 tagline" style={{animationDelay: '1.5s'}}>
        &copy; An Official Site Connecting Citizens with City
      </p>
    </div>
  );
};

export default SplashScreen;
