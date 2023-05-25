import { Box, Button, TextField } from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import React, { useState } from "react";
interface Props {
  open: boolean;
  title: string;
  onClose: () => void;
  onAccept: (value: string) => void;
  value: any;
  error?: boolean;
  helperText?: string;
}
const useStyles = makeStyles((theme) => ({
  ventana: {
    borderRadius: "6%",
    position: "absolute",
    width: "400",
    backgroundColor: "white",
    border: "2 px solid #f8f4f4",
    boxShadow: theme.shadows[3],
    padding: "16px 32px 24px",
    top: "35%",
    left: "35%",
    transform: "translate(-35% - 35%) ",
  },
  textField: {
    width: "100%",
  },
}));

export const ModalCategoria: React.FC<Props> = ({
  open,
  title,
  onClose,
  onAccept,
  error,
  helperText,
}) => {
  const classes = useStyles();
  const [value, setValue] = useState("");

  const body = (
    <div className={classes.ventana}>
      <div style={{ alignItems: "Flex-start" }}>
        <h4>{title}</h4>
      </div>
      <TextField
        type="text"
        autoFocus
        id="number"
        fullWidth={true}
        variant="outlined"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        error={error}
        helperText={helperText}
      />
      <Box display="flex" justifyContent="flex-end" paddingTop="10%">
       { value === "" ? error : <Button
          style={{ marginRight: 20 }}
          variant="contained"
          onClick={() => {
            onAccept(value);
            onClose();
          }}
          color="primary"
        >
          Guardar
        </Button>}
        <Button variant="contained" onClick={onClose}>
          Cancelar
        </Button>
      </Box>
    </div>
  );

  return (
    <div>
      <Modal open={open} onClose={onClose}>
        {body}
      </Modal>
    </div>
  );
};
