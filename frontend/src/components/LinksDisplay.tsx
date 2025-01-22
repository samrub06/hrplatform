import { GithubOutlined, LinkedinOutlined, LinkOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { Button, Col, message, Space, Typography } from 'antd';
import { useState } from 'react';
import { UserData } from '../interface/user.interface';
import { generatePublicLink } from '../services/profile.service';

const { Text } = Typography;

const LinksDisplay = ({ userData }: { userData: UserData }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePublicLink = async () => {
    if (!userData?.id) return;
    
    setIsGenerating(true);
    try {
      const publicUrl = await generatePublicLink(userData.id.toString());
      await navigator.clipboard.writeText(publicUrl);
      message.success('Public link copied to clipboard !');
    } catch (error) {
      message.error('Error generating public link');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      {userData?.email && (
        <Col>
          <MailOutlined style={{ marginRight: '8px' }} />
          <Text copyable style={{ width: '100%' }}>{userData.email}</Text>
        </Col>
      )}
      
      {userData?.phone_number && (
        <Col>
          <PhoneOutlined style={{ marginRight: '8px' }} />
          <Text copyable style={{ width: '100%' }}>{userData.phone_number}</Text>
        </Col>
      )}
      
      {userData?.github_link && (
        <Col>
          <GithubOutlined style={{ marginRight: '8px' }} />
          <a href={userData.github_link} target="_blank" rel="noopener noreferrer" style={{ width: '100%' }}>
            GitHub Profile
          </a>
        </Col>
      )}
      
      {userData?.linkedin_link && (
        <Col>
          <LinkedinOutlined style={{ marginRight: '8px' }} />
          <a href={userData.linkedin_link} target="_blank" rel="noopener noreferrer" style={{ width: '100%' }}>
            LinkedIn Profile
          </a>
        </Col>
      )}
      
      <Col>
        <LinkOutlined style={{ marginRight: '8px' }} />
        {userData?.public_profile_url ? (
          <Button type="link" onClick={() => navigator.clipboard.writeText(userData.public_profile_url!)}>
            Copy public link
          </Button>
        ) : (
          <Button 
            type="primary" 
            onClick={handleGeneratePublicLink}
            loading={isGenerating}
          >
            Generate public link
          </Button>
        )}
      </Col>
    </Space>
  );
};

export default LinksDisplay; 