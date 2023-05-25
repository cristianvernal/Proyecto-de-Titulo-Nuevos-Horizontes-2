import { useEffect, useState } from "react";
import { DialogBase } from "../models/dialog_state";

interface Params {
  onConfirm: (selected: any) => void;
  onClose?: () => void;
}

export const useConfirmDialog = (params: Params) => {
  const { onConfirm, onClose } = params;

  const [isLoading, setIsLoading] = useState(false);

  const [confirmDialog, setConfirmDialog] = useState<DialogBase>({
    open: false,
    state: "Initial",
  });

  useEffect(() => {
    if (!isLoading && confirmDialog.state === "Submitting") {
      setConfirmDialog({ state: "Initial", open: false });
      if (onClose) {
        onClose();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmDialog.state, isLoading]);

  const dialogConfirmHandleClose = () => {
    setConfirmDialog({ ...confirmDialog, open: false });
  };
  const dialogConfirmHandleConfirm = () => {
    setConfirmDialog({ ...confirmDialog, state: "Submitting" });
    onConfirm(confirmDialog.selected);
  };

  const openDialog = (selected: any) => {
    setConfirmDialog({ ...confirmDialog, open: true, selected });
  };

  return {
    setIsLoading,
    dialogConfirmHandleClose,
    dialogConfirmHandleConfirm,
    openDialog,
    open: confirmDialog.open,
    selected: confirmDialog.selected,
  };
};
