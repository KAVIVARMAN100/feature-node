 import express from "express";
import { LoginUser } from "./users/login.js";
import { register } from "./users/registerUser.js";
import { addCourse } from "./course/addCourse.js"
import { attendance } from "./users/attendence.js";
import {enrollment} from "./course/enrollment.js"
import { verifyToken } from "../../middleware/VerifyToken.js";
import { viewCourse } from "./course/viewCourse.js";
import { getCategories } from "./course/addCourse.js";
import { getHomeDetails } from "./course/addCourse.js";
import { fetchAnnouncements } from "./announcement/announcement.js";
import { fetchMinistryDepartmentRelationship } from "./users/ministryrelationship.js";
import { getCourseBySubCatId } from "./course/getCourseBySubCatId.js";
import { validateCourseUID } from "./course/validateCousreId.js";
import { candidateExist } from "./candidate/candidateExist.js";
import { addAnnouncement } from "./announcement/announcement.js";
import { editAnnouncement } from "./announcement/announcement.js";
import { deleteAnnouncement } from "./announcement/announcement.js";



const router = express.Router();


router.post('/api/users/login', LoginUser);
router.get('/api/users/fetchMinRelationship', fetchMinistryDepartmentRelationship);
router.post('/api/users/register', register);


router.post('/api/course/addcourse', addCourse);
router.post('/api/course/viewcourse', viewCourse);
router.post('/api/course/enrollment',verifyToken, enrollment);
router.get('/api/course/validateuid', validateCourseUID);
router.get('/api/course/getcoursebysubcatid', getCourseBySubCatId);
router.post('/api/course/attendence', attendance);
router.get('/api/course/category', getCategories);
router.get('/api/course/homedetails', getHomeDetails);



router.get('/api/candidate/exists', candidateExist);




router.get('/api/announcement/fetchannouncement', fetchAnnouncements);
router.post('/api/announcement/addannouncement', addAnnouncement);
router.post('/api/announcement/editannouncement', editAnnouncement);
router.post('/api/announcement/deleteannouncement', deleteAnnouncement);













export default router;