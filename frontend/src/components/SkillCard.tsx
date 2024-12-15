import { Card, Progress, Typography } from 'antd';
import { Skill } from '../interface/skill.interface';
import { getSkillIcon } from '../utils/skillIcons';

const { Text } = Typography;

interface SkillCardProps {
  skill: Skill;
}

const SkillCard = ({ skill }: SkillCardProps) => {
  const icon = getSkillIcon(skill.language);
  const level = skill.level || skill.experience_years;
  
  return (
    <Card size="small">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {icon && <span style={{ fontSize: '24px' }}>{icon}</span>}
        <div style={{ flex: 1 }}>
          <Text strong>{skill.language}</Text>
          <Progress 
            percent={level * 20} 
            showInfo={false}
            size="small"
          />
          <Text type="secondary">{skill.experience_years} ans d'expérience</Text>
        </div>
      </div>
    </Card>
  );
};

export default SkillCard; 