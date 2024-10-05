import { SignUpModel } from "root/constants/types/authFunctions";
import { instance } from "src/api";

export const signUp = async (signUpUrl: string, payload: SignUpModel) => {
  const response = await instance.request({
    method: "post",
    url: `auth/${signUpUrl}`,
    data: payload,
  });
  return response;
};

export const signIn = async (signInUrl: string, payload: SignUpModel) => {
  console.log(payload, `auth/${signInUrl}`, "heree");
  const response = await instance.request({
    method: "post",
    url: `auth/${signInUrl}`,
    data: payload,
  });
  return response;
};
