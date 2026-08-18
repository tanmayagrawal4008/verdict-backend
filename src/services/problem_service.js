const problemModel = require('../models/Problem_model');


/*
                                              Table "public.problems"
     Column     |            Type             | Collation | Nullable |                   Default
----------------+-----------------------------+-----------+----------+----------------------------------------------
 problem_id     | bigint                      |           | not null | nextval('problems_problem_id_seq'::regclass)
 problem_code   | character varying(20)       |           | not null |
 title          | character varying(255)      |           | not null |
 difficulty     | integer                     |           |          |
 time_limit     | integer                     |           | not null |
 memory_limit   | integer                     |           | not null |
 created_by     | bigint                      |           |          |
 statement      | text                        |           | not null |
 input_formate  | text                        |           |          |
 output_formate | text                        |           |          |
 constraints    | text                        |           |          |
 created_at     | timestamp without time zone |           | not null | CURRENT_TIMESTAMP
 updated_at     | timestamp without time zone |           | not null | CURRENT_TIMESTAMP


*/
 class ProblemService{
    async create_problem(title, difficulty, time_limit, memory_limit, created_by, statement, input_formate, output_formate, constraints){


        try {
            const result = problemModel.create_problem(title, difficulty, time_limit, memory_limit, created_by, statement, input_formate, output_formate, constraints);
            return result;

        } catch (error) {
            console.log(error)
            console.log("problem not created");
            throw error;
        }
        
    }

    async update_problem_by_code(title , time_limit, memory_limit,created_by, statement, input_formate, output_formate, constraints, problem_code){
        try {
            const result = problemModel.update_problem_by_code(title , time_limit, memory_limit,created_by, statement, input_formate, output_formate, constraints, problem_code);

            return result;

        } catch (error) {
            console.log(error);
            console.log("problem not updated");
            throw error;


        }
    }



    async delete_problem_by_code(problem_code){
        try {
            const result = await problemModel.delete_problem_by_code(problem_code);
            return result;

        } catch (error) {
            console.log(error);
            console.log("problem not deleted");
            throw error;

        }
    }



    async get_problems(){
        try {
            const result = await problemModel.get_problems();
            return result;
            
        } catch (error) {
            console.log(error);
            console.log("problmes are not fetched");
            throw error;
            
        }
    }



    async get_problem_by_code(problem_code){
        try {
            const result = await problemModel.get_problem_by_code(problem_code);
            return result;

            
        } catch (error) {
            console.log(error);
            console.log("problem is not fetchef by code");
            throw error;
        }
    }


    async get_problem_owner_by_code(problem_code){
        try {
            const result = await problemModel.get_problem_owner_by_code(problem_code);
            return result;
            
        } catch (error) {
            console.log(error);
            console.log("owner is not fetched");
            throw error;
        }
    }





}



module.exports = ProblemService;
