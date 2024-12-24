import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, InputNumber, message, Modal, Row, Select, Space } from 'antd';
import React from 'react';
import { Job } from '../interface/job.interface';
import { createJob, updateJob } from '../services/job.service';

interface JobFormModalProps {
  isVisible: boolean;
  onClose: () => void;
  initialData?: Job;
  onSuccess: () => void;
}

const JobFormModal: React.FC<JobFormModalProps> = ({
  isVisible,
  onClose,
  initialData,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const isEditMode = !!initialData;

  const handleSubmit = async (values: any) => {
    try {
      if (isEditMode) {
        await updateJob(initialData.id.toString(), values);
        message.success('Job updated successfully');
      } else {
        await createJob(values);
        message.success('Job created successfully');
      }
      onSuccess();
      onClose();
    } catch (error) {
      message.error(isEditMode ? 'Failed to update job' : 'Failed to create job');
    }
  };

  const renderJobForm = () => (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialData}
      onFinish={handleSubmit}
    >
              <Row gutter={16}>
      <Col span={12}>
      <Form.Item name="name" label="Job Title" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="description" label="Description" rules={[{ required: true }]}>
        <Input.TextArea />
      </Form.Item>
      <Form.Item name="salary_offered" label="Salary" rules={[{ required: true }]}>
        <InputNumber style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="skills" label="Required Skills">
        <Form.List name="skills">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} align="baseline">
                  <Form.Item {...restField} name={[name, 'name']} >
                    <Input placeholder="Skill name" />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, 'years_required']} >
                    <InputNumber min={0} placeholder="Years required" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add Required Skill
              </Button>
            </>
          )}
        </Form.List>
      </Form.Item>
      <Form.Item name="global_year_experience" label="Global Experience Required" rules={[{ required: true }]}>
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="city" label="City" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
    
      
      </Col>
      <Col span={12}>
      <Form.Item name="work_condition" label="Work Condition" rules={[{ required: true }]}>
        <Select>
          <Select.Option value="onsite">Onsite</Select.Option>
          <Select.Option value="remote">Remote</Select.Option>
          <Select.Option value="hybrid">Hybrid</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item name="company_type" label="Company Type" rules={[{ required: true }]}>
        <Select>
          <Select.Option value="startup">Startup</Select.Option>
          <Select.Option value="enterprise">Enterprise</Select.Option>
          <Select.Option value="smb">SMB</Select.Option>
          <Select.Option value="consulting">Consulting</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item name="contact_name" label="Contact Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="phone_number" label="Phone Number" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="email_address" label="Email Address" rules={[{ required: true, type: 'email' }]}>
        <Input />
      </Form.Item>
      </Col>
      </Row>
   
    
    </Form>
  );

  return (
    <Modal
      title={`${isEditMode ? 'Edit' : 'Create'} Job`}
      open={isVisible}
      onCancel={onClose}
      onOk={() => form.submit()}
      width={800}
    >
      {renderJobForm()}
    </Modal>
  );
};

export default JobFormModal; 