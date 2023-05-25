export interface DialogBase {
  open: boolean;
  selected?: any;
  state: DialogState;
  regions?: any;
}

export type DialogAction = "New" | "Edit" | "Block" | "Unblock";
export type DialogState = "Initial" | "Submitting";

export interface DialogAdd extends DialogBase {
  action: DialogAction;
}
