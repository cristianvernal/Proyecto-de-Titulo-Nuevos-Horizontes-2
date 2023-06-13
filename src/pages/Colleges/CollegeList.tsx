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
import { getMoreUsers, getUsers, getUsersFiltered, setSelectedUser } from "../../redux/actions/usersActions";
import { RootState } from "../../redux/reducers/rootReducer";
import { IUsersState, usersReducer } from "../../redux/reducers/usersReducer";
import { useStyles } from "../../theme/useStyles";
import { cleanString, exportToCsv, timesStampFormattedsimple } from "../../utils/utils";
import { useTable } from "../../hooks/useTable";
import { deleteCollege, getColleges, getMoreColleges, setDeleteCollegeInital, setSelectedCollege } from "../../redux/actions/collegeActions";
import { CollegeState } from "../../redux/reducers/collegeReducer";
import { College } from "../../models/College";

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
  const [selected, setSelected] = useState<any | null>(null);
  const bloqueado = red[300];
  const [sortBy, setSortBy] = useState("Nombre_lower");
  const [subjectData, setSubjectData] = useState<any>(null);
  const [currentFilter, setCurrentFilter] = useState<any>({});

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleOpenDeleteModal = (selected: any) => {
    setSelected(selected);
    setOpenDeleteModal(true);
  };

  const handleDelete = (selected: any) => {
    dispatch(deleteCollege(selected));
    setOpenDeleteModal(false);
  };
  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };

  const handleCloseConfirm = () => {
    dispatch(setDeleteCollegeInital());
    setOpenConfirm(false);
  };

  //Funcion para ir a editar
  const handleGoToEdit = (data: any) => {
    dispatch(setSelectedCollege(data));
    history.push(`/establecimientos/${data.id}/editar`);
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
        dispatch(getColleges(newLimit));
      }
    },
    onPageChange: (newPage, oldPage, limit) => {
      if (colleges.length < totalDocs && newPage > oldPage) {
        dispatch(getMoreColleges(limit));
      }
    },
  });

  useEffect(() => {
    dispatch(getColleges());
  }, []);

  const {
    colleges,
    state,
    totalDocs,
    delete: { state: deleteState },
  } = useSelector<RootState, CollegeState>((state) => state.collegeReducer);

  useEffect(() => {
    if (deleteState === FormState.Success) {
      handleOpenConfirm();
    }
  }, [deleteState]);

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
                history.push("/establecimientos/Crear");
              }}
            >
              Agregar Establecimiento
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
                  <TableCell align="left">Nombre</TableCell>
                  <TableCell align="left">Dirección</TableCell>
                  <TableCell align="left">Teléfono</TableCell>
                  <TableCell align="left">Región</TableCell>
                  <TableCell align="center">Comuna</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(state === FormState.Submitting ||
                  state === FormState.Initial) && (
                  <TableSkeleton colSpan={10} limit={10} />
                )}
                {state === FormState.Success &&
                  colleges

                    .slice(page * limit, page * limit + limit)
                    .map((data: College) => (
                      <Fade key={data.id} in={true}>
                        <TableRow hover className={classes.styledRow}>
                          <TableCell align="left">{data?.Nombre}</TableCell>
                          <TableCell align="left">{data?.Direccion}</TableCell>
                          <TableCell align="left">{data?.Telefono}</TableCell>
                          <TableCell align="left">{data?.Region}</TableCell>
                          <TableCell align="center">{data?.Comuna}</TableCell>
                          <TableCell align="center">
                            <Box style={{ justifyContent: "flex-start" }}>
                              <Tooltip title="Editar">
                                <IconButton
                                  color="primary"
                                  size="small"
                                  onClick={() => {
                                    handleGoToEdit(data);
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
      <Dialog open={openDeleteModal} onClose={handleCloseDeleteModal}>
        {" "}
        {/* son cuadros de dialogos */}
        <DialogTitle>{"Eliminar establecimiento"}</DialogTitle>
        <DialogContent>
          {"¿Está seguro que desea eliminar el establecimiento?"}
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
      <Dialog open={openConfirm} onClose={handleCloseConfirm}>
        {" "}
        {/* son cuadros de dialogos */}
        <DialogTitle>{"Establecimiento Eliminado"}</DialogTitle>
        <DialogContent>
          {"El establecimiento se ha eliminado con éxito"}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseConfirm()}>Aceptar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export const CollegeList = () => {
  return (
    <React.Fragment>
      <Helmet title="Establecimientos" />
      <Typography variant="h3" gutterBottom display="inline">
        Establecimientos
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Typography>Establecimientos</Typography>
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
