import { Modal } from 'antd';
import React, { useState } from 'react';
import { UserData } from '../interface/user.interface';
import UserForm from './UserForm';

interface UserFormModalProps {
  isVisible: boolean;
  onClose: () => void;
  initialData?: UserData | null;
  onSuccess: () => void;
}

const UserFormModal: React.FC<UserFormModalProps> = ({
  isVisible,
  onClose,
  initialData,
  onSuccess,
}) => {
  const isEditMode = !!initialData;
  const formRef = React.useRef<any>();
  const [uploading, setUploading] = useState(false);

  const handleOk = () => {
    formRef.current?.submit();
  };

  return (
    <Modal
      title={`${isEditMode ? 'Edit' : 'Create'} User`}
      open={isVisible}
      onCancel={onClose}
      onOk={handleOk}
      confirmLoading={uploading}
      width={800}
    >
      <UserForm
        ref={formRef}
        initialData={initialData}
        onSuccess={onSuccess}
        onClose={onClose}
        setUploading={setUploading}

      />
    </Modal>
  );
};

export default UserFormModal;

UserForm.displayName = 'UserForm';