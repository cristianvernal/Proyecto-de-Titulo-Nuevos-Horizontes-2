/* eslint-disable import/first */

// import async from "../components/Async";

import PeopleIcon from "@material-ui/icons/People";
import StyleIcon from "@material-ui/icons/Style";
import { Users as UsersIcon } from "react-feather";
// All pages that rely on 3rd party components (other than Material-UI) are
// loaded asynchronously, to keep the initial JS bundle to a minimum size
// Guards
import AuthGuard from "../components/AuthGuard";
import Page404 from "../pages/auth/Page404";
import Page500 from "../pages/auth/Page500";
import ResetPassword from "../pages/auth/ResetPassword";
// Auth components
import {
  Apartment,
  Assignment,
  AssignmentInd,
  Book,
  Class,
  DesktopWindows,
  Group,
  LocalLibrary,
  MenuBook,
  Room,
  Schedule,
  SupervisorAccount,
  MonetizationOn,
} from "@material-ui/icons";
import { CategoryList } from "../pages/CategoryList";
import { ClassroomList } from "../pages/Classroom/ClassroomList";
import { CollegeList } from "../pages/Colleges/CollegeList";
import { createCollegeForm } from "../pages/Colleges/Create";
import { editCollegeForm } from "../pages/Colleges/Edit";
import { createEmployeeForm } from "../pages/Employees/Create";
import { editEmployeeForm } from "../pages/Employees/Edit";
import { EmployeeList } from "../pages/Employees/EmployeeList";
import { GradeList } from "../pages/Grades/GradeList";
import { RestoreView } from "../pages/RestoreView";
import { createStudentForm } from "../pages/Students/Create";
import { editStudentForm } from "../pages/Students/Edit";
import { StudentList } from "../pages/Students/StudentList";
import { SubjectList } from "../pages/Subjects/SubjectList";
import { ScheduleList } from "../pages/Schedule/Create/ScheduleList";
import { CurriculumList } from "../pages/Curriculum/CurriculumList";
import { ClassBookList } from "../pages/ClassBook/ClassBookList";
import { createTutorForm } from "../pages/Tutors/Create";
import { editTutorForm } from "../pages/Tutors/Edit";
import { TutorList } from "../pages/Tutors/TutorList";
import { UserList } from "../pages/UserList";
import { ViewUser } from "../pages/ViewUser";
import { AttendanceList } from "../pages/Attendance/AttendanceList";
import {AsignGradeList} from "../pages/Grades2/AsignGradeList";
import SignIn from "../pages/auth/SignIn";
import SignUp from "../pages/auth/SignUp";
import { GradesScheduleList } from "../pages/Schedule/GradesScheduleList";
import { EditScheduleList } from "../pages/Schedule/Edit/EditSchedule";
import { StudentAdminForm, createStudentAdminForm } from "../pages/StudentAdmin/StudentAdminList";
import { NewUser } from "../pages/Users/NewUser";
import {ObservationsList} from "../pages/Observations/ObserbationsList";
import {TuitionList} from "../pages/Tuition/TuitionList";
import { IndexList } from "../pages/IndexList";



// RUTAS SIDEBAR
// const dashboardRoutes = {
//   id: "Home",
//   path: "/inicio",
//   icon: <Home />,
//   guard: AuthGuard,
//   component: Blank,
//   children: null,
// };

// const collapseRoutes = {
//   id: "Colapsable",
//   path: "/mypath",
//   icon: <Clipboard />,
//   children: [
//     {
//       path: "/mySubpath",
//       name: "Nombre",
//       guard: AuthGuard,
//       component: RestoreView,
//     },
//   ],
// };
const CategoryRoutes = {
  id: "Categorias",
  path: "/categorias",
  icon: <StyleIcon />,
  guard: AuthGuard,
  component: CategoryList,
  children: null,
};

const CollegeRoutes = {
  id: "Establecimientos",
  path: "/establecimientos",
  icon: <Apartment />,
  guard: AuthGuard,
  component: CollegeList,
  children: null,
};

const IndexRoutes = {
  id: "Inicio",
  path: "/inicio",
  icon: <Apartment />,
  guard: AuthGuard,
  component: IndexList,
  children: null,
};

const AttendanceRoutes = {
  id: "Asistencia",
  path: "/asistencia",
  guard: AuthGuard,
  component: AttendanceList,
  children: null,
};

const AsignGradeRoutes = {
  id: "notas",
  path: "/notas",
  guard: AuthGuard,
  component: AsignGradeList,
  children: null,
};

const MatriculaRoutes = {
  id: "Matriculas",
  path: "/matriculas", 
  icon: <MonetizationOn />,
  guard: AuthGuard,
  component: TuitionList,
  children: null,
};

const ObservationsRoutes = {
  id: "observaciones",
  path: "/observaciones",
  guard: AuthGuard,
  component: ObservationsList,
  children: null,
};

const StudentRoutes = {
  id: "Estudiantes",
  path: "/estudiantes",
  icon: <Group />,
  guard: AuthGuard,
  component: StudentList,
  children: null,
};

const TutorRoutes = {
  id: "Apoderados",
  path: "/apoderados",
  icon: <SupervisorAccount />,
  guard: AuthGuard,
  component: TutorList,
  children: null,
};

const EmployeeRoutes = {
  id: "Trabajadores",
  path: "/trabajadores",
  icon: <AssignmentInd />,
  guard: AuthGuard,
  component: EmployeeList,
  children: null,
};

const GradeRoutes = {
  id: "Cursos",
  path: "/cursos",
  icon: <Assignment />,
  guard: AuthGuard,
  component: GradeList,
  children: null,
};

const SubjectRoutes = {
  id: "Asignaturas",
  path: "/asignaturas",
  icon: <MenuBook />,
  guard: AuthGuard,
  component: SubjectList,
  children: null,
};


const ClassroomRoutes = {
  id: "Salas",
  path: "/salas",
  icon: <Room />,
  guard: AuthGuard,
  component: ClassroomList,
  children: null,
};

const ScheduleRoutes = {
  id: "Horarios",
  path: "/cursosHorario",
  icon: <Class />,
  guard: AuthGuard,
  component: GradesScheduleList,
};
const CurriculumRoutes = {
  id: "Carga Academica",
  path: "/cargaAcademica",
  guard: AuthGuard,
  component: CurriculumList,
  children: null,
};

const ClassBookRoutes = {
  id: "Libro de Clases",
  path: "/LibroDeClases",
  icon: <LocalLibrary />,
  guard: AuthGuard,
  component: ClassBookList,
  children: null,
};

const UsersRoutes = {
  id: "Usuarios",
  path: "/usuarios",
  icon: <PeopleIcon />,
  guard: AuthGuard,
  component: UserList,
  children: null,
};

// SUB RUTAS

const CollegesSubRoutes = {
  id: "Colegios sub routes",
  path: "/establecimientos",
  children: [
    {
      path: "/establecimientos/Crear",
      name: "Crear",
      guard: AuthGuard,
      component: createCollegeForm,
    },
    {
      path: "/establecimientos/:collegeId/editar",
      name: "Editar",
      guard: AuthGuard,
      component: editCollegeForm,
    },
  ],
};

const GradesSubRoutes= {
  id: "Cursos sub routes",
  path: "/cursos",
  children: [
    {
      path: "/cursos/adminEstudiantes",
      name: "Administacion",
      guard: AuthGuard,
      component:StudentAdminForm,
    }
  ]

}

const ScheduleSubRoutes = {
  id: "Horarios sub routes",
  path: "/cursosHorario",
  children: [
    {
      path: "/cursosHorario/Crear",
      name: "Crear",
      guard: AuthGuard,
      component: ScheduleList,
    },
    {
      path: "/cursosHorario/:gradeId/editar",
      name: "Editar",
      guard: AuthGuard,
      component: EditScheduleList,
    },
    
  ],
};

const StudentsSubRoutes = {
  id: "Estudiantes sub routes",
  path: "/estudiantes",
  children: [
    {
      path: "/estudiantes/Crear",
      name: "Crear",
      guard: AuthGuard,
      component: createStudentForm,
    },
    {
      path: "/estudiantes/:studentId/editar",
      name: "Editar",
      guard: AuthGuard,
      component: editStudentForm,
    },
  ],
};

const TutorsSubRoutes = {
  id: "Apoderados sub routes",
  path: "/apoderados",
  children: [
    {
      path: "/apoderados/Crear",
      name: "Crear",
      guard: AuthGuard,
      component: createTutorForm,
    },
    {
      path: "/apoderados/:subjectId/editar",
      name: "Editar",
      guard: AuthGuard,
      component: editTutorForm,
    },
  ],
};

const EmployeesSubRoutes = {
  id: "Trabajadores sub routes",
  path: "/trabajadores",
  children: [
    {
      path: "/trabajadores/Crear",
      name: "Crear",
      guard: AuthGuard,
      component: createEmployeeForm,
    },
    {
      path: "/trabajadores/:subjectId/editar",
      name: "Editar",
      guard: AuthGuard,
      component: editEmployeeForm,
    },
  ],
};

const UsersSubRoutes = {
  id: "Usuarios sub routes",
  path: "/usuarios",
  icon: <UsersIcon />,
  children: [
    {
      path: "/ListaUsuarios/:userId/ver",
      name: "Ver",
      guard: AuthGuard,
      component: ViewUser,
    },
    {
      path: "/usuarios/crear",
      name:"crear",
      guard: AuthGuard,
      component: NewUser,
    }
  ],
};

const dashboardSubRoutesRoutes = {
  id: "Dashboard sub routes",
  path: "/inicio",
  guard: AuthGuard,
  children: [
    {
      path: "/inicio/user/restorepassword",
      name: "Restore",
      guard: AuthGuard,
      component: RestoreView,
    },
  ],
};

const authRoutes = {
  id: "Auth",
  path: "/auth",
  icon: <UsersIcon />,
  children: [
    {
      path: "/auth/sign-in",
      name: "Sign In",
      component: SignIn,
    },
    {
      path: "/auth/sign-up",
      name: "Sign Up",
      component: SignUp,
    },
    {
      path: "/auth/reset-password",
      name: "Reset Password",
      component: ResetPassword,
    },
    {
      path: "/auth/404",
      name: "404 Page",
      component: Page404,
    },
    {
      path: "/auth/500",
      name: "500 Page",
      component: Page500,
    },
  ],
  component: null,
};

// Routes using the Auth layout
// export const IndexListRoutes = [IndexRoutes];
export const authLayoutRoutes = [authRoutes];

// Todas las rutas creadas deben ser protegidas
// Routes that are protected
export const protectedRoutes = [
  dashboardSubRoutesRoutes,
  CollegeRoutes,
  StudentRoutes,
  TutorRoutes,
  EmployeeRoutes,
  GradeRoutes,
  SubjectRoutes,
  ClassroomRoutes,
  CurriculumRoutes,
  ClassBookRoutes,
  CollegesSubRoutes,
  StudentsSubRoutes,
  TutorsSubRoutes,
  EmployeesSubRoutes,
  UsersSubRoutes,
  ScheduleRoutes,
  ScheduleSubRoutes,
  GradesSubRoutes,
  UsersRoutes,
  AttendanceRoutes,
  AsignGradeRoutes,
  ObservationsRoutes,
  MatriculaRoutes,
  IndexRoutes,
];

// Routes visible in the sidebar
export const sidebarRoutes = [
  UsersRoutes,
  CollegeRoutes,
  EmployeeRoutes,
  GradeRoutes,
  StudentRoutes,
  SubjectRoutes,
  ClassBookRoutes,
  ScheduleRoutes, // horarios
  MatriculaRoutes,
  IndexRoutes,
];
