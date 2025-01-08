import { AuthUser } from '@/interface/auth.interface';
import { GithubOutlined, InboxOutlined, LinkedinOutlined, MailOutlined, MinusCircleOutlined, PhoneOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, DatePicker, Form, Input, InputNumber, message, Row, Select, Space, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserData } from '../interface/user.interface';
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
              const response = await uploadFileToS3(presignedUrl, fileToUpload);
              console.log(response);
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
            if (values.role !== initialData?.role) {
              try {
                const roleResponse = await updateUserRole(initialData?.id || '', values.role);
                if (roleResponse) {
                  const permissionsResponse = await checkPermission();
                  setUser({ 
                      ...user, 
                    role: values.role, 
                    permissions: permissionsResponse 
                  } as AuthUser);
                }
              } catch (error) {
                message.error('Erreur lors de la mise à jour du rôle');
                console.error('Erreur:', error);
              }
            }

            dataToSubmit = {
              first_name: values.first_name,
              last_name: values.last_name,
              email: values.email,
              desired_position: values.desired_position,
              salary_expectation: values.salary_expectation,
              current_position: values.current_position,
              current_company: values.current_company,
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
            setExistingCV(fileToUpload.name);
            const extractedData = await extractCVData(initialData?.id || "", fileToUpload.name);
            console.log(extractedData);
          }
          break;

        case 'skills':
          dataToSubmit = {
            skills: values.skills?.map((skill: any) => ({
              language: skill.name,
              experience_years: parseInt(skill.years_of_experience) || 0,
             
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
          break;
      }

      if (isEditMode && initialData?.id) {
        await updateUser(initialData.id, dataToSubmit);
        message.success('Profile updated successfully');
        onSuccess();
      }
    } catch (error: any) {
      console.error('Error:', error);
      message.error(error.message);
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

  useEffect(() => {
    if (initialData?.skills) {
      const formattedSkills = initialData.skills?.map(skill => ({
        name: skill.language,
        years_of_experience: skill.experience_years,
       
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
            
            { (mode === 'signup' || user?.role === 'candidate') && (
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

            <Form.Item 
              name="birthday" 
              label="Date de naissance"
              rules={[{ required: true, message: 'Date de naissance requise' }]}
            >
              <DatePicker 
                style={{ width: '100%' }}
                format="DD/MM/YYYY"
              />
            </Form.Item>
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
                            <Input placeholder="Nom de l'institution" />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            {...restField}
                            name={[name, 'degree']}
                            label="Diplôme"
                            rules={[{ required: true, message: 'Diplôme requis' }]}
                          >
                            <Input placeholder="Nom du diplôme" />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            {...restField}
                            name={[name, 'fieldOfStudy']}
                            label="Domaine d'études"
                            rules={[{ required: true, message: 'Domaine requis' }]}
                          >
                            <Input placeholder="Domaine d'études" />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            {...restField}
                            name={[name, 'period']}
                            label="Période"
                            rules={[{ required: true, message: 'Période requise' }]}
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
                            <Input.TextArea rows={4} placeholder="Description du programme" />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Card>
                  ))}
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Ajouter une formation
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