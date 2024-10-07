// Login
export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface UserData {
  email: string;
  id: string;
  name: string;
  verified: boolean;
}

export interface LoginResponse {
  message: string;
  tokens: Tokens;
  userData: UserData;
}

export interface AuthSliceState {
  loading: boolean;
  userData: UserData | null;
}

// Sign Up
export interface SignUpResponse {}

// Verify Email
export interface VerifyEmailResponse {}

// Fetch Profile
export interface ProfileResponse {
  profile: UserData & {
    avatar?: {
      url: string;
      id: string;
    };
  };
}

// Request Models
export type SignUpModel = {
  email: string;
  name: string;
  password: string;
};
export type SignInModel = {
  email: string;
  password: string;
};
export type VerifyEmailModel = {
  email: string;
};
