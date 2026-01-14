import React from "react";
import {Typography, Card, Row, Form, type FormProps, Input, Button} from "antd";
import {useNavigate} from "react-router-dom";
import type {IForgotPassword} from "../types/account/IResetPasswordRequest.ts";
import axios from "axios";
import {APP_ENV} from "../env";
const { Title, Text } = Typography;

const ForgotPasswordPage: React.FC = () => {

    const [form] = Form.useForm();
    // const [resetRequest, { isLoading }] = useResetPasswordRequestMutation();
    const navigate = useNavigate();

    const onFinish: FormProps<IForgotPassword>["onFinish"] = async (values) => {
        try {
            console.log("Request password", values);

            const result = await axios.post(APP_ENV.SERVER_URL + "/api/users/forgot-password/",
                values,
                {
                    headers:
                        {
                            'Content-Type': 'multipart/form-data',
                        }
                }
            );
            console.log(result)
            navigate('/success-confirm');
        } catch (err: any) {
            const errorMessage = err?.data?.errors?.Name?.[0];
            console.error(errorMessage);
        }
    };

    return (
        <div
            style={{
        minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f5f5f5",
            padding: "20px",
    }}
>
    <Card
        style={{
        maxWidth: 900,
            width: "100%",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    }}
>
    <Row>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
    <Title level={3} style={{ marginBottom: 0 }}>
    Forgot Password?
        </Title>
        <Text>Enter your information to reset</Text>
    </div>
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            style={{ width: "100%" }}
        >
            <Form.Item
                label="Email"
                name="email"
                rules={[
                    { required: true, message: "Please enter your email" },
                    { type: "email", message: "Invalid email format" },
                ]}
            >
                <Input placeholder="johnsmith@example.com" />
            </Form.Item>

            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    block
                    style={{ height: "40px", fontWeight: 600 }}
                >
                    Reset
                </Button>
            </Form.Item>
        </Form>
    </Row>
    </Card>
    </div>
);
};

export default ForgotPasswordPage;