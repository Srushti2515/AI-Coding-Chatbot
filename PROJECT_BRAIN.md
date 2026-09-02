# PROJECT BRAIN

## 1. Project Overview
- CodeSphere AI is a React/Vite coding assistant with an Express API.
- Features: AI chat, saved chat history, code generation/explanation/debugging/optimization/conversion, Monaco editor, Judge0 code execution, attachments, voice input, authentication, and Three.js visuals.
- Status: runnable local client/server. MongoDB is required for persistence; Gemini configuration is required for server AI requests. Guest mode has local demo responses.

## 2. Technology Stack
- Frontend: React 19, Vite, Tailwind CSS 4, Axios, Framer Motion, Three.js, `@react-three/fiber`, `@react-three/drei`, `@monaco-editor/react`, Lucide React, React Markdown, Rehype Highlight, Highlight.js, Canvas Confetti.
- Backend: Node.js ES modules, Express, dotenv, Helmet, CORS, express-rate-limit.
- Database: MongoDB through Mongoose.
- Authentication: `jsonwebtoken` and `bcryptjs`.
- AI: Google Gemini through `@google/genai` (the active service); `@google/generative-ai` is also declared.
- Execution: Judge0-compatible HTTP API via native `fetch`.
- Tools: Vite build and Oxlint.

## 3. Project Structure
```text
ChatBot/
├── PROJECT_BRAIN.md              # AI-oriented project map
├── README.md                     # Project documentation
├── .env.example                  # Environment variable names/template
├── client/
│   ├── package.json              # Frontend dependencies/scripts
│   ├── vite.config.js            # Vite config
│   └── src/
│       ├── main.jsx              # React entry point
│       ├── App.jsx               # Providers and view switch
│       ├── index.css, App.css    # Global/app styles
│       ├── context/              # Auth, chat, settings state
│       ├── pages/                # LandingPage, PlaygroundPage
│       ├── components/           # 3d, chat, editor, layout, modal UI
│       └── services/api.js       # Axios client/JWT interceptor
└── server/
    ├── package.json              # Backend dependencies/scripts
    └── src/
        ├── server.js             # Express entry point
        ├── config/db.js           # MongoDB connection
        ├── routes/                # Route declarations
        ├── controllers/           # Request handlers
        ├── services/              # AI orchestration/provider
        ├── middleware/             # Auth/error middleware
        ├── models/                 # Standalone Mongoose schemas
        └── utils/lazyLoad.js       # Lazy imports/runtime models
```

## 4. Frontend Architecture
- `main.jsx` mounts `App` in `React.StrictMode`.
- `App.jsx` nests `SettingsProvider`, `AuthProvider`, and `ChatProvider`; `activeView` selects `LandingPage` or `PlaygroundPage`; modals render globally.
- There is no React Router. View navigation is state-driven through `SettingsContext`.
- `PlaygroundPage` composes `Sidebar`, `ChatWindow`, optional `CodeEditorPanel`, and `TechBackground`.
- `AuthContext` owns login, registration, logout, guest state, and auth modal state. `ChatContext` owns chat/history/editor/panel state. `SettingsContext` owns theme, 3D effects, model label, and Monaco options.
- `services/api.js` uses `http://localhost:5000/api` and attaches `localStorage` key `codesphere_token` as a Bearer token.
- Authenticated users call backend auth/chat/code APIs. Guest chat uses local state and a local delayed response. Code execution always calls the backend.
- `ChatInput` supports browser speech input and file attachments; chat messages use markdown/code rendering.

## 5. Backend Architecture
- `server.js` loads dotenv, configures Helmet/CORS/body parsing/rate limiting, starts `connectDB`, mounts routes, exposes health, and listens on `PORT` or 5000.
- `authControllerNew.js`: registration, login, current user. `authController.js` exists but is not mounted.
- `chatController.js`: AI message generation and saved chat CRUD.
- `codeController.js`: Judge0 execution plus AI explain/debug/optimize/generate/convert handlers.
- `aiService.js`: task prompt construction and delegation. `geminiService.js`: Gemini client, conversation formatting, response extraction, model retry.
- `authMiddleware.js`: `protect` requires JWT; `optionalProtect` permits guest requests. `errorMiddleware.js` serializes uncaught errors.
- Controllers currently request cached runtime models from `utils/lazyLoad.js`; standalone files in `models/` are not imported by them.

## 6. Database Architecture
- MongoDB/Mongoose connection is in `server/src/config/db.js`; it uses `MONGODB_URI` or a local default and continues if connection fails.
- Runtime `User` schema: `name`, unique lowercased/trimmed `email`, hashed `password`, timestamps; password is excluded from JSON.
- Runtime `Chat` schema: required string `userId`, `title`, embedded messages with `role` (`user` or `assistant`), `content`, `timestamp`, and timestamps. Collections are normally `users` and `chats`.
- A Chat belongs to a User through `userId`; messages are embedded.
- Important discrepancy: standalone `models/Chat.js` uses ObjectId `userId`, allows `system`, and uses message `createdAt`; runtime `lazyLoad.js` uses a string `userId`, only user/assistant roles, and `timestamp`.

## 7. API Map
| Method | Endpoint | Purpose | Auth | Handler |
|---|---|---|---|---|
| GET | `/api/health` | Server/AI provider health | No | `server.js` inline handler |
| POST | `/api/auth/register` | Register user and issue JWT | No | `registerUser` |
| POST | `/api/auth/login` | Authenticate demo/database user | No | `loginUser` |
| GET | `/api/auth/me` | Return current user | JWT | `getCurrentUser` |
| POST | `/api/chat` | Generate response and optionally save chat | Optional JWT | `sendMessage` |
| GET | `/api/chats` | List user chats | JWT | `getUserChats` |
| GET | `/api/chats/:id` | Get saved chat | JWT | `getChatById` |
| PUT | `/api/chats/:id` | Rename saved chat | JWT | `updateChatTitle` |
| DELETE | `/api/chats/:id` | Delete saved chat | JWT | `deleteChat` |
| POST | `/api/code/execute` | Submit/poll supported code at Judge0 | No route-level auth | `executeCode` |
| POST | `/api/code/explain` | Explain code with AI | JWT | `explainCode` |
| POST | `/api/code/debug` | Debug code with AI | JWT | `debugCode` |
| POST | `/api/code/optimize` | Optimize code with AI | JWT | `optimizeCode` |
| POST | `/api/code/generate` | Generate code with AI | JWT | `generateCode` |
| POST | `/api/code/convert` | Convert code with AI | JWT | `convertCode` |

All `/api` routes use the global 200 requests/15-minute/IP limiter.

## 8. Authentication Flow
- Registration posts name/email/password to `/api/auth/register`; backend validates, bcrypt-hashes, creates a MongoDB user, and returns a 30-day JWT.
- Login posts email/password to `/api/auth/login`; backend checks its built-in demo-user path first, then MongoDB when connected, and returns a 30-day JWT.
- Frontend stores token as `codesphere_token` and public user data as `codesphere_user`. Axios attaches the token; startup validates it with `/auth/me`.
- `protect` verifies the Bearer token and loads the user. `optionalProtect` continues as guest when absent/invalid.
- Frontend guest login creates local state only and no server JWT. Logout removes both local storage entries. There is no server-side session or token revocation.

## 9. AI Integration
- Provider: Google Gemini. Active SDK: `@google/genai`.
- Model: `AI_MODEL`, default `gemini-2.0-flash`; failed non-`gemini-1.5-flash` calls retry with `gemini-1.5-flash`.
- Flow: controllers call prompt builders in `aiService.js`; `geminiService.js` adds system context, up to six recent messages, and the current message, then calls `generateContent`.
- Response: first candidate/first text part is returned and optionally saved as an assistant message.
- Errors: missing key or provider failures throw; provider calls retry once. Guest responses are client-side and do not use this server path.
- Frontend AI surfaces: chat, prompt suggestions, editor Explain/Debug & Fix/Optimize, and Developer Tools actions.

## 10. Important Data Flows
- Registration: AuthModal -> AuthContext -> Axios `/auth/register` -> bcrypt/Mongoose -> JWT -> local storage/context.
- Login: AuthModal -> `/auth/login` -> demo or MongoDB lookup -> JWT -> local storage/context.
- Chat: ChatInput/editor -> ChatContext -> local guest response or `/api/chat` -> optional Chat save -> AI service -> UI.
- Execution: Monaco -> `runCodeInSandbox` -> `/api/code/execute` -> Judge0 submission/polling -> editor console output.
- History: authenticated ChatContext actions call `/api/chats` and scope queries to `req.user._id`.

## 11. Environment Variables
- `PORT` — Express port.
- `MONGODB_URI` — MongoDB connection URI.
- `JWT_SECRET` — JWT signing/verifying secret.
- `GEMINI_API_KEY` — Gemini authentication.
- `AI_API_KEY` — Alternate AI authentication name.
- `GOOGLE_API_KEY` — Additional Gemini authentication fallback name.
- `AI_MODEL` — Gemini model name.
- `JUDGE0_API_URL` — Judge0-compatible API URL.
- `JUDGE0_API_KEY` — Optional Judge0/RapidAPI authentication.
- `JUDGE0_API_HOST` — Optional Judge0/RapidAPI host header.
- `NODE_ENV` — Production error-stack behavior.

## 12. Important Dependencies
- `react`, `react-dom`: UI runtime; `vite`, `@vitejs/plugin-react`: frontend dev/build.
- `tailwindcss`, PostCSS packages: styling; `axios`: HTTP.
- `@monaco-editor/react`: editor; Three.js packages: 3D canvas; `framer-motion`: animation.
- `react-markdown`, `rehype-highlight`, `highlight.js`: response rendering.
- `express`, `mongoose`, `dotenv`: backend/server/configuration.
- `jsonwebtoken`, `bcryptjs`: auth/password hashing.
- `helmet`, `cors`, `express-rate-limit`: security/request policy.
- `@google/genai`: Gemini client.

## 13. Commands
- Install: `cd client && npm install`; `cd server && npm install`.
- Frontend: `cd client && npm run dev`, `npm run build`, `npm run preview`, `npm run lint`.
- Backend: `cd server && npm run dev`; `npm start`.
- No root package scripts, backend build/lint script, or test script exists.

## 14. Deployment
- No Dockerfile, CI/CD, cloud/IaC, or hosting configuration was found.
- The client API URL is hard-coded to localhost, so deployment requires configuration changes.

## 15. Known Issues
### Confirmed issues
- `config/db.js` does not start an in-memory MongoDB fallback, despite the README claim; failed connection means persistence is unavailable.
- Controllers use runtime schemas from `lazyLoad.js`; standalone model schemas differ and are not the current controller source.
- `geminiService.js` throws without a Gemini-compatible key; the README-described server offline AI fallback is not present in the active path.
- `/api/code/execute` is mounted before `router.use(protect)`, so it is public; other code tools require JWT.
- No automated test command exists.

### TODO/incomplete features
- No deployment setup or explicit TODO markers were found in inspected files.

### Potential risks
- CORS allows all origins.
- Auth code has a built-in JWT secret fallback if `JWT_SECRET` is absent.
- Non-production error responses can include stack traces.
- User code is sent to an external Judge0-compatible service.

## 16. Coding Conventions
- Functional React components, hooks, Context providers, and grouped PascalCase component files.
- Backend ES module imports with `.js` extensions, camelCase handlers/services, and Express router modules.
- API handlers validate required fields and return JSON shapes using `message`, `result`, or feature-specific fields.
- Unexpected backend errors usually use `next(error)`; chat also has a local 500 response.
- Database fields use camelCase and Mongoose timestamps. Preserve the quote style of the edited file.

## 17. File Responsibility Map
| File/Folder | Responsibility |
|---|---|
| `client/src/main.jsx` | React bootstrap |
| `client/src/App.jsx` | Providers and main view switch |
| `client/src/context/AuthContext.jsx` | Auth and local token/user state |
| `client/src/context/ChatContext.jsx` | Chat/history/editor/execution state |
| `client/src/context/SettingsContext.jsx` | Theme/effects/model/editor settings |
| `client/src/services/api.js` | Axios base URL and JWT interceptor |
| `client/src/pages/` | Landing and playground views |
| `client/src/components/chat/` | Chat UI and response rendering |
| `client/src/components/editor/CodeEditorPanel.jsx` | Monaco, AI actions, execution UI |
| `client/src/components/layout/` | Navbar/sidebar/footer |
| `client/src/components/modal/` | Auth/settings/tools dialogs |
| `server/src/server.js` | Express setup and route mounts |
| `server/src/config/db.js` | MongoDB connection |
| `server/src/routes/` | API paths and auth boundaries |
| `server/src/controllers/` | Request handlers |
| `server/src/services/` | AI prompt/provider logic |
| `server/src/middleware/` | JWT and error handling |
| `server/src/models/` | Standalone schemas |
| `server/src/utils/lazyLoad.js` | Lazy imports/runtime schemas |

## 18. AI Agent Rules
Future AI agents must:
1. Read `PROJECT_BRAIN.md` first.
2. Use it to locate relevant files.
3. Read only source files relevant to the current task.
4. Never request, expose, copy, or store credentials.
5. Never hardcode secrets.
6. Reuse existing code when possible.
7. Do not create duplicate routes, services, models, or components.
8. Do not change the technology stack without permission.
9. Make the smallest safe change.
10. Preserve existing functionality.
11. Verify imports and affected functionality after changes.
12. Update this file only when important architecture/project structure changes.

`PROJECT_BRAIN.md` is a project map, not a replacement for source code. For every task: read this file -> identify relevant files -> read only those files -> make minimal changes -> test/verify -> update this file only if architecture changed.

## 19. Architecture Diagram
```mermaid
flowchart TD
  Browser[React Vite client] --> Contexts[Auth Chat Settings Contexts]
  Contexts --> API[Axios API client]
  API --> Server[Express server]
  Server --> Auth[/api/auth]
  Server --> Chat[/api/chat and /api/chats]
  Server --> Code[/api/code]
  Auth --> AuthController[Auth controllers]
  Chat --> ChatController[Chat controller]
  Code --> CodeController[Code controller]
  AuthController --> Lazy[Lazy runtime models]
  ChatController --> Lazy
  Lazy --> Mongo[(MongoDB)]
  ChatController --> AI[AI service]
  CodeController --> AI
  AI --> Gemini[Google Gemini]
  CodeController --> Judge0[Judge0-compatible API]
```

## 20. QUICK CONTEXT
- CodeSphere AI is a React coding assistant with an Express backend.
- Frontend: React 19, Vite, Tailwind, Context state, Axios.
- Backend: Node ESM and Express.
- Database: MongoDB/Mongoose when reachable.
- Auth: bcrypt passwords, 30-day JWTs, localStorage token.
- AI: Google Gemini via `@google/genai`.
- Features: chat, history, Monaco editor, AI code tools, Judge0 execution, attachments, voice input, 3D effects.
- Frontend entry: `client/src/main.jsx`; main views are `LandingPage` and `PlaygroundPage`.
- Frontend state/API: `client/src/context/` and `client/src/services/api.js`.
- Backend entry: `server/src/server.js`; routes are under `/api/auth`, `/api`, and `/api/code`.
- Runtime models are built in `server/src/utils/lazyLoad.js`.
- `/api/chat` supports optional auth; saved history requires JWT.
- `/api/code/execute` is public; other code AI routes require JWT.
- Gemini orchestration is in `server/src/services/`.
- Code execution uses a Judge0-compatible external API.
- No tests, root scripts, or deployment files were found.
- Read this map first and inspect only task-relevant source.
- Never expose environment values or credentials.
- Make minimal changes and verify affected behavior.
