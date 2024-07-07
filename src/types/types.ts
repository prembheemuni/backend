export interface newUserBody {
  username: string;
  email: string;
  fullname: string;
  password: string;
}

export type loginUserBody = Omit<newUserBody, "fullname">;
