import {
  Box,
  Breadcrumbs as MuiBreadcrumbs,
  Button,
  Card as MuiCard,
  CardContent,
  CardHeader,
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
} from "@material-ui/core";
import { green, red } from "@material-ui/core/colors";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import { Autocomplete } from "@material-ui/lab";
import { spacing } from "@material-ui/system";
import React, { useEffect, useState } from "react";
import { Download, MinusSquare, Search } from "react-feather";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components/macro";
import { ModalCategoria } from "../components/ModalCategoria";
import { ModalEdit } from "../components/ModalEdit";
import { TableSkeleton } from "../components/TableSkeleton";
import { TABLE_LIMITS, TABLE_LIMIT_DEFAULT } from "../constants";
import { useTable } from "../hooks/useTable";
import { FormState } from "../models/form_state";
import {
  AddCategory,
  getCategories,
  getCategoryFiltered,
  getMoreCategories,
  updateCategory,
} from "../redux/actions/category.Actions";
import { categoryReducer, ICategory } from "../redux/reducers/category.Reducer";
import { RootState } from "../redux/reducers/rootReducer";
import { useStyles } from "../theme/useStyles";
import {
  cleanString,
  exportToCsv,
  timesStampFormattedsimple,
} from "../utils/utils";

const Card = styled(MuiCard)(spacing);

const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

interface filterProps {
  changeOrder: (value: any) => void;
}

const ContentCard = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const activo = green[300];
  const bloqueado = red[300];

  const [subjectData, setSubjectData] = useState<any | {}>({ id: "" });
  const [currentFilter, setCurrentFilter] = useState<any>({});
  const [sortBy, setSortBy] = useState("NombreCompleto");
  const [inputModal, setInputModal] = useState("");
  const [modal, setModal] = useState<boolean>(false);
  const [modalEdit, setModalEdit] = useState<boolean>(false);
  const [idSelected, setIdSeleted] = useState("");
  const [categorySelected, setCategorySelected] = useState("");

  const handleChangeOrder = (order: any) => {
    dispatch(getCategories(limit, order));
  };
  const openCloseModal = () => {
    setModal(!modal);
  };
  const openCloseEdit = () => {
    setModalEdit(!modalEdit);
  };
  const handleAccepInputEdit = (id: string, category: string) => {
    openCloseEdit();
    setIdSeleted(id);
    setCategorySelected(category);
  };

  const onAccept = (value: string) => {
    dispatch(updateCategory(idSelected, value));
  };

  const handleAccepInput = (value: string) => {
    const valueWithOutSpace = value.trim();
    const valueLowerCase = valueWithOutSpace.toLocaleLowerCase();
    if (!categorias.some((item) => item.Nombre_lower === valueLowerCase)) {
      dispatch(AddCategory(valueWithOutSpace));
      setInputModal("");
    } else {
      alert("La categoria ya existe...");
    }
  };

  const { limit, page, handleLimitChange, handlePageChange } = useTable({
    limit: TABLE_LIMIT_DEFAULT || 5,
    onLimitChange: (e, newLimit) => {
      if (newLimit > categoryReducer.length) {
        if (currentFilter) {
        }
      }
    },
    onPageChange: (newPage, oldPage, limit) => {
      if (categorias.length < totalDocs && newPage > oldPage) {
        dispatch(getMoreCategories(limit));
      }
    },
  });

  useEffect(() => {
    dispatch(getCategories());
  }, []);

  const { categorias, state, totalDocs } = useSelector<RootState, ICategory>(
    (state) => state.categoryReducer
  );

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
                openCloseModal();
              }}
            >
              Agregar Categoria
            </Button>
            <Button
              startIcon={<Download />}
              style={{
                backgroundColor: "#007ac9",
                color: "#fff",
                marginInlineEnd: 20,
              }}
              variant="contained"
              onClick={() =>
                exportToCsv(
                  "usuarios.csv",
                  categorias,
                  ["FechaCreacion", "Nombre"],
                  ["Fecha de Creacion", "Nombre"]
                )
              }
            >
              Exportar CSV
            </Button>
          </>
        }
      />
      <Card mb={6}>
        <FilterSection
          changeOrder={(order) => {
            setSortBy(order);
            handleChangeOrder(order);
          }}
        />
        <CardContent>
          <TableContainer className={classes.tableContainer}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell align="left">Nombre</TableCell>
                  <TableCell align="left">Fecha de Creación</TableCell>
                  <TableCell align="left">Estado</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(state === FormState.Submitting ||
                  state === FormState.Initial) && (
                  <TableSkeleton colSpan={10} limit={10} />
                )}
                {state === FormState.Success &&
                  categorias
                    .slice(page * limit, page * limit + limit)
                    .map((data: any) => (
                      <Fade key={data.id} in={true}>
                        <TableRow hover className={classes.styledRow}>
                          <TableCell align="left">{data?.Nombre}</TableCell>
                          <TableCell align="left">
                            {timesStampFormattedsimple(
                              data?.FechaCreacion.toDate()
                            )}
                          </TableCell>
                          <TableCell align="left">
                            {data?.Bloqueado === false ? "Activo" : "Inactiva"}
                          </TableCell>
                          <TableCell align="center">
                            <Box style={{ justifyContent: "flex-start" }}>
                              <Tooltip title="Editar">
                                <IconButton
                                  color="primary"
                                  size="small"
                                  onClick={() =>
                                    handleAccepInputEdit(data.id, data.Nombre)
                                  }
                                >
                                  <EditIcon />
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
          <ModalCategoria
            value={inputModal}
            title="Escribe la Categoria"
            open={modal}
            onClose={openCloseModal}
            onAccept={handleAccepInput}
          />
          <ModalEdit
            valorCategoria={categorySelected}
            title="Editar Categoria"
            open={modalEdit}
            onClose={openCloseEdit}
            onAccept={onAccept}
          />
        </CardContent>
      </Card>
    </>
  );
};
const FilterSection: React.FC<filterProps> = ({ changeOrder }) => {
  const dispatch = useDispatch();

  const [openFilter, setOpenFilters] = useState(false);
  const [filtersList, setValueFiltersList] = React.useState<any>({});
  const [valueCreacionStart, setValueCreacionStart] = useState<any>(null);
  const [valueCreacionEnd, setValueCreacionEnd] = useState<any>(null);
  const [valueNombre, setValueNombre] = useState("");

  const handleChangeNombre = (e: any) => {
    setValueNombre(e.target.value);
  };

  return (
    <CardContent>
      <Grid container justify="space-between">
        <Grid item>
          <Button size="large" onClick={() => setOpenFilters(!openFilter)}>
            Filtros {openFilter ? <ExpandLess /> : <ExpandMore />}
          </Button>
        </Grid>
      </Grid>
      <Collapse in={openFilter} timeout="auto" unmountOnExit>
        <Grid container spacing={1} style={{ marginTop: 20 }}>
          <Grid item xs={12} sm={2}>
            <TextField
              id="outlined-basic"
              size="small"
              label="Nombre"
              variant="outlined"
              fullWidth
              value={valueNombre}
              onChange={handleChangeNombre}
              onKeyPress={(ev) => {
                if (ev.key === "Enter") {
                  filtersList["Nombre_lower"] = cleanString(valueNombre);
                  if (!valueNombre) {
                    delete filtersList["Nombre_lower"];
                  }

                  if (Object.keys(filtersList).length > 0) {
                    dispatch(getCategoryFiltered(filtersList));
                  } else {
                    dispatch(getCategories());
                  }
                  ev.preventDefault();
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              id="creacion-start"
              label="Fecha Creación: Inicio"
              size="small"
              type="datetime-local"
              value={valueCreacionStart}
              onChange={(event) => {
                setValueCreacionStart(event.target.value);
                filtersList["endAt"] = event.target.value;
              }}
              fullWidth
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              id="creacion-start"
              label="Fecha Creación: Final"
              size="small"
              type="datetime-local"
              value={valueCreacionEnd}
              onChange={(event) => {
                setValueCreacionEnd(event.target.value);
                filtersList["startAt"] = event.target.value;
              }}
              fullWidth
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={1}>
            <Box display="flex">
              <Box mt={1} order={1}>
                <Tooltip title="Buscar">
                  <IconButton
                    size="small"
                    aria-label="Filtrar"
                    onClick={() => {
                      if (valueNombre) {
                        filtersList["Nombre_lower"] = cleanString(valueNombre);
                      }
                      dispatch(getCategoryFiltered(filtersList));
                    }}
                  >
                    <Search />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box mt={1} order={2}>
                <Tooltip title="Limpiar">
                  <IconButton
                    size="small"
                    aria-label="Borrar filtro"
                    onClick={() => {
                      setValueNombre("");
                      setValueCreacionStart("");
                      setValueCreacionEnd("");
                      setValueFiltersList({});
                      dispatch(getCategories());
                    }}
                  >
                    <MinusSquare />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Collapse>
    </CardContent>
  );
};
export const CategoryList = () => {
  return (
    <React.Fragment>
      <Helmet title="Categorias" />
      <Typography variant="h3" gutterBottom display="inline">
        Categorias
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Typography> Categorias</Typography>
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
