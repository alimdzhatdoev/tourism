export interface FormInterface {
  values: Record<string, any>;
  setValue: (field: string, value: any) => void;
}
