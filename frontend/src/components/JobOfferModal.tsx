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
        skills: initialData.skills?.map(skill => ({
          name: skill.name,
          years_required: skill.years_required,
        })) || []
      };
      form.setFieldsValue(formattedData);
    } else {
      form.resetFields();

    }
  }, [initialData, form]);

  const handleFieldChange = (changedFields: any, allFields: any) => {
    const currentValues = form.getFieldsValue();
    if (currentValues.skills) {
      const skills = currentValues.skills
        .filter((skill: any) => skill && (skill.name || skill.years_required))
        .map((skill: any) => ({
          name: skill.name || '',
          years_required: typeof skill.years_required === 'number' ? skill.years_required : 0
        }));

      if (skills.length > 0) {
        form.setFieldsValue({
          ...currentValues,
          skills
        });
      }
    }
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
      title={initialData ? "Update Job Offer" : "Add a job offer"}
      open={isVisible}
      onCancel={onClose}
      okText={initialData ? "Update" : "Create"}
      cancelText="Cancel"
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
              label="Job Title"
              rules={[{ required: true, message: 'Please enter the job title' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="link_referral"
              label="Link Referral"
              rules={[{ required: true, message: 'Please enter the link referral' }]}
            >
              <Input style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: 'Please enter a description' }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
          </Col>

          <Col span={24}>
          <Form.Item name="skills" label="Skills required">
        <Form.List name="skills" >
      
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                  <Form.Item
                    {...restField}
                    name={[name, 'name']}
                    rules={[{ required: true, message: 'Skill name required' }]}
                  >
                    <Input placeholder="Language name"  />
                  </Form.Item>
                  
                  <Form.Item
                    {...restField}
                    name={[name, 'years_required']}
                    rules={[{ required: true, message: 'Years Experience required' }]}
                  >
                    <InputNumber  placeholder="Years of Experience"  style={{width: '100%'}}/>
                  </Form.Item>

                  {/* <Form.Item
                    {...restField}
                    name={[name, 'level']}
                    rules={[{ required: true, message: 'Level required' }]}
                  >
                    <Select placeholder="Level" style={{ width: 120 }}>
                      <Option value="beginner">Beginner</Option>
                      <Option value="intermediate">Intermediate</Option>
                      <Option value="advanced">Advanced</Option>
                      <Option value="expert">Expert</Option>
                    </Select>
                  </Form.Item> */}

                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add a skill
              </Button>
            </>
          )}
        </Form.List>
      </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="global_year_experience"
              label="Years of experience required"
              rules={[{ required: true, message: 'Please enter the years of experience', type: 'number' }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
         

          

          <Col span={12}>
            <Form.Item
              name="work_condition"
              label="Work conditions"
              rules={[{ required: true, message: 'Please select the work conditions' }]}
            >
              <Select>
                <Option value="onsite">On site</Option>
                <Option value="remote">Remote</Option>
                <Option value="hybrid">Hybrid</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="city"
              label="City"
              rules={[{ required: true, message: 'Please enter the city' }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="company_name"
              label="Company name"
              rules={[{ required: true, message: 'Please enter the company name' }]}
            >
              <Input />
            </Form.Item>
          </Col>

          

          <Col span={12}>
            <Form.Item
              name="contact_name"
              label="Contact name"
              rules={[{ required: true, message: 'Please enter the contact name' }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="phone_number"
              label="Phone number"
              rules={[{ required: true, message: 'Please enter the phone number' }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="email_address"
              label="Email address"
              rules={[
                { required: true, message: 'Please enter the email address' },
                { type: 'email', message: 'Please enter a valid email address' }
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