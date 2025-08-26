import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import "./Tooltip.css";

type TooltipProps = {
  children: ReactNode;
  text: string;
  mobilePosition?: "top" | "bottom" | "left" | "right";
  desktopPosition?: "top" | "bottom" | "left" | "right";
  className?: string;
};

const Tooltip: React.FC<TooltipProps> = ({
  children,
  text,
  mobilePosition = "top",
  desktopPosition = "right",
  className,
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const position = isMobile ? mobilePosition : desktopPosition;

  return (
    <div className={`tooltip-wrapper ${className || ""}`}>
      {children}
      <span className={`custom-tooltip-nav ${position}`}>{text}</span>
    </div>
  );
};

export default Tooltip;
