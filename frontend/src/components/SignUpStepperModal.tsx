import { Button, Modal, Steps, message } from 'antd';
import React, { useState } from 'react';
import { UserData } from '../interface/user.interface';
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
  const formRef = React.useRef<any>();

  const steps = [
    {
      title: 'Informations Personnelles',
      content: (
        <UserForm
          ref={formRef}
          initialData={initialData}
          onSuccess={() => setCurrentStep(1)}
          onClose={onClose}
          setUploading={setUploading}
          partialForm="personal"
        />
      ),
    },
    {
      title: 'CV et Photo',
      content: (
        <UserForm
          ref={formRef}
          initialData={initialData}
          onSuccess={() => setCurrentStep(2)}
          onClose={onClose}
          setUploading={setUploading}
          partialForm="documents"
        />
      ),
    },
    {
      title: 'Compétences',
      content: (
        <UserForm
          ref={formRef}
          initialData={initialData}
          onSuccess={() => {
            message.success('Profil complété avec succès!');
            onClose();
          }}
          onClose={onClose}
          setUploading={setUploading}
          partialForm="skills"
        />
      ),
    },
  ];
  const handleNext = () => {
    formRef.current?.submit();
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <Modal
      title="Complétez votre profil"
      open={isVisible}
      onCancel={onClose}
      width={800}
      footer={[
        currentStep > 0 && (
          <Button key="back" onClick={handlePrev}>
            Précédent
          </Button>
        ),
        <Button
          key="next"
          type="primary"
          onClick={handleNext}
          loading={uploading}
        >
          {currentStep === steps.length - 1 ? 'Terminer' : 'Suivant'}
        </Button>,
      ]}
    >
      <Steps
        current={currentStep}
        items={steps.map((item) => ({ title: item.title }))}
        style={{ marginBottom: 24 }}
      />
      <div>{steps[currentStep].content}</div>
    </Modal>
  );
};