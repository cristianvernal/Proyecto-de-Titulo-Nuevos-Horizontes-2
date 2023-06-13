import {
    Box,
    Breadcrumbs as MuiBreadcrumbs,
    Button,
    Card as MuiCard,
    CardContent,
    CardHeader,
    Chip,
    Collapse,
    Divider as MuiDivider,
    Fade,
    Grid,
    IconButton,
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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
  } from "@material-ui/core";
  import AddIcon from "@material-ui/icons/Add";
  import { green, red } from "@material-ui/core/colors";
  import { Edit, ExpandLess, ExpandMore } from "@material-ui/icons";
  import { Autocomplete } from "@material-ui/lab";
  import { spacing } from "@material-ui/system";
  import React, { useEffect, useState } from "react";
  import { Download, Eye, MinusSquare, Search, Trash } from "react-feather";
  import { Helmet } from "react-helmet-async";
  import { useDispatch, useSelector } from "react-redux";
  import { useHistory } from "react-router-dom";
  import styled from "styled-components/macro";
  import { TableSkeleton } from "../../components/TableSkeleton";
  import { TABLE_LIMITS, TABLE_LIMIT_DEFAULT } from "../../constants";
  import { FormState } from "../../models/form_state";
  import {
    getMoreUsers,
    getUsers,
    getUsersFiltered,
    setSelectedUser,
  } from "../../redux/actions/usersActions";
  import { RootState } from "../../redux/reducers/rootReducer";
  import { IUsersState, usersReducer } from "../../redux/reducers/usersReducer";
  import { useStyles } from "../../theme/useStyles";
  import { cleanString, exportToCsv, timesStampFormattedsimple } from "../../utils/utils";
  import { useTable } from "../../hooks/useTable";
  import { getSubjects, getMoreSubjects, deleteSubject, setDeleteSubjectInital, setSelectedSubject, AddSubject, setAddSubjectInital, setEditSubjectInital, EditSubject  } from "../../redux/actions/subjectActions";
  import { SubjectState } from "../../redux/reducers/subjectReducer";
  import { Subject } from "../../models/Subject";
import { ModalSubjects } from "../../components/ModalSubjects";
import { GetTeachers } from "../../redux/actions/employeeActions";
import { EmployeeState } from "../../redux/reducers/employeeReducer";
import { Employee } from "../../models/Employee";

  

  
  
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
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selected, setSelected] = useState<Subject | null>(null);
  const bloqueado = red[300];
  const [sortBy, setSortBy] = useState("Nombre_lower");
  const [subjectData, setSubjectData] = useState<any>(null);
  const [employeeData, setEmployeeData] = useState<any>(null);
  const [currentFilter, setCurrentFilter] = useState<any>({});
  const [openCreateEditModal, setOpenCreateEditModal] = useState(false);
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
    dispatch(setAddSubjectInital());
    dispatch(setDeleteSubjectInital());
    dispatch(setEditSubjectInital());
  };

  const handleOpenEdit = (selected: Subject) => {
    setSelected(selected);
    setOpenCreateEditModal(true);
  };

  const handleOpenCreateModal = () => {
    setOpenCreateEditModal(true);
  };

  const handleCloseCreateModal = () => {
    setOpenCreateEditModal(false);
  };

  const handleCreate = (values: any) => {
    dispatch(AddSubject(values));
    handleCloseCreateModal();
  };

  const handleEdit = (values: Partial<Subject>) => {
    dispatch(EditSubject(values));
    handleCloseCreateModal();
  };


  const handleOpenDeleteModal = (selected: any) => {
    setSelected(selected);
    setOpenDeleteModal(true);
  };

  const handleDelete = (selected: any) => {
    dispatch(deleteSubject(selected));
    setOpenDeleteModal(false);
  };
  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
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
        dispatch(getSubjects(newLimit));
      }
    },
    onPageChange: (newPage, oldPage, limit) => {
      if (subjects.length < totalDocs && newPage > oldPage) {
        dispatch(getMoreSubjects(limit));
      }
    },
  });

  useEffect(() => {
    dispatch(getSubjects());
    dispatch(GetTeachers())
  }, []);

  const {subjects, state, totalDocs,
    delete: { state: deleteState },
    add: { state: addState },
    edit: { state: editState }
  } = useSelector<RootState, SubjectState>((state) => state.subjectReducer);

  const { employees: Teachers } = useSelector<RootState, EmployeeState>(
    (state) => state.employeeReducer
  );

  useEffect(() => {
    if (addState === FormState.Success) {
      setModalState({
        open: true,
        action: "Creada",
        message: "Se ha creado la asignatura con éxito",
      });
    }else if (addState === FormState.Failure) {
      setModalState({
        open: true,
        action: "Error",
        message: "No se ha podido crear la asignatura",
      });
    }

    if (editState === FormState.Success) {
      setModalState({
        open: true,
        action: "Editada",
        message: "Se ha editado la asignatura con éxito",
      });
    }else if (editState === FormState.Failure) {
      setModalState({
        open: true,
        action: "Error",
        message: "No se ha podido editar la asignatura",
      });
    }

    if (deleteState === FormState.Success) {
      setModalState({
        open: true,
        action: "Eliminada",
        message: "Se ha eliminado la asignatura con éxito",
      });
    }
    else if (deleteState === FormState.Failure) {
      setModalState({
        open: true,
        action: "Error",
        message: "No se ha podido eliminar la asignatura",
      });
    }
  }, [addState, deleteState, editState]);

  return (
    <>
      <CardHeader
        action={
          <>
            <Button
              startIcon={<AddIcon />}
              style={{
                backgroundColor: "#007ac9",
                color: "#fff",
                marginInlineEnd: 20,
                marginLeft: 10,
              }}
              onClick={() => {
                handleOpenCreateModal();
              }}
            >
              Agregar asignatura
            </Button>
          </>
        }
      />
      <Card mb={6}>
        
        <CardContent>
          <TableContainer className={classes.tableContainer}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell align="left">Asignatura</TableCell>
                  <TableCell align="center">Profesor</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(state === FormState.Submitting ||
                  state === FormState.Initial) && (
                  <TableSkeleton colSpan={10} limit={10} />
                )}
                {state === FormState.Success &&
                  subjects

                    .slice(page * limit, page * limit + limit)
                    .map((data: Subject) => (
                      <Fade key={data.id} in={true}>
                        <TableRow hover className={classes.styledRow}>
                          <TableCell align="left">{data.Asignatura}</TableCell>
                          <TableCell align="center">{`${data?.TeacherData?.Nombre} ${data?.TeacherData?.ApPaterno} ${data?.TeacherData?.ApMaterno}` }</TableCell> 
                          <TableCell align="center">
                            <Box style={{ justifyContent: "flex-start" }}>
                              <Tooltip title="Editar">
                              <IconButton
                                  color="primary"
                                  size="small"
                                  onClick={() => {
                                    handleOpenEdit(data)
                                    /* aqui */
                                  }}
                                >
                                  <Edit />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Eliminar">
                              <IconButton
                                  color="primary"
                                  size="small"
                                  onClick={() => handleOpenDeleteModal(data)}
                                >
                                  <Trash />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      </Fade>
                    ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={totalDocs}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handleLimitChange}
            page={page}
            rowsPerPage={limit}
            rowsPerPageOptions={TABLE_LIMITS}
          />
        </CardContent>
      </Card>
      <ModalSubjects
        open={openCreateEditModal}
        title={selected ? "Editar Asignatura" : "Crear Asignatura"}
        onClose={handleCloseCreateModal}
        onAccept={handleCreate}
        onEdit={handleEdit}
        selected={selected ? selected : undefined}
        teachers={Teachers}
      />
      <Dialog open={openDeleteModal} onClose={handleCloseDeleteModal}>
        {" "}
        {/* son cuadros de dialogos */}
        <DialogTitle>{"Eliminar asignatura"}</DialogTitle>
        <DialogContent>
          {"¿Está seguro que desea eliminar la asignatura?"}
        </DialogContent>
        <Box display={"flex"} justifyContent={"end"}>
          <DialogActions>
            <Button variant="contained" color={"primary"} onClick={() => handleDelete(selected)}>Aceptar</Button>
          </DialogActions>
          <DialogActions>
            <Button variant="contained" color={"default"} onClick={() => handleCloseDeleteModal()}>Cancelar</Button>
          </DialogActions>
        </Box>
      </Dialog>
      <Dialog open={modalState.open} onClose={handleCloseStateModal}>
        {" "}
        {/* son cuadros de dialogos */}
        <DialogTitle>{`Asignatura ${modalState.action}`}</DialogTitle>
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

export const SubjectList = () => {
  return (
    <React.Fragment>
      <Helmet title="Asignaturas" />
      <Typography variant="h3" gutterBottom display="inline">
        Lista de Asignaturas
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Typography>Lista de Asignaturas</Typography>
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