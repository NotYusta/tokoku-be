export interface IConfig {
  readonly production: boolean;
  readonly app: {
    readonly port: number;
    readonly bind: string;
    readonly keys: {
      readonly jwtSecret: string;
      readonly encryptionKey: string;
    };
  };
  readonly db: {
    readonly name: string;
    readonly user: string;
    readonly password: string;
    readonly host: string;
    readonly port: number;
  };
  readonly paymentGateway: {
    readonly xenditApiKey: string;
  };
}
