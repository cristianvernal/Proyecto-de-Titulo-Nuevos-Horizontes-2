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
import { NavLink, useHistory, useParams } from "react-router-dom";
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
import { getSchedule, setAddScheduleInital, setEditScheduleInital } from "../../../redux/actions/schedule.Action";
import { ScheduleState } from "../../../redux/reducers/scheduleReducer";
import SchedulePickerEdit from "../../../components/EditSchedule/SchedulePickerEdit";

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
  const idCurso = useParams() as any;
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
    message: "",
  });

  const handleCloseStateModal = () => {
    setModalState({
      open: false,
      action: "",
      message: "",
    });
    dispatch(setAddScheduleInital())
    dispatch(setEditScheduleInital())
  };

  useEffect(() => {
    dispatch(getGrades());
    dispatch(getSchedule(idCurso.gradeId));
  }, []);

  const { schedule } = useSelector<RootState, ScheduleState>(
    (state) => state.scheduleReducer
  );

  const {
    add: { state: addState },
    edit: { state: editState },
  } = useSelector<RootState, ScheduleState>((state) => state.scheduleReducer);

  useEffect(() => {
    if (addState === FormState.Success) {
      setModalState({
        open: true,
        action: "Horario Creado",
        message: "Horario creado con éxito",
      });
    } else if (addState === FormState.Failure) {
      setModalState({
        open: true,
        action: "Error",
        message: "Error al crear el horario",
      });
    }
    if (editState === FormState.Success) {
      setModalState({
        open: true,
        action: "Horario Editado",
        message: "Horario editado con éxito",
      });
    } else if (editState === FormState.Failure) {
      setModalState({
        open: true,
        action: "Error",
        message: "Error al editar el horario",
      });
    }
  }, [addState, editState]);
  return (
    <>
      <CardHeader />
      <Card mb={6}>
        <CardContent>
          <SchedulePickerEdit selectedSchedule={schedule}/>
        </CardContent>
      </Card>

      <Dialog open={modalState.open} onClose={handleCloseStateModal}>
        {" "}
        {/* son cuadros de dialogos */}
        <DialogTitle>{`${modalState.action}`}</DialogTitle>
        <DialogContent>
          {modalState.message}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseStateModal()}>Aceptar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
  
};

export const EditScheduleList = () => {
  return (
    <React.Fragment>
      <Helmet title="Editar Horario" />
      <Typography variant="h3" gutterBottom display="inline">
        Editar Horario
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} exact to={"/cursosHorario"}>
          Lista de Cursos
        </Link>
        <Typography>Editar Horario</Typography>
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
