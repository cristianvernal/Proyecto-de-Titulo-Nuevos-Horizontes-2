import { Box, Button, TextField, Typography } from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
interface Props {
  open: boolean;
  title: string;
  action: string;
  path: string;
  onClose: () => void;
  onAccept: () => void;
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

export const ModalMessageAction: React.FC<Props> = ({
  open,
  title,
  action,
  path,
  onClose,
  onAccept,
}) => {
  const classes = useStyles();
  const [value, setValue] = useState("");

  const history = useHistory();
  const body = (
    <div className={classes.ventana}>
      <div style={{ alignItems: "Flex-start" }}>
        <h4>{title}</h4>
      </div>
      <Typography>{`${title} ${action} con éxito`} </Typography>
      <Box display="flex" justifyContent="flex-end" paddingTop="10%">
        <Button
          style={{ marginRight: 20 }}
          variant="contained"
          onClick={() => {
            history.push(path);
          }}
          color="primary"
        >
          Guardar
        </Button>
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
