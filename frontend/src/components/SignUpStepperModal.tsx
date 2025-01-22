import { Button, Modal, Radio, Steps, message } from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserData } from '../interface/user.interface';
import { checkPermission, updateUserRole } from '../services/user.service';
import JobOfferModal from './JobOfferModal';
import UserForm from './UserForm';

interface SignUpStepperModalProps {
  isVisible: boolean;
  onClose: () => void;
  initialData?: UserData;
}

export const SignUpStepperModal: React.FC<SignUpStepperModalProps> = ({
  isVisible,
  onClose,
  initialData,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);
  const formRef = React.useRef<any>();
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const handleRoleSelect = async (role: 'publisher' | 'candidate') => {
    try {
      const roleResponse = await updateUserRole(user?.id || '', role);
      if (roleResponse) {
        const permissionsResponse = await checkPermission()
        setUser({ ...user, role: role, permissions: permissionsResponse } as any);
        setCurrentStep(1);
      }
    } catch (error) {
      message.error('Error updating role');
    }
  };

  const handleJobModalClose = () => {
    setShowJobModal(false);
    navigate('/dashboard');
  };

  const steps = [
    {
      title: 'Role Selection',
      content: (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h3>Choose your role</h3>
          <Radio.Group
            buttonStyle="solid"
            onChange={(e) => handleRoleSelect(e.target.value)}
            style={{ marginTop: '20px' }}
          >
            <Radio.Button value="candidate" style={{ marginRight: '10px' }}>
              Candidate
            </Radio.Button>
            <Radio.Button value="publisher">
              Publisher
            </Radio.Button>
          </Radio.Group>
        </div>
      ),
    },
    {
      title: 'Personal Information',
      content: (
        <UserForm
          ref={formRef}
          initialData={initialData}
          onSuccess={() => {
            if (user?.role === 'publisher') {
              message.success('Profil complété avec succès');
              setShowJobModal(true);
              onClose();
            } else {
              setCurrentStep(2);
            }
          }}
          onClose={onClose}
          setUploading={setUploading}
          mode="signup"
          partialForm="personal"
        />
      ),
    },
    {
      title: 'CV and Photo',
      content: (
        <UserForm
          ref={formRef}
          initialData={initialData}
          onSuccess={() => setCurrentStep(3)}
          onClose={onClose}
          setUploading={setUploading}
          partialForm="documents"
        />
      ),
      hideForPublisher: true,
    },
    {
      title: 'Skills',
      content: (
        <UserForm
          ref={formRef}
          initialData={initialData}
          onSuccess={() => setCurrentStep(4)}
          onClose={onClose}
          setUploading={setUploading}
          partialForm="skills"
        />
      ),
      hideForPublisher: true,
    },
    {
      title: 'Education',
      content: (
        <UserForm
          ref={formRef}
          initialData={initialData}
          onSuccess={() => {
            onClose();
          }}
          onClose={onClose}
          setUploading={setUploading}
          partialForm="education"

        />
      ),
      hideForPublisher: true,
    },
  ];

  // Filtrer les étapes en fonction du rôle
  const filteredSteps = steps.filter(step => 
    !(user?.role === 'publisher' && step.hideForPublisher)
  );

  return (
    <>
      <Modal
        title="Complete your profile"
        open={isVisible}
        width={800}
        footer={currentStep === 0 ? null : [
          currentStep > 0 && (
            <Button key="back" onClick={() => setCurrentStep(currentStep - 1)}>
              Previous
            </Button>
          ),
          <Button
            key="next"
            type="primary"
            onClick={() => formRef.current?.submit()}
            loading={uploading}
          >
            {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
          </Button>,
        ]}
      >
        <Steps
          current={currentStep}
          items={filteredSteps.map((item) => ({ title: item.title }))}
          style={{ marginBottom: 24 }}
        />
        <div>{filteredSteps[currentStep].content}</div>
      </Modal>

      {showJobModal && (
        <JobOfferModal
          isVisible={showJobModal}
          onClose={handleJobModalClose}
          userId={user?.id || ''}
        />
      )}
    </>
  );
};