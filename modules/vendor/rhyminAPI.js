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
import { getAllCourses } from "./course/allCourse.js";
import { editCourse } from "./course/addCourse.js";
import { getSubCategories } from "./course/addCourse.js";
 import { deleteCourse } from "./course/addCourse.js";
import { fetchCourseStatusReport } from "./course/statusReport.js";
import { getCandidateCourse } from "./course/courseAttendenceDetails.js";
import { getCourseUcid } from "./course/courseAttendenceDetails.js";
import { addCandidate } from "./candidate/addCandidate.js";
import { editCandidate, updateSelfEnrollment } from "./candidate/editCandidate.js";
import { addCandidateForApproval } from "./candidate/editCandidate.js";
import { selfCandidateDetails } from "./candidate/editCandidate.js";
import { getCandidateAttendance } from "./candidate/attendenceCandidate.js";
import { deleteSelfEnrollment, getCourseEvaluation, saveCourseEvaluation } from "./candidate/deleteselfEnrollment.js";
import { fetchCandidate, fetchCourseCandidate } from "./candidate/fetchCourseCandidate.js";
import { courseAttendedDetails } from "./course/courseAttendenceDetails.js";



const router = express.Router();

router.post('/api/users/register', register);
router.post('/api/users/login', LoginUser);
router.get('/api/users/fetchMinRelationship', fetchMinistryDepartmentRelationship);


router.post('/api/course/addcourse', addCourse);
router.post('/api/course/viewcourse', viewCourse);
router.get('/api/course/getAllCourses', getAllCourses);
router.get('/api/course/getcoursebysubcatid', getCourseBySubCatId);
router.get('/api/course/validateuid', validateCourseUID);
router.get('/api/course/homedetails', getHomeDetails);
router.get('/api/course/fetchcoursecandidate', fetchCourseCandidate);
router.get('/api/course/fetchCandidate', fetchCandidate);//no
router.post('/api/course/attendence', attendance);
router.put('/api/course/editCourse', editCourse);
router.get('/api/course/category', getCategories);
router.get('/api/course/subcategory', getSubCategories);
router.get('/api/course/coursecand', courseAttendedDetails);//no
router.post('/api/course/delete', deleteCourse);
router.post('/api/course/enrollment', enrollment);
//verifyToken
router.get('/api/course/fetchcoursestatusreport', fetchCourseStatusReport);
//$course->post('/v1/course/fetchcoursestatusreport','fetchcoursestatusreport');
router.get('/api/course/getcandidatecourse', getCandidateCourse);
router.get('/api/course/getucid', getCourseUcid);



router.post('/api/candidate/addCandidate', addCandidate);
router.get('/api/candidate/exists', candidateExist);
router.get('/api/candidate/editCandidate/', editCandidate);
router.get('/api/candidate/selfenrollment', addCandidateForApproval);
router.get('/api/candidate/selfcandetails', selfCandidateDetails);
router.get('/api/candidate/updateselfenrollment', updateSelfEnrollment);
//    $candidate->post('/v1/candidate/getCertificate','getCertificate');
router.get('/api/candidate/getCandidateAttendance', getCandidateAttendance);
router.get('/api/candidate/deleteSelfEnrollment', deleteSelfEnrollment );
router.get('/api/candidate/evaluation', saveCourseEvaluation );//test
router.get('/api/candidate/getCourseEvaluation', getCourseEvaluation );


router.get('/api/announcement/fetchannouncement', fetchAnnouncements);
router.post('/api/announcement/addannouncement', addAnnouncement);
router.post('/api/announcement/editannouncement', editAnnouncement);
router.post('/api/announcement/deleteannouncement', deleteAnnouncement);



export default router;