import { InboxOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, message, Modal, Select, Space, Upload } from 'antd';
import React, { useState } from 'react';
import { Job } from '../interface/job.interface';
import { Role, UserData } from '../interface/user.interface';
import { FileType, getPresignedUrl, uploadFileToS3 } from '../services/upload.service';

const { Dragger } = Upload;

interface FormModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  initialData?: UserData | Job;
  type: 'user' | 'job';
}

const FormModal: React.FC<FormModalProps> = ({
  isVisible,
  onClose,
  onSubmit,
  initialData,
  type,
}) => {
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File, type: 'cv' | 'profilePicture') => {
    try {
      setUploading(true);
      const userId = initialData?.id?.toString() || '';
      const presignedUrl = await getPresignedUrl(userId, file.name, type === 'cv' ? FileType.CV : FileType.PROFILE_PICTURE);
      await uploadFileToS3(presignedUrl, file);
      form.setFieldsValue({ [type]: file.name });
      message.success(`${type === 'cv' ? 'CV' : 'Profile picture'} uploaded successfully`);
    } catch (error) {
      message.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const uploadProps = {
    beforeUpload: (file: File) => {
      return false;
    },
    onChange: async (info: any) => {
      const { file } = info;
      if (file.status !== 'removed') {
        await handleUpload(file, 'cv');
      }
    },
  };

  const profilePictureProps = {
    ...uploadProps,
    onChange: async (info: any) => {
      const { file } = info;
      if (file.status !== 'removed') {
        await handleUpload(file, 'profilePicture');
      }
    },
  };

  const renderUserForm = () => (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialData}
      onFinish={onSubmit}
    >
      <Form.Item name="first_name" label="First Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="last_name" label="Last Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
        <Input />
      </Form.Item>
      {!initialData && (
        <Form.Item name="password" label="Password" rules={[{ required: true, min: 6 }]}>
          <Input.Password />
        </Form.Item>
      )}
      <Form.Item name="role" label="Role" rules={[{ required: true }]}>
        <Select>
          {Object.values(Role).map(role => (
            <Select.Option key={role} value={role}>{role}</Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name="skills" label="Skills">
        <Form.List name="skills">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} align="baseline">
                  <Form.Item {...restField} name={[name, 'language']} rules={[{ required: true }]}>
                    <Input placeholder="Language" />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, 'experience_years']} rules={[{ required: true }]}>
                    <InputNumber min={0} placeholder="Years" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add Skill
              </Button>
            </>
          )}
        </Form.List>
      </Form.Item>
      <Form.Item name={['desired_position', 'name']} label="Desired Position">
        <Input />
      </Form.Item>
      <Form.Item name={['desired_position', 'description']} label="Position Description">
        <Input.TextArea />
      </Form.Item>
      <Form.Item name="adminNotes" label="Admin Notes">
        <Input.TextArea />
      </Form.Item>
      <Form.Item name="cv" label="CV">
        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon"><InboxOutlined /></p>
          <p className="ant-upload-text">Click or drag CV file to upload</p>
        </Dragger>
      </Form.Item>
      <Form.Item name="profilePicture" label="Profile Picture">
        <Dragger {...profilePictureProps}>
          <p className="ant-upload-drag-icon"><InboxOutlined /></p>
          <p className="ant-upload-text">Click or drag profile picture to upload</p>
        </Dragger>
      </Form.Item>
    </Form>
  );

  const renderJobForm = () => (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialData}
      onFinish={onSubmit}
    >
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
                  <Form.Item {...restField} name={[name, 'name']} rules={[{ required: true }]}>
                    <Input placeholder="Skill name" />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, 'years_required']} rules={[{ required: true }]}>
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
      <Form.Item name="work_condition" label="Work Condition" rules={[{ required: true }]}>
        <Select>
          <Select.Option value="onsite">Onsite</Select.Option>
          <Select.Option value="remote">Remote</Select.Option>
          <Select.Option value="hybrid">Hybrid</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item name="company_name" label="Company Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
    {/*   <Form.Item name="company_type" label="Company Type" rules={[{ required: true }]}>
        <Select>
          <Select.Option value="startup">Startup</Select.Option>
          <Select.Option value="enterprise">Enterprise</Select.Option>
          <Select.Option value="smb">SMB</Select.Option>
          <Select.Option value="consulting">Consulting</Select.Option>
        </Select>
      </Form.Item> */}
      <Form.Item name="contact_name" label="Contact Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="phone_number" label="Phone Number" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="email_address" label="Email Address" rules={[{ required: true, type: 'email' }]}>
        <Input />
      </Form.Item>
    </Form>
  );

  return (
    <Modal
      title={`${type === 'user' ? 'User' : 'Job'} Details`}
      open={isVisible}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={uploading}
      width={800}
    >
      {type === 'user' ? renderUserForm() : renderJobForm()}
    </Modal>
  );
};

export default FormModal; 