const express = require("express")
const { getAllCourses } = require("../controllers/Search")
const router = express.Router()

// ********************************************************************************************************
//                                      Search routes
// ********************************************************************************************************
router.get("/getAllCourses", getAllCourses)



module.exports = router