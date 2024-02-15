export enum Action {
  create = 'Create',
  edit = 'Edit',
  delete = 'Delete',
  cancel = 'Cancel',
  confirm = 'Confirm',
}

export interface GenericPopupInput {
  action: Action;
  headerMessage: string;
}

export interface GenericPopupOutput {
  action: Action;
}