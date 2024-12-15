import {
  ApiOutlined,
  CodeOutlined,
  Html5Outlined,
  JavaScriptOutlined
} from '@ant-design/icons';

export const getSkillIcon = (skillName: string) => {
  const skillMap: { [key: string]: JSX.Element } = {
    'JavaScript': <JavaScriptOutlined />,
    'HTML': <Html5Outlined />,
    'React': <CodeOutlined />,
    'API': <ApiOutlined />,
    // Ajoutez d'autres correspondances ici
  };

  return skillMap[skillName] || <CodeOutlined />;
}; 