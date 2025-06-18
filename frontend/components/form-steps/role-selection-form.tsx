import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ArrowRight, Briefcase, Loader2, User, Users } from 'lucide-react';
import { useState } from 'react';

const roles = [
  {
    name: 'candidate',
    title: 'Candidate',
    description: 'I am looking for new job opportunities and want to be discovered by recruiters.',
    icon: User,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'recruiter',
    title: 'Recruiter',
    description: 'I am looking to hire talent and want to search for qualified candidates.',
    icon: Briefcase,
    color: 'from-purple-500 to-indigo-500',
  },
  {
    name: 'referee',
    title: 'Referee',
    description: 'I work at a company and want to help by referring talented people.',
    icon: Users,
    color: 'from-green-500 to-emerald-500',
  },
];

type RoleSelectionFormProps = {
  onSelectRole: (role: string) => void
}


const RoleSelectionForm = ({ onSelectRole }: RoleSelectionFormProps) => {
  const [isLoading] = useState(false);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="min-h-screen md:min-h-[80vh] flex flex-col justify-start pt-0 md:pt-12"
    >
      <div className="w-full max-w-2xl mx-auto md:mt-16 mb-3 md:mb-5 duration-300 p-3 md:p-10">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent drop-shadow-md">
            What brings you to TalentHub?
          </h2>
          <p className="text-slate-500 mt-1 md:mt-2 text-sm md:text-base">Choose your role to get a personalized experience.</p>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {roles.map((role, index) => (
          <motion.div
            key={role.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className="text-center p-6 h-full flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
              onClick={() => onSelectRole(role.name)}
            >
              <div>
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${role.color} mx-auto flex items-center justify-center mb-4`}>
                  <role.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900">{role.title}</h3>
                <p className="text-slate-500 mt-2 text-sm">{role.description}</p>
              </div>
              <Button variant="ghost" className="mt-6 w-full text-blue-600 group-hover:bg-blue-50">
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    I&apos;m a {role.title} <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RoleSelectionForm;