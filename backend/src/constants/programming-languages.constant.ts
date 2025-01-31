interface ProgrammingLanguageInfo {
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'mobile' | 'other';
  icon?: string;
}

export const PROGRAMMING_LANGUAGES: ProgrammingLanguageInfo[] = [
  { name: 'JavaScript', category: 'frontend' },
  { name: 'TypeScript', category: 'frontend' },
  { name: 'Python', category: 'backend' },
  { name: 'Java', category: 'backend' },
  { name: 'C#', category: 'backend' },
  { name: 'PHP', category: 'backend' },
  { name: 'Ruby', category: 'backend' },
  { name: 'Swift', category: 'mobile' },
  { name: 'Kotlin', category: 'mobile' },
  { name: 'SQL', category: 'database' },
  { name: 'MongoDB', category: 'database' },
  { name: 'Docker', category: 'devops' },
  { name: 'Kubernetes', category: 'devops' },
  { name: 'Git', category: 'devops' },
  { name: 'GitHub', category: 'devops' },
  { name: 'GitLab', category: 'devops' },
  { name: 'React', category: 'frontend' },
  { name: 'Angular', category: 'frontend' },
  { name: 'Vue', category: 'frontend' },
  { name: 'Node.js', category: 'backend' },
  { name: 'Express', category: 'backend' },
  { name: 'Spring', category: 'backend' },
];

export const getProgrammingLanguages = (): string[] => {
  return PROGRAMMING_LANGUAGES.map((lang) => lang.name);
};

export const isProgrammingLanguage = (value: string): boolean => {
  return PROGRAMMING_LANGUAGES.some((lang) => lang.name === value);
};
