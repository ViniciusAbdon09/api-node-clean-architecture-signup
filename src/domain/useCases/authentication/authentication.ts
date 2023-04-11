export interface AuthenticationModel {
  email: string,
  password: string
}
export interface Authentication {
  auth(athentication: AuthenticationModel): Promise<string>;
}
