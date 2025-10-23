import React from "react";

interface AnimatedBackgroundProps {
  color?: string;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  color = "#388E3C",
}) => {
  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0% {
              background-position: 5% 50%, 95% 50%;
              background-size: 100% 100%;
            }
            50% {
              background-position: 50% 50%, 50% 50%;
              background-size: 150% 100%;
            }
            100% {
              background-position: 5% 50%, 95% 50%;
              background-size: 100% 100%;
            }
          }
        `}
      </style>

      <div
        className="fixed inset-0 z-[-1] pointer-events-none"
        style={{
          backgroundColor: "#0a0a0a",
          backgroundImage: `
            radial-gradient(circle at 5% 50%, ${color} 0%, transparent 40%),
            radial-gradient(circle at 95% 50%, ${color} 0%, transparent 40%)
          `,
          animation: "pulse 6s ease-in-out infinite",
        }}
      />
    </>
  );
};

export default AnimatedBackground;
