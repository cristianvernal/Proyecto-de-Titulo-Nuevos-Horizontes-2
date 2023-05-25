import React from "react";
import { Button, Dialog, DialogActions, DialogTitle } from "@material-ui/core";

interface Props {
  open: boolean;
  title: string;
  onClose: () => void;
  isLoading: boolean;
  onConfirm: () => void;
  onConfirmText: string;
}

export const ConfirmDialog: React.FC<Props> = ({
  title,
  onClose,
  onConfirm,
  open,
  isLoading,
  onConfirmText,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle id="dialog-confirm-title">{title}</DialogTitle>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button color="primary" disabled={isLoading} onClick={onConfirm}>
          {onConfirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
