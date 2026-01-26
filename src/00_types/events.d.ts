export interface Event<T> {}
export type EventEmitHandler<T> = (data: T) => Promise<void>;

// src/00_types/events.ts
export interface EventEmitter<T> {
  register(handler: EventEmitHandler<T>): void;
  emit(payload: T): Promise<void>;
}
