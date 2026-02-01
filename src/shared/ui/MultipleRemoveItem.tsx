import { Button, Space, Typography } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const { Text } = Typography;

type Props = {
  selectedCount: number;
  onBulkDelete: () => void;
};

export const MultipleRemoveItem = ({ selectedCount, onBulkDelete }: Props) => {
  return (
    <Space
      style={{
        width: "100%",
        justifyContent: "flex-start",
        gap: "1em",
      }}
    >
      <Button
        danger
        icon={<DeleteOutlined />}
        disabled={selectedCount === 0}
        onClick={onBulkDelete}
      >
        Удалить
      </Button>

      <Text type="secondary">
        {selectedCount > 0 && `Выбрано: ${selectedCount}`}
      </Text>
    </Space>
  );
};
