export interface ISelectedOption {
  optionId: number;
  valueIds?: number[];
  customValue?: string;
}

export interface ICreateOrderProductPayload {
  userId: number;
  productId: number;
  quantity: number;
  selectedOptions?: ISelectedOption[];
  payerEmail?: string;
}
