const problemModel = require("../models/Problem_model");

class ProblemService {
  async create_problem(...args) {
    return problemModel.create_problem(...args);
  }

  async update_problem_by_id(...args) {
    return problemModel.update_problem_by_id(...args);
  }

  async delete_problem_by_id(problemId) {
    return problemModel.delete_problem_by_id(problemId);
  }

  async get_problems() {
    return problemModel.get_problems();
  }

  async get_problems_by_user_id(userId) {
    return problemModel.get_problems_by_user_id(userId);
  }

  async get_problem_by_id(problemId) {
    return problemModel.get_problem_by_id(problemId);
  }

  async get_problem_owner_by_id(problemId) {
    return problemModel.get_problem_owner_by_id(problemId);
  }
}

module.exports = ProblemService;
