import React from "react";

interface HashTagProps {
  tag: string;
  id?: number;
  index?: number;
}

export const HashTag: React.FC<HashTagProps> = ({ tag, id, index }) => {
  return (
    <span
      key={id || index}
      style={{
        background: "#f0f0f0",
        margin: "0 2px",
        padding: "2px 8px",
        borderRadius: "12px",
        fontSize: "12px",
        color: "#1890ff",
        textTransform: "lowercase",
      }}
    >
      #{tag}
    </span>
  );
};
