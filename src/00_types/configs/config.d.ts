export interface IConfig {
  readonly production: boolean;
  readonly app: {
    readonly allowedOrigins: string[];
    readonly url: string; 
    readonly port: number;
    readonly bind: string;
    readonly trustedProxies: string[];
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
    readonly xendit: {
      readonly apiKey: string;
      readonly webhookToken: string;
    };
  };
  readonly notifications: {
    readonly webhooks: {
      readonly discord: string[];
      readonly custom: string[];
    };
  };
}
