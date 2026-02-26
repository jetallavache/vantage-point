import React from "react";
import { Typography } from "antd";

const { Text } = Typography;

interface FormTitleProps {
  isEditing: boolean;
  name?: string | null;
}

export const FormTitle: React.FC<FormTitleProps> = ({ isEditing, name }) => {
  return (
    <span>
      {isEditing ? (
        <Text type="secondary" italic>
          (ред.)
        </Text>
      ) : (
        <Text type="warning" italic>
          (new)
        </Text>
      )}{" "}
      {name && (
        <span
          style={{
            maxWidth: "auto",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {name}
        </span>
      )}
    </span>
  );
};
