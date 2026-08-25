# Four-Portal Backend Contract

The four portals are login-only surfaces. Account creation, role assignment, password setup, activation, suspension, and deactivation happen exclusively through the existing administrator portal on the main website. No portal route should create an account, invite a user, verify a new user, or activate an account.

## Authentication

Each role has a dedicated login endpoint:

```text
POST /auth/emp/login
POST /auth/client/login
POST /auth/member/login
POST /auth/manager/login
```

The request body is `{ "email": "user@example.com", "password": "…" }`. A successful response uses the existing API envelope and returns a JWT:

```json
{
  "data": {
    "access_token": "jwt"
  },
  "message": "Logged in successfully"
}
```

The frontend stores the token in browser local storage under the role-specific key `tmi_emp_token`, `tmi_client_token`, `tmi_member_token`, or `tmi_manager_token`, then redirects to the corresponding dashboard.

Invalid credentials must remain distinguishable from an account awaiting administrative activation. For an account that exists but is not active, the API should return HTTP 403 with this exact response detail or code:

```json
{ "detail": "pending_activation", "code": "pending_activation" }
```

For incorrect credentials, the API should return HTTP 401 with a normal invalid-credentials message. The frontend displays a clear activation message for `pending_activation` and a separate credential error for HTTP 401.

## Read endpoints

After login, each guarded dashboard requests:

```text
GET /emp/overview
GET /client/overview
GET /member/overview
GET /manager/overview
```

All requests use `Authorization: Bearer <jwt>`. The response is an API envelope whose `data` payload matches the role types in `types/`.

| Role | Dashboard payload |
| --- | --- |
| `emp` | `user`, `tasks`, `openTasks`, and `announcements` with priority, status, and due dates |
| `client` | `user`, `projects`, `messages`, and `unreadMessages` with progress and next milestones |
| `member` | `user`, `membershipStatus`, `benefits`, `resources`, and `updates` |
| `manager` | `user`, `team`, `tasks`, and `approvals` |

## Role-scoped writes

Writes must be authorized by the backend using the JWT subject and role claims; the frontend does not grant permissions:

```text
POST /emp/announcements
POST /client/messages
POST /manager/tasks/assign
```

The member portal is read-only in this initial scope. The API may return 403 for a role attempting to access another role’s endpoint, and 401 for missing or invalid tokens.

## CORS and deployment

The API must allow the isolated portal origin and must not require the public main-site pages to embed or link to the portals. Production configuration belongs in the hosting provider’s protected environment variables. No credentials belong in this repository.
