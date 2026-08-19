# API Response Contract

This file documents the fixed response shapes returned by the backend. It is a
contract for the frontend; it does **not** store individual API responses.

## Base URL and authentication

All API routes are mounted below these paths:

```text
/auth
/problems
/submissions
/me
```

Protected routes require this header:

```http
Authorization: Bearer <access_token>
```

## Common response format

Every successful response has this shape:

```json
{
  "success": true,
  "message": "Human-readable success message",
  "data": {}
}
```

`data` is omitted only when the endpoint has no data to return.

Every error response has this shape:

```json
{
  "success": false,
  "message": "Frontend-displayable error message"
}
```

The HTTP status code is the machine-readable error category. Frontend code
should branch on the status code and may display `message` directly.

## Request format

Send JSON bodies with this header whenever the endpoint has a request body:

```http
Content-Type: application/json
```

For protected endpoints, send both headers:

```http
Content-Type: application/json
Authorization: Bearer <access_token>
```

### Authentication requests

#### Register — `POST /auth/register`

```json
{
  "username": "tanmay",
  "email": "tanmay@example.com",
  "password": "your-strong-password"
}
```

#### Login — `POST /auth/login`

```json
{
  "email": "tanmay@example.com",
  "password": "your-strong-password"
}
```

#### Refresh access token — `POST /auth/refresh`

Preferred JSON body:

```json
{
  "refresh_token": "<refresh_token>"
}
```

The backend also accepts `refresh_token` in the request header, but the JSON
body format is recommended.

#### Logout — `POST /auth/logout`

No body. Send only:

```http
Authorization: Bearer <access_token>
```

### Problem requests

#### Create problem — `POST /problems`

```json
{
  "title": "Two Sum",
  "difficulty": 1,
  "time_limit": 1000,
  "memory_limit": 256,
  "statement": "Given an array, find two indices...",
  "input_formate": "The first line contains n...",
  "output_formate": "Print the two indices...",
  "constraints": "1 <= n <= 200000"
}
```

Required fields: `title`, `difficulty`, `time_limit`, `memory_limit`, and
`statement`.

- `time_limit` is an integer in **milliseconds**.
- `memory_limit` is an integer in **megabytes**.
- `input_formate`, `output_formate`, and `constraints` are optional.
- `created_by` must never be sent; it is always read from the access token.

#### Update problem — `PATCH /problems/:problemId`

`problemId` is the positive integer database ID, for example
`PATCH /problems/42`.

Send only the fields you want to change:

```json
{
  "title": "Two Sum - Updated",
  "time_limit": 1500,
  "constraints": "1 <= n <= 500000"
}
```

The backend merges this payload with the existing problem. The authenticated
user must be the problem creator. Do not send `created_by`.

#### Delete problem — `DELETE /problems/:problemId`

No body. The authenticated user must be the problem creator.

#### Read problems

```text
GET /problems
GET /problems/:problemId
GET /me/problems
```

`GET /me/problems` requires an access token. These endpoints currently do not
use query filters or pagination parameters.

### Submission requests

#### Create submission — `POST /problems/:problemId/submissions`

`problemId` is the positive integer database ID, for example
`POST /problems/42/submissions`.

```json
{
  "submitted_code": "#include <bits/stdc++.h>\nusing namespace std;\nint main() { return 0; }",
  "language": "C++"
}
```

Allowed language values: `C++` or `CPP`. Both are stored and judged as C++.

- `submitted_code` must be a non-empty string.
- Do not send `submitted_by` or `submission_status`; the backend sets both.

#### Read a submission — `GET /submissions/:submissionId`

`submissionId` is the positive integer database ID, for example
`GET /submissions/101`. No body is required. Only the user who created the
submission can read it.

#### Read current user's submissions — `GET /me/submissions`

No body. Requires an access token.

## Success responses

### Authentication

| Endpoint | Status | `message` | `data` |
| --- | ---: | --- | --- |
| `POST /auth/register` | `201` | `User registered successfully` | `{ user_id, username, email, created_at }` |
| `POST /auth/login` | `200` | `Login successful` | `{ access_token, refresh_token }` |
| `POST /auth/refresh` | `200` | `Access token generated successfully` | `{ access_token }` |
| `POST /auth/logout` | `200` | `Logout successful` | omitted |

### Problems

| Endpoint | Status | `message` | `data` |
| --- | ---: | --- | --- |
| `GET /problems` | `200` | `Problems fetched successfully` | `Problem[]` |
| `GET /problems/:problemId` | `200` | `Problem fetched successfully` | `Problem` |
| `POST /problems` | `201` | `Problem created successfully` | `{ problem_id, created_at, updated_at }` |
| `PATCH /problems/:problemId` | `200` | `Problem updated successfully` | `{ problem_id, created_at, updated_at }` |
| `DELETE /problems/:problemId` | `200` | `Problem deleted successfully` | `{ problem_id, created_at, updated_at }` |
| `GET /me/problems` | `200` | `Your problems fetched successfully` | `Problem[]` |

```ts
type Problem = {
  problem_id: string;
  title: string;
  difficulty: number | null;
  time_limit: number; // milliseconds
  memory_limit: number; // megabytes
  created_by: string | null;
  statement: string;
  input_formate: string | null;
  output_formate: string | null;
  constraints: string | null;
  created_at: string;
  updated_at: string;
};
```

### Submissions

| Endpoint | Status | `message` | `data` |
| --- | ---: | --- | --- |
| `POST /problems/:problemId/submissions` | `201` | `Submission created successfully` | `SubmissionSummary` |
| `GET /submissions/:submissionId` | `200` | `Submission fetched successfully` | `Submission` |
| `GET /me/submissions` | `200` | `Your submissions fetched successfully` | `SubmissionSummary[]` |

```ts
type SubmissionSummary = {
  submission_id: string;
  problem_id: string;
  submission_language: "C++";
  submitted_by: string;
  submission_status: SubmissionStatus;
  created_at: string;
  updated_at: string;
};

type Submission = SubmissionSummary & {
  submitted_code: string;
};

type SubmissionStatus =
  | "PENDING"
  | "JUDGING"
  | "ACCEPTED"
  | "WRONG_ANSWER"
  | "TIME_LIMIT_EXCEEDED"
  | "RUNTIME_ERROR"
  | "COMPILATION_ERROR"
  | "SYSTEM_ERROR"
  | "QUEUE_ERROR";
```

`POST /problems/:problemId/submissions` returns immediately with `PENDING`.
Poll `GET /submissions/:submissionId` until the status reaches a final result:
`ACCEPTED`, `WRONG_ANSWER`, `TIME_LIMIT_EXCEEDED`, `RUNTIME_ERROR`,
`COMPILATION_ERROR`, `SYSTEM_ERROR`, or `QUEUE_ERROR`.

## Error responses

| Status | When it happens | Possible `message` |
| ---: | --- | --- |
| `400` | Required request field is missing | `username, email and password are required`, `email and password are required`, `refresh_token is required`, `title is required`, `difficulty is required`, `time_limit is required`, `memory_limit is required`, `statement is required`, `submitted_code and language are required` |
| `400` | Invalid route ID | `problemId must be a positive integer`, `submissionId must be a positive integer` |
| `400` | Unsupported submission language | `Only C++ submissions are currently supported` |
| `400` | Foreign-key reference is invalid | `A referenced record does not exist` |
| `401` | Missing token | `Access token is required` |
| `401` | Malformed Bearer header | `Authorization header must use Bearer token` |
| `401` | Bad/expired access token | `Invalid or expired access token` |
| `401` | Bad login credentials | `Invalid email or password` |
| `401` | Bad/expired refresh token | `Invalid or expired refresh token` |
| `403` | Editing another user's problem | `You can only update your own problem` |
| `403` | Deleting another user's problem | `You can only delete your own problem` |
| `403` | Reading another user's submission | `You can only view your own submission` |
| `404` | Missing problem | `Problem not found` |
| `404` | Missing submission | `Submission not found` |
| `404` | No route matches request | `Route not found` |
| `409` | Duplicate unique field | `Email already exists`, `Username already exists`, or `A record with these values already exists` |
| `503` | Submission was stored but could not be queued | `Submission queue is temporarily unavailable` |
| `500` | Unexpected server, database, or infrastructure failure | `Internal server error` |

## Frontend handling guide

```ts
if (response.status === 401) {
  // Clear expired login state and send user to login.
}

if (response.status === 403) {
  // Show a permission message; do not retry automatically.
}

if (response.status === 409) {
  // Show duplicate-value feedback near the relevant form field.
}

if (response.status >= 500) {
  // Show a temporary error and allow retry.
}
```

For a submission, use `submission_status` rather than the initial `201` response
alone to decide whether judging is complete.
