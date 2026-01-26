export interface Notifier<Input = any, Payload = any> {
  /**
   * Main notify function that sends the payload
   */
  notify(payload: Payload): Promise<void>;

  /**
   * Transform an input into the payload for this notifier
   */
  transform(input: Input): Payload;
}
