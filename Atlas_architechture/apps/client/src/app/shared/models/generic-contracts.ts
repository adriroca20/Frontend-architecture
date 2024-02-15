export interface GenericUpdate {
  message?: string;
}

export interface GenericCreate extends GenericUpdate {
  id: number;
}