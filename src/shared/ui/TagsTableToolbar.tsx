import { Button, Space, Typography } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const { Text } = Typography;

type Props = {
  selectedCount: number;
  onBulkDelete: () => void;
};

export const TagsTableToolbar = ({ selectedCount, onBulkDelete }: Props) => {
  return (
    <Space
      style={{
        width: "100%",
        justifyContent: "flex-start",
        gap: "1em",
        // marginBottom: 12,
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
        {selectedCount > 0 && `Выбрано тегов: ${selectedCount}`}
      </Text>
    </Space>
  );
};
