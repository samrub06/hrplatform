import { Job } from '@/interface/job.interface';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Col, Form, Input, InputNumber, Modal, Row, Select, Space } from 'antd';
import { useEffect, useState } from 'react';
import { createJob, updateJob } from '../services/job.service';

const { Option } = Select;


interface JobOfferModalProps {
  isVisible: boolean;
  onClose: () => void;
  userId: string;
  initialData?: Job | null;
}

const JobOfferModal = ({ isVisible, onClose, userId, initialData }: JobOfferModalProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (initialData) {
      const formattedData = {
        ...initialData,
        skills: initialData.skills || [],
      };
      form.setFieldsValue(formattedData);
    } else {
      form.resetFields();
    }
  }, [initialData, form]);

  const handleFieldChange = (changedFields: any, allFields: any) => {
    const currentValues = form.getFieldsValue();
    const skills = currentValues.skills?.map((skill: any, index: number) => ({
      ...skill,
      name: skill?.name || '',
      years_required: skill?.years_required || 0,
      level: skill?.level || 'beginner'
    })) || [];

    form.setFieldsValue({
      ...currentValues,
      skills: skills
    });
  };

  const createJobMutation = useMutation({
    mutationFn: createJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      onClose();
    },
  });

  const updateJobMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Job> }) =>
      updateJob(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      onClose();
    },  
  });

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const formattedValues = {
        ...values,
        userId,
      };
      
      if (initialData?.id) {
        await updateJobMutation.mutateAsync({
          id: initialData.id.toString(),
          data: formattedValues,
        });
      } else {
        await createJobMutation.mutateAsync(formattedValues);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
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
      width={1000}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        onFieldsChange={handleFieldChange}
        initialValues={{ skills: [] }}
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="name"
              label="Titre du poste"
              rules={[{ required: true, message: 'Veuillez entrer le titre du poste' }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: 'Veuillez entrer une description' }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
          </Col>

          <Col span={24}>
          <Form.Item name="skills" label="Compétences requises">
        <Form.List name="skills">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                  <Form.Item
                    {...restField}
                    name={[name, 'name']}
                    rules={[{ required: true, message: 'Nom requis' }]}
                  >
                    <Input placeholder="Nom de la compétence" />
                  </Form.Item>
                  
                  <Form.Item
                    {...restField}
                    name={[name, 'years_required']}
                    rules={[{ required: true, message: 'Années requises' }]}
                  >
                    <InputNumber min={0} placeholder="Années" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, 'level']}
                    rules={[{ required: true, message: 'Niveau requis' }]}
                  >
                    <Select placeholder="Niveau" style={{ width: 120 }}>
                      <Option value="beginner">Débutant</Option>
                      <Option value="intermediate">Intermédiaire</Option>
                      <Option value="advanced">Avancé</Option>
                      <Option value="expert">Expert</Option>
                    </Select>
                  </Form.Item>

                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Ajouter une compétence
              </Button>
            </>
          )}
        </Form.List>
      </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="global_year_experience"
              label="Années d'expérience requises"
              rules={[{ required: true, message: 'Veuillez entrer les années d\'expérience', type: 'number' }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col span={12}>
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
          </Col>

          <Col span={12}>
            <Form.Item
              name="work_condition"
              label="Conditions de travail"
              rules={[{ required: true, message: 'Veuillez sélectionner les conditions de travail' }]}
            >
              <Select>
                <Option value="onsite">Sur site</Option>
                <Option value="remote">Télétravail</Option>
                <Option value="hybrid">Hybride</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="city"
              label="Ville"
              rules={[{ required: true, message: 'Veuillez entrer la ville' }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="company_name"
              label="Nom de l'entreprise"
              rules={[{ required: true, message: 'Veuillez entrer le nom de l\'entreprise' }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="company_type"
              label="Type d'entreprise"
              rules={[{ required: true, message: 'Veuillez sélectionner le type d\'entreprise' }]}
            >
              <Select>
                <Option value="startup">Startup</Option>
                <Option value="enterprise">Grande entreprise</Option>
                <Option value="smb">PME</Option>
                <Option value="consulting">Cabinet de conseil</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="contact_name"
              label="Nom du contact"
              rules={[{ required: true, message: 'Veuillez entrer le nom du contact' }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="phone_number"
              label="Numéro de téléphone"
              rules={[{ required: true, message: 'Veuillez entrer le numéro de téléphone' }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="email_address"
              label="Adresse email"
              rules={[
                { required: true, message: 'Veuillez entrer l\'adresse email' },
                { type: 'email', message: 'Veuillez entrer une adresse email valide' }
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default JobOfferModal; 