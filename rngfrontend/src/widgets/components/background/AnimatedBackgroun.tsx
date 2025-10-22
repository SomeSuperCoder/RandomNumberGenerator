import React from "react";
import "./Animated.css";

interface AnimatedBackgroundProps {
  color?: string;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  color = "#388E3C",
}) => {
  return (
    <div
      className="animated-background"
      style={{ "--pulse-color": color } as React.CSSProperties}
    />
  );
};

export default AnimatedBackground;
