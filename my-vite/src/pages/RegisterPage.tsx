import {Button, Form, Input} from "antd";
import type {IRegisterUser} from "../types/account/IRegisterUser.ts";

const RegisterPage = () => {
    const [form] = Form.useForm<IRegisterUser>();

    const onFinish = (values: IRegisterUser) => {
        console.log('Success:', values);
    }

    return (
        <>
            <div className="container mx-auto px-4 py-8">
                <h1 className="mb-4 text-center text-4xl font-bold tracking-tight text-heading md:text-5xl lg:text-6xl">
                    Реєстрація користувача
                </h1>

                <Form onFinish={onFinish}
                      form={form}
                      labelCol={{span: 4}}
                      wrapperCol={{span: 14}}
                      layout={"horizontal"}
                >
                    <Form.Item<IRegisterUser>
                        label={"Електронна пошта"}
                        name={"email"}
                        rules={[{ required: true, message: 'Вкажіть пошту'}]}
                        >
                        <Input/>
                    </Form.Item>

                    <Form.Item<IRegisterUser>
                        label={"Прізвище"}
                        name={"lastName"}
                        rules={[{ required: true, message: 'Вкажіть прізвище'}]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item label={null}>
                        <Button type="primary" htmlType="submit">
                            Реєстрація
                        </Button>
                    </Form.Item>

                </Form>

            </div>
        </>
    );
}

export default RegisterPage;