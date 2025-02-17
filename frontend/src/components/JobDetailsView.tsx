import { Job } from '@/interface/job.interface';
import { Card, Col, Descriptions, Modal, Row, Space, Tag, Typography } from 'antd';
import moment from 'moment';

const { Title, Text } = Typography;

interface JobDetailsViewProps {
  job: Job;
  isVisible: boolean;
  onClose: () => void;
}

const JobDetailsView: React.FC<JobDetailsViewProps> = ({ job, isVisible, onClose }) => {
  const getBadgeColor = (yearsRequired: number) => {
    if (yearsRequired <= 2) return 'green';
    if (yearsRequired <= 5) return 'blue';
    if (yearsRequired <= 8) return 'orange';
    return 'red';
  };

  return (
    <Modal
      title="Détails de l'offre"
      open={isVisible}
      onCancel={onClose}
      footer={null}
      width={1000}
    >
      <div className="job-details-container">
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Card>
              <Title level={2}>{job.name}</Title>
              <Title level={4} type="secondary">{job.company_name}</Title>
            </Card>
          </Col>

          <Col span={24}>
            <Card title="Description du poste">
              <Text>{job.description}</Text>
            </Card>
          </Col>

          <Col span={24}>
            <Card title="Compétences requises">
              <Space size={[0, 8]} wrap>
                {job.skills?.map((skill, index) => (
                  <Tag 
                    key={index} 
                    color={getBadgeColor(skill.years_required)}
                    style={{ margin: '4px' }}
                  >
                    {skill.name} ({skill.years_required} ans)
                  </Tag>
                ))}
              </Space>
            </Card>
          </Col>

          <Col span={24}>
            <Card>
              <Descriptions column={{ xs: 1, sm: 2, md: 3 }} bordered>
                <Descriptions.Item label="Expérience globale requise">
                  {job.global_year_experience} ans
                </Descriptions.Item>
                <Descriptions.Item label="Conditions de travail">
                  {job.work_condition === 'remote' ? 'Télétravail' : 
                   job.work_condition === 'onsite' ? 'Sur site' : 'Hybride'}
                </Descriptions.Item>
                <Descriptions.Item label="Ville">
                  {job.city}
                </Descriptions.Item>
                <Descriptions.Item label="Lien de l'offre">
                  <a href={job.link_referral} target="_blank" rel="noopener noreferrer">
                    Voir l'offre
                  </a>
                </Descriptions.Item>
                <Descriptions.Item label="Date de publication">
                  {moment(job.createdAt).format('DD/MM/YYYY')}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          <Col span={24}>
            <Card title="Informations de contact">
              <Descriptions column={{ xs: 1, sm: 2 }} bordered>
                <Descriptions.Item label="Contact">
                  {job.contact_name}
                </Descriptions.Item>
                <Descriptions.Item label="Téléphone">
                  {job.phone_number}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  <a href={`mailto:${job.email_address}`}>
                    {job.email_address}
                  </a>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        </Row>
      </div>
    </Modal>
  );
};

export default JobDetailsView; 