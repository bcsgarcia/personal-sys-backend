export class AccessTokenDto {
  accessToken: string;

  constructor(token: string) {
    this.accessToken = token;
  }
}
