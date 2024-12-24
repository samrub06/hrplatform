import { FilePdfOutlined, GithubOutlined, InboxOutlined, LinkedinOutlined, MailOutlined, MinusCircleOutlined, PhoneOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, InputNumber, message, Row, Select, Space, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import { UserData } from '../interface/user.interface';
import { extractCVData, FileType, getPresignedUrl, uploadFileToS3 } from '../services/upload.service';
import { updateUser } from '../services/user.service';

const { Dragger } = Upload;

interface UserFormProps {
  initialData?: UserData | null;
  onSuccess: () => void;
  onClose: () => void;
  setUploading: (loading: boolean) => void;
  partialForm?: 'personal' | 'documents' | 'skills' | 'links'; 

}

const UserForm = React.forwardRef<any, UserFormProps>(({
  initialData,
  onSuccess,
  onClose,
  setUploading,
  partialForm
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
console.log(initialData);
  const handleSubmit = async (values: any) => {
    try {
      setUploading(true);
      let dataToSubmit: any = {};

      switch (partialForm) {
        case 'personal':
          if (fileToUpload) {
            const presignedUrl = await getPresignedUrl(
              initialData?.id || '',
              fileToUpload.name,
              FileType.PROFILE_PICTURE
            );
            if(presignedUrl){
              console.log(presignedUrl);
              await uploadFileToS3(presignedUrl, fileToUpload);
            }
            dataToSubmit = {
              first_name: values.first_name,
              last_name: values.last_name,
              email: values.email,
              desired_position: values.desired_position,
              salary_expectation: values.salary_expectation,
              profilePicture: fileToUpload.name,
            };
          } else {
            dataToSubmit = {
              first_name: values.first_name,
              last_name: values.last_name,
              email: values.email,
              desired_position: values.desired_position,
              salary_expectation: values.salary_expectation,
            };
          }
          break;

        case 'documents':
          if (fileToUpload) {
            const presignedUrl = await getPresignedUrl(
              initialData?.id|| '',
              fileToUpload.name,
              FileType.CV
            );
            await uploadFileToS3(presignedUrl, fileToUpload);
            dataToSubmit = { 
              cv: fileToUpload.name,
            };
            const extractedData = await extractCVData(initialData?.id || "", fileToUpload.name);
            console.log(extractedData);

          }
          break;

        case 'skills':
          dataToSubmit = {
            skills: values.skills?.map((skill: any) => ({
              language: skill.name,
              experience_years: parseInt(skill.years_of_experience) || 0,
              level: skill.level === 'beginner' ? 1 : 
                     skill.level === 'intermediate' ? 2 :
                     skill.level === 'advanced' ? 3 : 4
            })) || []
          };
          break;

        case 'links':
          dataToSubmit = {
            email: values.email,
            phone_number: values.phone_number,
            github_link: values.github_link,
            linkedin_link: values.linkedin_link,
          };
          break;
      }

      if (isEditMode && initialData?.id) {
        await updateUser(initialData.id, dataToSubmit);
        message.success('Profile updated successfully');
        onSuccess();
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('Error updating profile');
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
        profilePicture: initialData.profilePicture,
        phone_number: initialData.phone_number,
        github_link: initialData.github_link,
        linkedin_link: initialData.linkedin_link,
      });
    } else {
      form.resetFields();
      setExistingCV(null);
      setFileToUpload(null);
    }
  }, [initialData, fileToUpload, existingCV, form]);

  useEffect(() => {
    if (initialData?.skills) {
      const formattedSkills = initialData.skills.map(skill => ({
        name: skill.language,
        years_of_experience: skill.experience_years,
        level: skill.level === 1 ? 'beginner' :
               skill.level === 2 ? 'intermediate' :
               skill.level === 3 ? 'advanced' : 'expert'
      }));
      form.setFieldsValue({
        ...initialData,
        skills: formattedSkills
      });
    }
  }, [initialData, form]);

  const uploadProps = {
    beforeUpload: (file: File) => {
      setFileToUpload(file);
      return false;
    },
  };

  const renderFormFields = () => {
    switch (partialForm) {
      case 'personal':
        return (
          <>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item name="profilePicture" label="Profile Picture">
                  <Upload 
                    {...uploadProps}
                    maxCount={1}
                    listType="picture-card"
                    showUploadList={true}
                  >
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  </Upload>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="first_name" label="First Name" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="last_name" label="Last Name" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="desired_position" label="Desired Position">
              <Input />
            </Form.Item>
            <Form.Item name="salary_expectation" label="Expected Salary">
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </>
        );

      case 'documents':
        return (
          <>
            <Form.Item name="cv" label="CV">
              <Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                  {initialData?.cv ? <FilePdfOutlined /> : <InboxOutlined />}
                </p>
                <p className="ant-upload-text">
                  {initialData?.cv ? `File: ${initialData?.cv}` : "Click or drop your CV"}
                </p>
              </Dragger>
            </Form.Item>
         
          </>
        );

      case 'skills':
        return (
          <Form.Item name="skills" label="Skills">
            <Form.List name="skills">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} align="baseline">
                      <Form.Item {...restField} name={[name, 'name']}>
                        <Input placeholder="Skill name" />
                      </Form.Item>
                      <Form.Item {...restField} name={[name, 'level']}>
                        <Select placeholder="Level">
                          <Select.Option value="beginner">Débutant</Select.Option>
                          <Select.Option value="intermediate">Intermédiaire</Select.Option>
                          <Select.Option value="advanced">Avancé</Select.Option>
                          <Select.Option value="expert">Expert</Select.Option>
                        </Select>
                      </Form.Item>
                      <Form.Item {...restField} name={[name, 'years_of_experience']}>
                        <InputNumber min={0} placeholder="Years" />
                      </Form.Item>
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
        );

      case 'links':
        return (
          <>
            <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
              <Input prefix={<MailOutlined />} />
            </Form.Item>
            <Form.Item name="phone_number" label="Phone Number">
              <Input prefix={<PhoneOutlined />} />
            </Form.Item>
            <Form.Item name="github_link" label="GitHub Link">
              <Input prefix={<GithubOutlined />} />
            </Form.Item>
            <Form.Item name="linkedin_link" label="LinkedIn Link">
              <Input prefix={<LinkedinOutlined />} />
            </Form.Item>
          </>
        );
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
    >
      {renderFormFields()}
    </Form>
  );
});

export default UserForm; 