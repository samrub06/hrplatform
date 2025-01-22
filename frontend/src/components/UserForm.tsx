import { GithubOutlined, InboxOutlined, LinkedinOutlined, MailOutlined, MinusCircleOutlined, PhoneOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, DatePicker, Form, Input, InputNumber, message, Row, Select, Space, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AuthUser } from '../interface/auth.interface';
import { UserData } from '../interface/user.interface';
import { updateEducation, updateSkills } from '../services/cv.service';
import { extractCVData, FileType, getPresignedUrl, uploadFileToS3 } from '../services/upload.service';
import { checkPermission, updateUser, updateUserRole } from '../services/user.service';

const { Dragger } = Upload;

interface UserFormProps {
  initialData?: UserData | null;
  onSuccess: () => void;
  onClose: () => void;
  setUploading: (loading: boolean) => void;
  partialForm?: 'personal' | 'documents' | 'skills' | 'links' | 'education';
  mode?: 'signup' | 'edit';
}

const UserForm = React.forwardRef<any, UserFormProps>(({
  initialData,
  onSuccess,
  onClose,
  setUploading,
  mode,
  partialForm
}, ref) => {
  const [form] = Form.useForm();
  const [existingCV, setExistingCV] = useState<string | null>(initialData?.cv || null);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const isEditMode = !!initialData;
  const { user, setUser } = useAuth();
  const { RangePicker } = DatePicker;
  React.useImperativeHandle(ref, () => ({
    submit: () => {
      form.submit();
    }
  }));
  const handleSubmit = async (values: any) => {
    try {
      setUploading(true);
      let dataToSubmit: any = {};
        // create case role 

      // Préparer les données selon l'étape
      switch (partialForm) {
        case 'personal':
          if (fileToUpload) {
            const presignedUrl = await getPresignedUrl(
              initialData?.id || '',
              fileToUpload.name,
              FileType.PROFILE_PICTURE
            );
            
            if (presignedUrl) {
              await uploadFileToS3(presignedUrl, fileToUpload);
              dataToSubmit.profilePicture = fileToUpload.name;
            }
          }

          dataToSubmit = {
            ...dataToSubmit,
            first_name: values.first_name,
            last_name: values.last_name,
            email: values.email,
            birthday: values.birthday,
            desired_position: values.desired_position,
            salary_expectation: values.salary_expectation,
            current_position: values.current_position,
            current_company: values.current_company,
          };
          if (values.role && values.role !== initialData?.role && mode !== 'signup') {
            const roleResponse = await updateUserRole(initialData?.id || '', values.role);
            if (roleResponse) {
              const permissionsResponse = await checkPermission();
              setUser({ 
                ...user, 
                role: values.role, 
                permissions: permissionsResponse 
              } as AuthUser);
            }
          }

          if (isEditMode && initialData?.id) {
            await updateUser(initialData.id, dataToSubmit);
            message.success('Profil mis à jour avec succès');
          }
          break;

        case 'documents':
          if (fileToUpload) {
            const presignedUrl = await getPresignedUrl(
              initialData?.id || '',
              fileToUpload.name,
              FileType.CV
            );
            
            if (presignedUrl) {
              await uploadFileToS3(presignedUrl, fileToUpload);
              dataToSubmit.cv = fileToUpload.name;
              await updateUser(initialData?.id || '', { cv: fileToUpload.name });
              setExistingCV(fileToUpload.name);
              const extractedData = await extractCVData(initialData?.id || "", fileToUpload.name);
              console.log('Données extraites du CV:', extractedData);
            }
          }
          break;

        case 'skills':
          dataToSubmit = {
            skills: values.skills?.map((skill: any) => ({
              name: skill.name.toLowerCase(),
              yearsOfExperience: parseInt(skill.years_of_experience) || 0,
            })) || []
          };
          await updateSkills(initialData?.id || '', dataToSubmit);
          break;

        case 'links':
          dataToSubmit = {
            email: values.email,
            phone_number: values.phone_number,
            github_link: values.github_link,
            linkedin_link: values.linkedin_link,
          };
          await updateUser(initialData?.id || '', dataToSubmit);
          break;

        case 'education':
          dataToSubmit = {
            education: values.education?.map((edu: any) => ({
              institution: edu.institution,
              degree: edu.degree,
              fieldOfStudy: edu.fieldOfStudy,
              startDate: edu.period[0],
              endDate: edu.period[1],
              description: edu.description
            })) || []
          };
          await updateEducation(initialData?.id || '', dataToSubmit);
          break;
      }

      onSuccess();
    } catch (error: any) {
      console.error('Erreur:', error);
      message.error(error.message || 'Une erreur est survenue');
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
        birthday: initialData.birthday,
        role: user?.role,
        adminNotes: initialData.adminNotes,
        current_position: initialData.current_position,
        current_company: initialData.current_company,
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
  }, [initialData, fileToUpload, existingCV, form, user]);



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
            
            { user?.role === 'candidate' && (
              <>
                <Form.Item name="desired_position" label="Desired Position">
                  <Input />
                </Form.Item>
                <Form.Item name="salary_expectation" label="Expected Salary">
                  <InputNumber style={{ width: '100%' }} />
                </Form.Item>
              </>
            )}

            {user?.role === 'publisher' && (
              <>
                <Form.Item name="current_position" label="Current Position">
                  <Input />
                </Form.Item>
                <Form.Item name="current_company" label="Current Company">
                  <Input />
                </Form.Item>
              </>
            )}
            {mode !== 'signup' && (
              <Form.Item name="role" label="Status">
                <Select>
                  <Select.Option value="publisher">Publisher</Select.Option>
                  <Select.Option value="candidate">Candidate</Select.Option>
                </Select>
              </Form.Item>
            )}

           {/*  <Form.Item 
              name="birthday" 
              label="Birthday"
              rules={[{ required: true, message: 'Birthday is required' }]}
            >
              <DatePicker 
                format="DD/MM/YYYY"
                style={{ width: '100%' }}
              />
            </Form.Item> */}
          </>
        );

      case 'documents':
        return (
          <>
            <Form.Item name="cv" label="CV">
              <Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                  { <InboxOutlined />}
                </p>
                <p className="ant-upload-text">
                  { "Click or drop your CV"}
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

      case 'education':
        return (
          <Form.Item name="education" label="Education">
            <Form.List name="education">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Card 
                      key={key} 
                      style={{ marginBottom: 16 }}
                      extra={<MinusCircleOutlined onClick={() => remove(name)} />}
                    >
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item
                            {...restField}
                            name={[name, 'institution']}
                            label="Institution"
                            rules={[{ required: true, message: 'Institution requise' }]}
                          >
                            <Input placeholder="Institution name" />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            {...restField}
                            name={[name, 'degree']}
                            label="Degree"
                            rules={[{ required: true, message: 'Degree is required' }]}
                          >
                            <Input placeholder="Degree" />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            {...restField}
                            name={[name, 'fieldOfStudy']}
                            label="Field of study"
                            rules={[{ required: true, message: 'Field of study is required' }]}
                          >
                            <Input placeholder="Field of study" />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            {...restField}
                            name={[name, 'period']}
                            label="Period"
                            rules={[{ required: true, message: 'Period is required' }]}
                          >
                            <RangePicker />
                          </Form.Item>
                        </Col>
                        <Col span={24}>
                          <Form.Item
                            {...restField}
                            name={[name, 'description']}
                            label="Description"
                          >
                            <Input.TextArea rows={4} placeholder="Description" />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Card>
                  ))}
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Add an education
                  </Button>
                </>
              )}
            </Form.List>
          </Form.Item>
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