import { useEffect, useState } from "react";
import { DialogAction, DialogAdd, DialogState } from "../models/dialog_state";

interface Params {
  onAccept: (values: any, action: DialogAction) => void;
  onClose?: () => void;
  onOpenNewDialog?: () => void;
}

export const useNewEditDialog = (params: Params) => {
  const { onAccept: onAcceptParam, onClose, onOpenNewDialog } = params;
  const [isLoading, setIsLoading] = useState(false);
  const initialState: DialogAdd = {
    open: false,
    action: "New",
    state: "Initial",
  };

  const [dialog, setDialog] = useState<DialogAdd>(initialState);

  useEffect(() => {
    if (!isLoading && dialog.state === "Submitting") {
      setDialog(initialState);
      if (onClose) {
        onClose();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialog.state, isLoading]);

  const openNewDialog = () => {
    setDialog({
      ...dialog,
      open: true,
      action: "New",
    });
    if (onOpenNewDialog) onOpenNewDialog();
  };

  const openEditDialog = (selected: any) => {
    setDialog({
      ...dialog,
      open: true,
      action: "Edit",
      selected,
    });
  };

  const closeDialog = () => {
    setDialog(initialState);
    if (onClose) onClose();
  };

  const setState = (state: DialogState) => {
    setDialog({ ...dialog, state });
  };

  const onAccept = (values: any, action: DialogAction) => {
    onAcceptParam(values, action);
    setDialog({ ...dialog, state: "Submitting" });
  };

  return {
    setIsLoading,
    ...dialog,
    openNewDialog,
    openEditDialog,
    closeDialog,
    setState,
    onAccept,
  };
};
