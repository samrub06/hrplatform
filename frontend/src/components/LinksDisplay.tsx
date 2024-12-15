import { GithubOutlined, LinkedinOutlined, LinkOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { Button, message, Space, Typography } from 'antd';
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
      message.success('Lien public copié dans le presse-papiers !');
    } catch (error) {
      message.error('Erreur lors de la génération du lien public');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      {userData?.email && (
        <div>
          <MailOutlined style={{ marginRight: '8px' }} />
          <Text copyable>{userData.email}</Text>
        </div>
      )}
      
      {userData?.phone_number && (
        <div>
          <PhoneOutlined style={{ marginRight: '8px' }} />
          <Text copyable>{userData.phone_number}</Text>
        </div>
      )}
      
      {userData?.github_link && (
        <div>
          <GithubOutlined style={{ marginRight: '8px' }} />
          <a href={userData.github_link} target="_blank" rel="noopener noreferrer">
            GitHub Profile
          </a>
        </div>
      )}
      
      {userData?.linkedin_link && (
        <div>
          <LinkedinOutlined style={{ marginRight: '8px' }} />
          <a href={userData.linkedin_link} target="_blank" rel="noopener noreferrer">
            LinkedIn Profile
          </a>
        </div>
      )}
      
      <div>
        <LinkOutlined style={{ marginRight: '8px' }} />
        {userData?.public_profile_url ? (
          <Button type="link" onClick={() => navigator.clipboard.writeText(userData.public_profile_url!)}>
            Copier le lien public
          </Button>
        ) : (
          <Button 
            type="primary" 
            onClick={handleGeneratePublicLink}
            loading={isGenerating}
          >
            Générer un lien public
          </Button>
        )}
      </div>
    </Space>
  );
};

export default LinksDisplay; 