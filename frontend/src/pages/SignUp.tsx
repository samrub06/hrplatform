import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Col, Form, Grid, Input, message, Radio, Row, theme, Typography } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { register } from "../services/auth.service";

const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Text, Title } = Typography;

const SignUp = () => {
	const { token } = useToken();
	const screens = useBreakpoint();
  const [loading, setLoading] = useState(false);
	const navigate = useNavigate(); 
	const { setUser } = useAuth();

	const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const userData = await register(values);
			setUser(userData); 
			navigate("/complete-profile"); 
			message.success("Registration Success");
    } catch (error) {
      console.error(error);
      // Gérez l'erreur (affichez un message, etc.)
    } finally {
      setLoading(false);
    }
  };

	const styles = {
		container: {
			margin: "0 auto",
			padding: screens.md ? `${token.paddingXL}px` : `${token.sizeXXL}px ${token.padding}px`,
			width: "380px"
		},
		footer: {
			marginTop: token.marginLG,
			textAlign: 'center' as 'center',
			width: '100%',
		},
		header: {
			marginBottom: token.marginXL
		},
		section: {
			alignItems: "center",
			backgroundColor: token.colorBgContainer,
			display: "flex",
			padding: screens.md ? `${token.sizeXXL}px 0px` : "0px"
		},
		text: {
			color: token.colorTextSecondary
		},
		title: {
			fontSize: screens.md ? token.fontSizeHeading2 : token.fontSizeHeading3
		}
	};

	return (
		<section style={styles.section}>
			<div style={styles.container}>
				<div style={styles.header}>
					<Title style={styles.title}>Inscription</Title>
					<Text style={styles.text}>
						Create your account to start.
					</Text>
				</div>
				<Form
					name="normal_signup"
					initialValues={{ remember: true }}
					onFinish={onFinish}
					layout="vertical"
					requiredMark="optional"
				>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								name="first_name"
								rules={[{ required: true, message: 'Please enter your first name' }]}
							>
								<Input placeholder="First Name" />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name="last_name"
								rules={[{ required: true, message: 'Please enter your last name' }]}
							>
								<Input placeholder="Last Name" />
							</Form.Item>
						</Col>
					</Row>

					<Form.Item
						name="email"
						rules={[{ required: true, type: 'email', message: 'Invalid email' }]}
					>
						<Input prefix={<MailOutlined />} placeholder="Email" />
					</Form.Item>
					<Col span={12}>
					
					</Col>
					<Form.Item
					
						name="role"
						rules={[{ required: true, message: 'Please choose a role' }]}
					>
						<Radio.Group buttonStyle="solid" style={{ display: 'flex', width: '100%' }}>
							<Radio.Button value="candidate" style={{ flex: 1, textAlign: 'center' }}>Candidate</Radio.Button>
							<Radio.Button value="publisher" style={{ flex: 1, textAlign: 'center' }}>Publisher</Radio.Button>
						</Radio.Group>
					</Form.Item>

					<Form.Item
						name="password"
						rules={[{ required: true, message: 'Password required' }]}
					>
						<Input.Password prefix={<LockOutlined />} placeholder="Password" />
					</Form.Item>

					<Form.Item
						name="password_confirmation"
						rules={[
							{ required: true, message: 'Confirmation required' },
							({ getFieldValue }) => ({
								validator(_, value) {
									if (!value || getFieldValue('password') === value) {
										return Promise.resolve();
									}
									return Promise.reject('Passwords do not match');
								},
							}),
						]}
					>
						<Input.Password prefix={<LockOutlined />} placeholder="Confirm password" />
					</Form.Item>

					<Form.Item>
						<Button block type="primary" htmlType="submit" loading={loading}>
							Sign up
						</Button>
					</Form.Item>
				</Form>
			</div>
		</section>
	);
};

export default SignUp;