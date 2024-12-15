import { useMutation } from '@tanstack/react-query';
import { Form, Input, InputNumber, Modal } from 'antd';
import { useState } from 'react';
import { createJob } from '../services/job.service';

interface JobOfferModalProps {
  isVisible: boolean;
  onClose: () => void;
  userId: string;
}

const JobOfferModal = ({ isVisible, onClose, userId }: JobOfferModalProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const createJobMutation = useMutation({
    mutationFn: createJob,
    onSuccess: () => {
      onClose();
    },
  });

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      await createJobMutation.mutateAsync({
        ...values,
        publisher_id: userId,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Créer une offre d'emploi"
      open={isVisible}
      onCancel={onClose}
      okText="Créer"
      cancelText="Annuler"
      confirmLoading={loading}
      onOk={() => form.submit()}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="name"
          label="Titre du poste"
          rules={[{ required: true, message: 'Veuillez entrer le titre du poste' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Veuillez entrer une description' }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          name="salary_offered"
          label="Salaire proposé"
          rules={[{ required: true, message: 'Veuillez entrer le salaire' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            formatter={value => `${value}€`}
            parser={value => value!.replace('€', '')}
          />
        </Form.Item>

        <Form.Item
          name="city"
          label="Ville"
          rules={[{ required: true, message: 'Veuillez entrer la ville' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default JobOfferModal; 