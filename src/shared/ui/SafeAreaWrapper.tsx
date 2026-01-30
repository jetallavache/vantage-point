import React from "react";
import { useIsMobile } from "../hooks/useIsMobile";

interface SafeAreaWrapperProps {
  children: React.ReactNode;
  padding?: string | number;
  desktopPadding?: string | number;
}

export const SafeAreaWrapper: React.FC<SafeAreaWrapperProps> = ({
  children,
  padding = "8px",
  desktopPadding = "0",
}) => {
  const isMobile = useIsMobile();

  return (
    <div
      style={{
        padding: isMobile ? padding : desktopPadding,
        marginBottom: "calc(100px + env(safe-area-inset-bottom))",
        minHeight: isMobile ? "-webkit-fill-available" : "100vh",
      }}
    >
      {children}
    </div>
  );
};
