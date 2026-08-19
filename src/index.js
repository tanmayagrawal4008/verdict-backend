const express = require("express");
require("dotenv").config();

const authenticationRoutes = require("./routes/authentication_routes");
const problemRoutes = require("./routes/problem_routes");
const submissionRoutes = require("./routes/submission_routes");
const meRoutes = require("./routes/me_routes");
const errorMiddleware = require("./middlewares/error_middleware");
const { HttpError } = require("./middlewares/http_error");

const app = express();
const port = process.env.PORT;

app.use(express.json({ limit: "1mb" }));
app.use("/auth", authenticationRoutes);
app.use("/problems", problemRoutes);
app.use("/submissions", submissionRoutes);
app.use("/me", meRoutes);
app.use((req, res, next) => next(new HttpError(404, "Route not found")));
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Express server running on port ${port}`);
});
