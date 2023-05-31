import { combineReducers } from "redux";
import themeReducer from "./themeReducer";
import authReducer from "./authReducer";
import { uiReducer } from "./uiReducer";
import { usersReducer } from "./usersReducer";
import { categoryReducer } from "./category.Reducer";
import { collegeReducer } from "./collegeReducer"; 
import { studentReducer } from "./studentReducer";
import { tutorReducer } from "./tutorReducer";
import { employeeReducer } from "./employeeReducer";
import  viewsReducer  from "./views.Reducer";
import { gradeReducer } from './gradeReducer';
import { subjectReducer } from "./subjectReducer";
import { classroomReducer } from './classroomReducer';
import { scheduleReducer } from './scheduleReducer';
import {classBookReducer} from './classBookReducer';
import { curriculumReducer } from "./curriculumReducer";
import { attendanceReducer } from "./attendanceReducer";


export const rootReducer = combineReducers({
  themeReducer,
  uiReducer,
  authReducer,
  usersReducer,
  categoryReducer,
  viewsReducer,
  collegeReducer,
  studentReducer,
  tutorReducer,
  employeeReducer,
  gradeReducer,
  subjectReducer,
  classroomReducer,
  scheduleReducer,
  classBookReducer,
  curriculumReducer,
  attendanceReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
