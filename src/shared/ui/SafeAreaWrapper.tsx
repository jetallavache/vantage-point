import React, { CSSProperties } from "react";
import { useIsMobile } from "../hooks/useIsMobile";

interface SafeAreaWrapperProps {
  children: React.ReactNode;
  mobilePadding?: string | number;
  desktopPadding?: string | number;
  style?: CSSProperties;
}

export const SafeAreaWrapper: React.FC<SafeAreaWrapperProps> = ({
  children,
  mobilePadding = "8px",
  desktopPadding = "0",
  style,
}) => {
  const isMobile = useIsMobile();

  return (
    <div
      style={{
        padding: isMobile ? mobilePadding : desktopPadding,
        marginBottom: "calc(100px + env(safe-area-inset-bottom))",
        minHeight: isMobile ? "-webkit-fill-available" : "100vh",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
