import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignUpStepperModal } from '../components/SignUpStepperModal';
import { useAuth } from '../context/AuthContext';
import { GetUserById } from '../services/user.service';

const CompleteProfile = () => {
  const [isModalVisible, setIsModalVisible] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: userData } = useQuery({
    queryKey: ['user', user?.id],
    queryFn: () => GetUserById(user?.id),
  });

  const handleClose = () => {
    setIsModalVisible(false);
    navigate(user?.role === 'publisher' ? '/jobs' : '/profile');
  };

  if (!user) return <div>Loading...</div>;

  return (
    <SignUpStepperModal
      isVisible={isModalVisible}
      onClose={handleClose}
      initialData={userData}
    />
  );
};

export default CompleteProfile;