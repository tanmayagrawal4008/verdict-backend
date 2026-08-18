const submissionModel = require("../models/submission_model");
const submissionOnTestcaseModel = require("../models/submission_on_testcase");




 class SubmissionService{
    async create_submission(problem_id, submitted_code, language, submitted_by){
        try {
            const result = submissionModel.create_submission(problem_id, submitted_by, submitted_code,  'not judged');

            // push the job to the queue to judge the code

            return result;


        } catch (error) {
            console.log(error);
            console.log("submission is not created");
            throw error;

        }
    }



    async update_submission_status_by_id( submission_id){
        try {
            const result = submissionModel.update_submission_status_by_id(submission_id);

            return result;

        } catch (error) {
            console.log(error);
            console.log("submission status is not updated");
            throw error;

        }

    }



    async get_result_by_submission_and_testcase_ids(submission_id, testcase_id){
        try {
        const result = await submissionOnTestcaseModel.get_result_by_submission_and_testcase_ids(submission_id, testcase_id);
            return result;
        } catch (error) {
            console.log(error);
            console.log("submission with testcase is not fetched");
            throw error;

        }
    }



    async get_submission_by_id(submission_id){
        try {
            const result = await submissionModel.get_submission_by_id(submission_id);
            return result;
        } catch (error) {
            console.log(error);
            console.log("submission not fetched");
            throw error;
        }
    }


    async get_submission_owner_by_id(submission_id){
        try {
            const result = await submissionModel.get_submission_owner_by_id(submission_id);
            return result;
        } catch (error) {
            console.log(error);
            console.log("owner is not fetched");
            throw error;
        }
    }

    async get_submissions_by_user_id(user_id){
        try {
            const result = await submissionModel.get_submissions_by_user_id(user_id);
            return result;
        } catch (error) {
            console.log(error);
            console.log("submissions are not fetched");
            throw error;
        }
    }



}