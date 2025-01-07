import { GoogleOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Form, Grid, Input, Space, theme, Typography } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { login, loginGoogle } from "../services/auth.service";

const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Text, Title, Link } = Typography;

export default function LoginPage() {
  const { token } = useToken();
  const screens = useBreakpoint();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const userData = await login(values);
      setUser(userData);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      // Gérez l'erreur (affichez un message, etc.)
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    loginGoogle();
  };

  const styles = {
    container: {
      margin: "0 auto",
      padding: screens.md ? `${token.paddingXL}px` : `${token.sizeXXL}px ${token.padding}px`,
      width: "380px"
    },
    footer: {
      footer: {
        marginTop: token.marginLG,
        textAlign: 'center' as 'center', // Ajoutez 'as' pour indiquer le type
        width: '100%',
      },
    },
    forgotPassword: {
      float: "right"
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
    },
    googleButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      width: '100%',
      border: '1px solid #ddd',
      borderRadius: '6px',

      color: '#757575',
      fontSize: '14px',
      fontWeight: 500,
      cursor: 'pointer',

    },
    googleIcon: {
      fontSize: '20px',
      color: '#4285f4'
    }
  };

  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>

          <Title style={styles.title}>Sign in</Title>
          <Text style={styles.text}>
            Welcome back to HR Platform! Please enter your details below to
            sign in.
          </Text>
        </div>
        <Form
          name="normal_login"
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

          <Form.Item >
            <Space style={{ width: "100%" }} direction="vertical" size={16}>
              <Button block type="primary" htmlType="submit" loading={loading}>
                Log in
              </Button>
              <Button
                block
                onClick={handleGoogleLogin}
                icon={<GoogleOutlined style={styles.googleIcon} />}
                style={styles.googleButton}
              >
                Continue with Google
              </Button>
            </Space>

            <Space style={{ marginTop: "10px" }}>
              <div>
                <a href="/forgot-password">
                  Forgot password?
                </a>
              </div>
              <div>
                <Text style={styles.text}>Don't have an account?</Text>{" "}
                <Link href="/auth/signup">Sign up now</Link>
              </div>
            </Space>
          </Form.Item>

        </Form>
      </div>
    </section>
  );
}