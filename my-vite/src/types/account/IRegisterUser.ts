import type {UploadFile} from "antd";
import type {RcFile} from "antd/es/upload";

export interface IRegisterUser {
    email: string;
    password: string;
    confirmPassword: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    image: RcFile | null | Array<UploadFile>;
}