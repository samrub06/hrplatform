import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Grid, Input, theme, Typography } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/auth.service";

const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Text, Title, Link } = Typography;

const SignUp = () => {
	const { token } = useToken();
	const screens = useBreakpoint();
  const [loading, setLoading] = useState(false);
	const navigate = useNavigate(); 
	
	const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await register(values); 
			navigate("/dashboard"); 
			
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
					<Title style={styles.title}>Sign Up</Title>
					<Text style={styles.text}>
						Create your account to get started.
					</Text>
				</div>
				<Form
					name="normal_signup"
					initialValues={{
						remember: true,
					}}
					onFinish={onFinish}
					layout="vertical"
					requiredMark="optional"
				>
					<Form.Item
						name="email"
						rules={[
							{
								type: "email",
								required: true,
								message: "Please input your Email!",
							},
						]}
					>
						<Input
							prefix={<MailOutlined />}
							placeholder="Email"
						/>
					</Form.Item>
					<Form.Item
						name="password"
						rules={[
							{
								required: true,
								message: "Please input your Password!",
							},
						]}
					>
						<Input.Password
							prefix={<LockOutlined />}
							type="password"
							placeholder="Password"
						/>
					</Form.Item>
					<Form.Item
						name="password_confirmation"
						rules={[
							{
								required: true,
								message: "Please confirm your Password!",
							},
							({ getFieldValue }) => ({
								validator(_, value) {
									if (!value || getFieldValue('password') === value) {
										return Promise.resolve();
									}
									return Promise.reject(new Error('The two passwords do not match!'));
								},
							}),
						]}
					>
						<Input.Password
							prefix={<LockOutlined />}
							type="password"
							placeholder="Confirm Password"
						/>
					</Form.Item>
					<Form.Item>
						<Form.Item name="remember" valuePropName="checked" noStyle>
							<Checkbox>Remember me</Checkbox>
						</Form.Item>
					</Form.Item>
					<Form.Item style={{ marginBottom: "0px" }}>
						<Button block type="primary" htmlType="submit"  loading={loading}>
							Sign Up
						</Button>
						<div style={styles.footer}>
							<Text style={styles.text}>Already have an account?</Text>{" "}
							<Link href="/auth/login">Log in now</Link>
						</div>
					</Form.Item>
				</Form>
			</div>
		</section>
	);
};

export default SignUp;