'use client';

export default function OnboardingStyles() {
  return (
    <style>{`
      @keyframes borderPulse {
        0%, 100% {
          border-color: #d8e2ea;
          box-shadow: 0 0 0 0 rgba(90, 182, 217, 0);
        }
        50% {
          border-color: #57b6d9;
          box-shadow: 0 0 0 3px rgba(87, 182, 217, 0.1);
        }
      }

      .border-pulse {
        animation: borderPulse 3s ease-in-out infinite;
      }

      @keyframes checkmarkPulse {
        0% {
          transform: scale(0.2);
          opacity: 0;
        }
        12% {
          transform: scale(1);
          opacity: 1;
        }
        58% {
          transform: scale(1);
          opacity: 1;
        }
        76% {
          transform: scale(0.2);
          opacity: 0;
        }
        100% {
          transform: scale(0.2);
          opacity: 0;
        }
      }

      .checkmark-pulse {
        animation: checkmarkPulse 2.2s linear infinite;
        transform-origin: center;
        will-change: transform, opacity;
      }

      @keyframes stampBounce {
        0%, 100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-12px);
        }
      }

      .stamp-bounce {
        animation: stampBounce 2s ease-in-out infinite;
        will-change: transform;
      }

      @keyframes shadowPulse {
        0%, 100% {
          opacity: 0.15;
          filter: blur(12px);
        }
        50% {
          opacity: 0.05;
          filter: blur(6px);
        }
      }

      .shadow-pulse {
        animation: shadowPulse 2s ease-in-out infinite;
      }
    `}</style>
  );
}
