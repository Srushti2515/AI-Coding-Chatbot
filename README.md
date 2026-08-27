# CodeSphere AI — Modern AI Coding Chatbot Web Application

![CodeSphere AI](https://img.shields.io/badge/CodeSphere-AI--Assistant-06b6d4?style=for-the-badge&logo=react)
![Stack](https://img.shields.io/badge/Stack-React%20%7C%20Vite%20%7C%20Tailwind%20%7C%20Node.js%20%7C%20Express%20%7C%20MongoDB%20%7C%20Three.js-8b5cf6?style=for-the-badge)

**CodeSphere AI** is a production-quality, modern AI coding assistant web application designed to help software engineers, developers, and beginners ask programming questions, generate code, debug runtime errors, explain algorithms line-by-line, optimize performance, and convert code across multiple languages.

---

## 🌟 Key Features

* **3D Developer Experience**: Interactive Three.js 3D background with floating code symbols (`</>`, `{ }`, `JS`, `PY`, `AI`), glowing connected nodes, and 3D Effects ON/OFF toggle.
* **AI Coding Playground**: Responsive chat interface supporting quick prompts, message copy, markdown code rendering, line numbers, and file attachments.
* **Monaco IDE Split Panel**: Integrated VS Code Monaco editor with live JavaScript sandbox execution runner and AI quick actions (`Explain`, `Debug & Fix`, `Optimize`).
* **Developer Tools Suite**: Direct tools for Code Generation, Debugging, Line-by-Line Explaining, Performance Optimization, Unit Test Generation, Documentation, and Language Conversion (Python ↔ Java ↔ C++ ↔ JavaScript ↔ TypeScript ↔ SQL).
* **Voice & File Uploads**: Speech-to-text voice input (Web Speech API) and code file parser (`.js`, `.jsx`, `.ts`, `.tsx`, `.py`, `.java`, `.cpp`, `.c`, `.html`, `.css`, `.json`, `.sql`, `.md`, `.txt`).
* **Authentication & Persistence**: User registration, login, JWT token auth, password hashing (`bcryptjs`), and MongoDB chat history storage with an in-memory fallback server.
* **Clean AI Layer**: Server-side AI provider service supporting Google Gemini API (`gemini-1.5-flash`, `gemini-2.0-flash`) with zero client key exposure and intelligent offline fallback.

---

## 🛠️ Technology Stack

### Frontend (`/client`)
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS v4 (Glassmorphism dark theme, custom scrollbars)
- **3D Graphics**: Three.js, `@react-three/fiber`, `@react-three/drei`
- **Code Editor**: `@monaco-editor/react`
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Markdown & Code**: `react-markdown` + custom `CodeBlock` component

### Backend (`/server`)
- **Runtime**: Node.js + Express.js
- **Database**: MongoDB with Mongoose (with automated `mongodb-memory-server` fallback)
- **Security**: JWT (`jsonwebtoken`), Password Hashing (`bcryptjs`), Helmet, CORS, Rate Limiting (`express-rate-limit`)
- **AI Service**: `@google/generative-ai` (Gemini API) + Fallback Response Engine

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

---

### Step 1: Clone & Setup

```bash
# Clone repository
cd valiant-borg
```

---

### Step 2: Install & Start Backend Server

```bash
cd server
npm install
npm run dev
```

The Express API server will start on **`http://localhost:5000`**.  
*Note: If no local MongoDB server is running, an in-memory MongoDB database will automatically start seamlessly.*

---

### Step 3: Install & Start Frontend Client

In a new terminal window:

```bash
cd client
npm install
npm run dev
```

Open your browser at **`http://localhost:5173/`**.

---

## ⚙️ Environment Variables Configuration

Copy `.env.example` to `.env` or set environment variables in `./server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/codesphere_ai
JWT_SECRET=codesphere_super_secret_jwt_key_2026

# Optional: Add your Google Gemini API key to enable live online Gemini AI responses
AI_API_KEY=your_gemini_api_key_here
AI_MODEL=gemini-1.5-flash
```

> **Note**: If `AI_API_KEY` is omitted, CodeSphere AI automatically uses its built-in offline developer engine so all features work immediately out of the box!

---

## 📂 Project Architecture

```text
valiant-borg/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── 3d/               # Three.js canvas & floating 3D nodes
│   │   │   ├── chat/             # ChatWindow, ChatMessage, CodeBlock, ChatInput, PromptSuggestions
│   │   │   ├── editor/           # Monaco CodeEditorPanel & JS Sandbox Runner
│   │   │   ├── layout/           # Navbar, Sidebar, Footer
│   │   │   ├── modal/            # AuthModal, SettingsModal, ToolsModal
│   │   ├── context/              # AuthContext, ChatContext, SettingsContext
│   │   ├── pages/                # LandingPage, PlaygroundPage
│   │   ├── services/             # Axios API client with JWT bearer interceptors
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── src/
│   │   ├── config/               # db.js (MongoDB & In-memory connection)
│   │   ├── controllers/          # authController, chatController, codeController
│   │   ├── middleware/           # authMiddleware, errorMiddleware
│   │   ├── models/               # User.js, Chat.js
│   │   ├── routes/               # authRoutes, chatRoutes, codeRoutes
│   │   ├── services/             # aiService.js (Gemini API & Offline Fallback)
│   │   └── server.js
│   ├── package.json
│   └── .env
│
├── .env.example
└── README.md
```

---

## 🧪 Verification & Testing Commands

To verify production bundle build:

```bash
cd client
npm run build
```

To test API health endpoint:

```bash
curl http://localhost:5000/api/health
```

---

## 📄 License

Distributed under the MIT License.
