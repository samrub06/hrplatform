import { EditOutlined } from "@ant-design/icons";
import { Button, Card, Space } from "antd";

interface ProfileSectionProps {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
  extra?: React.ReactNode;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ 
  title, 
  onEdit, 
  children,
  extra 
}) => {
  return (
    <Card
      title={title}
      extra={
        <Space>
          {!extra && (
            <Button 
              icon={<EditOutlined />} 
              type="text"
              onClick={onEdit}
            />
          )}
          {extra}
        </Space>
      }
    >
      {children}
    </Card>
  );
};

export default ProfileSection;