import {
  Box,
  Button,
  CardContent,
  CardHeader,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  Grid,
  IconButton,
  Link,
  Breadcrumbs as MuiBreadcrumbs,
  Card as MuiCard,
  Divider as MuiDivider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { green, red } from "@material-ui/core/colors";
import { Edit, ExpandLess, ExpandMore } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
import { Autocomplete } from "@material-ui/lab";
import { spacing } from "@material-ui/system";
import React, { useEffect, useState } from "react";
import { MinusSquare, Search, Trash } from "react-feather";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import {  NavLink, useHistory } from "react-router-dom";
import styled from "styled-components/macro";
import { ModalGrades } from "../../../components/ModalGrades";
import { TableSkeleton } from "../../../components/TableSkeleton";
import { TABLE_LIMITS, TABLE_LIMIT_DEFAULT } from "../../../constants";
import { useTable } from "../../../hooks/useTable";
import { Grade } from "../../../models/Grade";
import { FormState } from "../../../models/form_state";
import {
  addGrade,
  deleteGrade,
  getGrades,
  getMoreGrades,
  setAddGradeInital,
  setDeleteGradeInital,
  setEditGradeInital,
  updateGrade,
} from "../../../redux/actions/gradeActions";
import {
  getUsers,
  getUsersFiltered,
  setSelectedUser,
} from "../../../redux/actions/usersActions";
import { GradeState } from "../../../redux/reducers/gradeReducer";
import { RootState } from "../../../redux/reducers/rootReducer";
import { usersReducer } from "../../../redux/reducers/usersReducer";
import { useStyles } from "../../../theme/useStyles";
import { cleanString } from "../../../utils/utils";
import SchedulePicker from "../../../components/CreateSchedule/SchedulePicker";

const Card = styled(MuiCard)(spacing);

const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const orderByUsers = ["Nombre", "Fecha", "Tipo usuario"];

interface filterProps {
  changeOrder: (value: any) => void;
}

const ContentCard = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const [sortBy, setSortBy] = useState("Nombre_lower");
  const [subjectData, setSubjectData] = useState<any>(null);
  const [currentFilter, setCurrentFilter] = useState<any>({});
  const [openCreateEditModal, setOpenCreateEditModal] = useState(false);
  const [selected, setSelected] = useState<Grade | null>(null);
  const [openDeleteModal, setopenDeleteModal] = useState(false);
  const [modalState, setModalState] = useState({
    open: false,
    action: "",
    state: "",
  });

  const handleCloseStateModal = () => {
    setModalState({
      open: false,
      action: "",
      state: "",
    });
    dispatch(setAddGradeInital());
    dispatch(setDeleteGradeInital());
    dispatch(setEditGradeInital());
  };

 
  const handleChangeOrder = (order: any) => {
    dispatch(getUsers(limit, order));
  };

  const { limit, page, handleLimitChange, handlePageChange } = useTable({
    limit: TABLE_LIMIT_DEFAULT || 5,
    onLimitChange: (e, newLimit) => {
      if (newLimit > usersReducer.length) {
        if (currentFilter) {
        }
        dispatch(getGrades(newLimit));
      }
    },
    onPageChange: (newPage, oldPage, limit) => {
      if (grades.length < totalDocs && newPage > oldPage) {
        dispatch(getMoreGrades(limit));
      }
    },
  });

  useEffect(() => {
    dispatch(getGrades());
  }, []);

  const {
    grades,
    state,
    totalDocs,
    add: { state: addState },
    delete: { state: deleteState },
    edit: { state: editState },
  } = useSelector<RootState, GradeState>((state) => state.gradeReducer);

  useEffect(() => {
    if (addState === FormState.Success) {
      setModalState({
        open: true,
        action: "Creado",
        state: "con éxito",
      });
    }
    if (editState === FormState.Success) {
      setModalState({
        open: true,
        action: "Editado",
        state: "con éxito",
      });
    }

    if (deleteState === FormState.Success) {
      setModalState({
        open: true,
        action: "Eliminado",
        state: "con éxito",
      });
    }
  }, [addState, deleteState, editState]);
  return (
    <>
      <CardHeader />
      <Card mb={6}>
        <CardContent>
          <SchedulePicker />
        </CardContent>
      </Card>
      
      <Dialog open={modalState.open} onClose={handleCloseStateModal}>
        {" "}
        {/* son cuadros de dialogos */}
        <DialogTitle>{`Curso ${modalState.action}`}</DialogTitle>
        <DialogContent>
          {`El curso se ha ${cleanString(modalState.action)} ${
            modalState.state
          }`}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseStateModal()}>Aceptar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};


export const ScheduleList = () => {
  return (
    <React.Fragment>
      <Helmet title="Crear Horario" />
      <Typography variant="h3" gutterBottom display="inline">
        Crear Horario
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} exact to={"/cursosHorario"}>
          Lista de Cursos
        </Link>
        <Typography>Crear Horario</Typography>
      </Breadcrumbs>

      <Divider my={6} />

      <Grid container spacing={6}>
        <Grid item xs={12}>
          <ContentCard />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};
