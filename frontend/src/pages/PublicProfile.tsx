import { DownloadOutlined, GithubOutlined, LinkedinOutlined, PhoneOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Avatar, Button, Col, Row, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SkillCard from '../components/SkillCard';
import { getPublicProfile } from '../services/profile.service';
import { FileType, getFileUrl } from '../services/upload.service';

const { Title, Text } = Typography;

const PersonalInfoDisplay = ({ profile }: { profile: any }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
console.log(imageUrl);
  useEffect(() => {
    const loadProfilePicture = async () => {
      if (profile?.profilePicture && profile?.id) {
        const url = await getFileUrl(
          profile.id.toString(),
          profile.profilePicture,
          FileType.PROFILE_PICTURE
        );
        if (url) {
          setImageUrl(url);
        }
      }
    };

    loadProfilePicture();
  }, [profile?.profilePicture, profile?.id]);

  return (
    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
      <Avatar size={200} src={imageUrl} style={{ marginBottom: '20px' }} />
      <Title level={2}>{profile.first_name} {profile.last_name}</Title>
      <Text type="secondary">{profile.desired_position}</Text>
      {profile.salary_expectation && (
        <div style={{ marginTop: '10px' }}>
          <Text>Expected Salary: {profile.salary_expectation}€</Text>
        </div>
      )}
      <Space direction="vertical" size="small" style={{ marginTop: '20px' }}>
        {profile.phone_number && (
          <div>
            <PhoneOutlined style={{ marginRight: '8px' }} />
            <Text>{profile.phone_number}</Text>
          </div>
        )}
        {profile.github_link && (
          <div>
            <GithubOutlined style={{ marginRight: '8px' }} />
            <a href={profile.github_link} target="_blank" rel="noopener noreferrer">
              GitHub Profile
            </a>
          </div>
        )}
        {profile.linkedin_link && (
          <div>
            <LinkedinOutlined style={{ marginRight: '8px' }} />
            <a href={profile.linkedin_link} target="_blank" rel="noopener noreferrer">
              LinkedIn Profile
            </a>
          </div>
        )}
      </Space>
    </div>
  );
};

const DocumentsDisplay = ({ profile }: { profile: any }) => {
  const downloadCv = async () => {
    if (profile?.cv) {
      const presignedUrl = await getFileUrl(
        profile.id.toString(),
        profile.cv,
        FileType.CV
      );
      window.open(presignedUrl, '_blank');
    }
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {profile?.cv && (
        <Button type="primary" onClick={downloadCv} icon={<DownloadOutlined />} block>
          Télécharger CV
        </Button>
      )}
    </Space>
  );
};

const SkillsDisplay = ({ skills }: { skills: any[] }) => (
  <Row gutter={[16, 16]}>
    {skills?.map((skill, index) => (
      <Col xs={24} sm={12} md={8} lg={6} key={index}>
        <SkillCard skill={skill} />
      </Col>
    ))}
  </Row>
);

const PublicProfile = () => {
  const { token } = useParams();
  
  const { data: profile, isLoading } = useQuery({
    queryKey: ['publicProfile', token],
    queryFn: () => getPublicProfile(token!),
    enabled: !!token,
  });

  if (isLoading) return <div>Chargement...</div>;
  if (!profile) return <div>Profil non trouvé</div>;

  return (
    <div style={{ padding: '24px' }}>
      <Row justify="center">
        <Col xs={24} md={16}>
          <PersonalInfoDisplay profile={profile} />

          <DocumentsDisplay profile={profile} />
          <SkillsDisplay skills={profile.skills} />
        </Col>
      </Row>
    </div>
  );
};

export default PublicProfile; 