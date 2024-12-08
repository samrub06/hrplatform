import { FilePdfOutlined, InboxOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, InputNumber, message, Row, Select, Space, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import { Role, UserData } from '../interface/user.interface';
import { getPresignedUrl, uploadFileToS3 } from '../services/upload.service';
import { createUser, updateUser } from '../services/user.service';

const { Dragger } = Upload;

interface UserFormProps {
  initialData?: UserData;
  onSuccess: () => void;
  onClose: () => void;
  setUploading: (loading: boolean) => void;
}

const UserForm = React.forwardRef<any, UserFormProps>(({
  initialData,
  onSuccess,
  onClose,
  setUploading
}, ref) => {
  const [form] = Form.useForm();
  const [existingCV, setExistingCV] = useState<string | null>(initialData?.cv || null);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const isEditMode = !!initialData;

  React.useImperativeHandle(ref, () => ({
    submit: () => {
      form.submit();
    }
  }));

  const handleSubmit = async (values: any) => {
    try {
      setUploading(true);
      if (fileToUpload) {
        const presignedUrl = await getPresignedUrl(fileToUpload.name, fileToUpload.type, initialData?.id?.toString() || '');
        await uploadFileToS3(presignedUrl, fileToUpload);
        values.cv = fileToUpload.name;
      } else {
        values.cv = existingCV;
      }

      if (isEditMode) {
        await updateUser(initialData.id, values);
        message.success('User updated successfully');
      } else {
        await createUser(values);
        message.success('User created successfully');
      }
      onSuccess();
      onClose();
    } catch (error) {
      message.error(isEditMode ? 'Failed to update user' : 'Failed to create user');
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        first_name: initialData.first_name,
        last_name: initialData.last_name,
        email: initialData.email,
        role: initialData.role,
        adminNotes: initialData.adminNotes,
        skills: initialData.skills,
        desired_position: initialData.desired_position,
        cv: initialData.cv,
        profilePicture: initialData.profilePicture
      });
    } else {
      form.resetFields();
      setExistingCV(null);
      setFileToUpload(null);
    }
  }, [initialData, fileToUpload, existingCV, form]);

  const uploadProps = {
    beforeUpload: (file: File) => {
      setFileToUpload(file);
      return false;
    },
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialData}
      onFinish={handleSubmit}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="first_name" label="First Name" rules={[{ required: true }]}>
            <Input autoComplete="off" placeholder="Enter first name" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="last_name" label="Last Name" rules={[{ required: true }]}>
            <Input autoComplete="off" placeholder="Enter last name" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={18}>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input autoComplete="off" placeholder="Enter email" />
          </Form.Item>
        </Col>
        <Col span={5}>

          <Form.Item name="role" label="Role" rules={[{ required: true }]}>
            <Select placeholder="Select role">
              {Object.values(Role).map(role => (
                <Select.Option key={role} value={role}>{role}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

      </Row>


      {!isEditMode && (
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="password" label="Password" rules={[{ required: true, min: 6 }]}>
              <Input.Password autoComplete="new-password" placeholder="Enter password" />
            </Form.Item>
            </Col>
          <Col span={12}>
            <Form.Item name="password_confirmation" label="Confirm Password" rules={[{ required: true, min: 6 }]}>
              <Input.Password autoComplete="new-password" placeholder="Confirm password" />
            </Form.Item>
            </Col>
        </Row>
      )}

      <Form.Item name="adminNotes" label="Admin Notes">
        <Input.TextArea />
      </Form.Item>
      <Form.Item name="skills" label="Skills">
        <Form.List name="skills">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                 <Space key={key} align="baseline" style={{ marginBottom: 8 }}>
                 <Form.Item {...restField} name={[name, 'name']} >
                   <Input placeholder="Skill name" />
                 </Form.Item>
                 <Form.Item {...restField} name={[name, 'level']} >
                   <Select placeholder="Skill level">
                     <Select.Option value="beginner">Beginner</Select.Option>
                     <Select.Option value="intermediate">Intermediate</Select.Option>
                     <Select.Option value="advanced">Advanced</Select.Option>
                     <Select.Option value="expert">Expert</Select.Option>
                   </Select>
                 </Form.Item>
                 <Form.Item {...restField} name={[name, 'years_of_experience']} >
                   <InputNumber min={0} placeholder="Years" />
                 </Form.Item>
                 <MinusCircleOutlined onClick={() => remove(name)} style={{ cursor: 'pointer', color: 'red' }} />
               </Space>
              ))}
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add Skill
              </Button>
            </>
          )}
        </Form.List>
      </Form.Item>
      <Form.Item name={'desired_position'} label="Desired Position">
        <Input />
      </Form.Item>
      <Form.Item name={'salary_expectation'} label="Salary Expectation">
        <InputNumber style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item
        name="cv"
        label="CV"
      >
        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">{initialData?.cv ? <FilePdfOutlined /> : <InboxOutlined />}</p>
          <p className="ant-upload-text">{initialData?.cv ? `File Name: ${initialData?.cv}` : "Click or drag CV file to upload"}</p>

        </Dragger>


      </Form.Item>

    </Form>
  );
});

export default UserForm; 