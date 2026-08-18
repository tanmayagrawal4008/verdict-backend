const express = require('express');
const router = express.Router();



router.get("/", get_problems)

router.get("/:problemId", get_problem_by_id);

router.get("/code/:problemCode", get_problem_by_code)

router.get("/:problemId", get_problem);






router.post("/", create_problem)

router.patch("/:problemId", update_problem);

router.delete("/:problemId", delete_problem);





module.exports = router;



