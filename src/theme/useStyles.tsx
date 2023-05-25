import { blueGrey, green, red } from "@material-ui/core/colors";
import { Theme } from "@material-ui/core/styles";
import { createStyles, makeStyles } from "@material-ui/styles";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    "@global": {
      th: {
        backgroundColor: "white!important",
      },
    },
    formControl: {
      minWidth: 120,
      maxWidth: 300,
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    chips: {
      display: "flex",
      flexWrap: "wrap",
    },
    chip: {
      margin: 2,
    },
    noLabel: {
      marginTop: theme.spacing(3),
    },
    deleteBtn: {
      backgroundColor: red[400],
      color: "white",
      "&:hover": {
        backgroundColor: red[700],
      },
    },
    centerBtn: {
      backgroundColor: green[400],
      color: "white",
      "&:hover": {
        backgroundColor: green[700],
      },
    },
    editBtn: {
      backgroundColor: green[400],
      color: "white",
      "&:hover": {
        backgroundColor: green[700],
      },
    },
    textField: {
      marginBottom: theme.spacing(4),
    },
    tableContainer: {
      maxHeight: "60vh",
    },
    styledRow: {
      "&:nth-of-type(odd)": {
        backgroundColor: blueGrey[50],
      },
    },

    paper: {
      border: "1px solid black",
    },
    acceptDeleteButton: {
      color: red[400],
    },
  })
);

export const GlobalStyles = () => {
  useStyles();
  return null;
};
