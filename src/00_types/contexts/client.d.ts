export interface ClientContext {
  readonly userAgent: string;
  readonly ip: string;
  readonly origin?: string;
}
