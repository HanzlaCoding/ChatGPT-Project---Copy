# 🚀 ChatGPT-Project — Frontend Rules & Guidelines

> Keep UI predictable, scalable and collaborative. This document defines how we build, test and ship features.

---

## 📑 Quick Navigation

| Section | Purpose |
|---------|---------|
| 🛠️ [Tech Stack](#-tech-stack) | What we use |
| 📁 [File Structure](#-file--folder-structure) | Where things go |
| ⚛️ [Components](#-component-rules) | How to build UI |
| 🔄 [State & Redux](#-state-management-redux-toolkit) | How data flows |
| 🎨 [Styling](#-styling--tailwind) | How we theme |
| 📝 [Naming & Types](#-naming--types) | Conventions |
| ⏳ [Async & Effects](#-async--side-effects) | Network & timers |
| ✅ [Testing](#-testing) | QA standards |
| 🔨 [Git & CI](#-git--commits) | Workflow |
| ♿ [Quality](#-accessibility--performance) | A11y & perf |

---

## 🛠️ Tech Stack

```
Frontend Stack
├── ⚛️  React 18+ (functional components, hooks only)
├── 🔄 Redux Toolkit (state management)
├── 🎨 Tailwind CSS (utility-first styling)
├── ✨ Framer Motion (animations & microinteractions)
├── 🎯 Lucide React (icon library)
├── 📊 React Redux (bindings)
└── 🔍 ESLint + Prettier (code quality)
```

---

## 📁 File & Folder Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── Home.jsx           (main page, default export)
│   │   └── NotFound.jsx
│   │
│   ├── components/
│   │   ├── Header.jsx         (reusable UI components)
│   │   ├── Sidebar.jsx
│   │   ├── ChatMessage.jsx
│   │   └── common/
│   │       ├── Button.jsx
│   │       └── Card.jsx
│   │
│   ├── store/
│   │   ├── store.js           (configureStore)
│   │   ├── slices/
│   │   │   ├── uiSlice.js     (theme, modals, UI state)
│   │   │   ├── chatSlice.js   (messages, chat history)
│   │   │   └── authSlice.js   (user, tokens, session)
│   │   └── selectors/
│   │       ├── uiSelectors.js
│   │       ├── chatSelectors.js
│   │       └── authSelectors.js
│   │
│   ├── hooks/
│   │   ├── useAuth.js         (custom hooks for common patterns)
│   │   └── useTheme.js
│   │
│   ├── utils/
│   │   ├── api.js             (HTTP client)
│   │   ├── constants.js
│   │   └── helpers.js
│   │
│   ├── styles/
│   │   └── index.css          (global + tailwind imports)
│   │
│   ├── main.jsx               (app entry, Provider wrapper)
│   └── App.jsx                (root layout)
│
├── public/
├── .env.example               (template for env vars)
├── PROJECT_RULES.md           (this file)
├── package.json
└── tailwind.config.js
```

**File Naming:**
- 📄 Components → `PascalCase.jsx` (Header.jsx, ChatMessage.jsx)
- 📄 Slices → `camelCase.js` (uiSlice.js, chatSlice.js)
- 📄 Utilities → `camelCase.js` (helpers.js, constants.js)
- 📄 Hooks → `camelCase.js` with `use` prefix (useAuth.js, useTheme.js)

---

## ⚛️ Component Rules

### ✅ DO
```jsx
// ✅ Small, focused, reusable
const MessageCard = ({ role, text, dark }) => (
  <div className={`p-4 rounded-lg ${dark ? "bg-gray-800" : "bg-white"}`}>
    {text}
  </div>
);
export default MessageCard;

// ✅ Use hooks for state
const [isOpen, setIsOpen] = useState(false);

// ✅ Use useEffect for side-effects
useEffect(() => {
  scrollToBottom();
}, [messages]);

// ✅ Memoize expensive computations
const sortedMessages = useMemo(() => messages.sort(...), [messages]);
```

### ❌ DON'T
```jsx
// ❌ Render 500+ LOC in one component
const MonsterComponent = () => { /* 600 lines */ };

// ❌ Side-effects in render
const BadComponent = () => {
  api.fetchData(); // ❌ Runs every render
  return <div />;
};

// ❌ Prop drilling deep trees
<ChatList messages={msgs} user={u} theme={t} lang={l} status={s} />
```

### 📏 Component Size Guidelines
| LOC | Action |
|-----|--------|
| < 100 | ✅ Good |
| 100-200 | ⚠️ Consider splitting |
| > 200 | ❌ Must refactor |

---

## 🔄 State Management: Redux Toolkit

### ✅ DO: Use Redux for Global State
```jsx
// 📝 Example: uiSlice.js
import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: { dark: true, input: "", sidebarOpen: true },
  reducers: {
    toggleDark: (state) => { state.dark = !state.dark; },
    setInput: (state, action) => { state.input = action.payload; },
    setSidebarOpen: (state, action) => { state.sidebarOpen = action.payload; },
  },
});

export const { toggleDark, setInput, setSidebarOpen } = uiSlice.actions;
export default uiSlice.reducer;
```

### ✅ DO: Connect Components with Hooks
```jsx
import { useDispatch, useSelector } from "react-redux";
import { toggleDark } from "../store/slices/uiSlice";

export default function ThemeToggle() {
  const dispatch = useDispatch();
  const isDark = useSelector((state) => state.ui.dark);

  return (
    <button onClick={() => dispatch(toggleDark())}>
      {isDark ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}
```

### ❌ DON'T: Use Redux for Ephemeral State
```jsx
// ❌ Don't put in Redux
const [isDropdownOpen, setIsDropdownOpen] = useState(false); // local OK

// ✅ Do use Redux for this
const isDarkMode = useSelector((state) => state.ui.dark); // shared
```

### 📊 Slice Structure Template
```js
// slices/featureSlice.js
const initialState = {
  data: [],
  loading: false,
  error: null,
};

const featureSlice = createSlice({
  name: "feature",
  initialState,
  reducers: {
    // Synchronous actions
    addItem: (state, action) => { state.data.push(action.payload); },
  },
  extraReducers: (builder) => {
    // Async thunk handlers
    builder.addCase(fetchData.pending, (state) => { state.loading = true; });
  },
});
```

---

## 🎨 Styling & Tailwind

### ✅ DO: Use Tailwind Utilities
```jsx
<div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow">
  Content
</div>

// Complex classNames → template literal
const buttonClasses = `
  px-4 py-2 rounded-lg font-medium
  ${dark ? "bg-gray-800 text-white" : "bg-white text-gray-800"}
  hover:opacity-80 transition-opacity
`;
```

### ✅ DO: Keep Theme in Redux
```jsx
// In uiSlice
const dark = useSelector((state) => state.ui.dark);
// Pass to components or read directly
```

### ❌ DON'T: Inline Styles Unless Necessary
```jsx
// ❌ Avoid
<div style={{ backgroundColor: isDark ? "#1f1f1f" : "#fff" }} />

// ✅ Do
<div className={isDark ? "bg-gray-900" : "bg-white"} />
```

---

## 📝 Naming & Types

### Variables & Functions
```js
// ✅ Clear, descriptive names
const fetchUserMessages = async () => { ... };
const isMessageComplete = shown.length === text.length;
const handleThemeToggle = () => dispatch(toggleDark());

// ❌ Vague names
const f = () => { ... };
const x = true;
const h = () => { ... };
```

### Exports
```jsx
// 📄 Component file → default export
export default function Header() { ... }

// 📄 Utility/Hook file → named export
export const useAuth = () => { ... };
export const API_BASE_URL = "https://api.example.com";
```

### Constants
```js
// utils/constants.js
export const ROLES = {
  USER: "user",
  ASSISTANT: "assistant",
};

export const API_ENDPOINTS = {
  CHAT: "/chat",
  MESSAGES: "/messages",
};
```

---

## ⏳ Async & Side Effects

### ✅ DO: Use createAsyncThunk
```jsx
import { createAsyncThunk } from "@reduxjs/toolkit";

// In chatSlice.js
export const fetchMessages = createAsyncThunk(
  "chat/fetchMessages",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/messages");
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const chatSlice = createSlice({
  // ...
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => { state.loading = true; })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages = action.payload;
        state.loading = false;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});
```

### ✅ DO: Centralize API Client
```js
// utils/api.js
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:3000";

export const api = {
  chat: {
    sendMessage: (msg) => fetch(`${API_BASE}/chat`, { body: JSON.stringify(msg) }),
    getHistory: () => fetch(`${API_BASE}/chat/history`),
  },
  auth: {
    login: (creds) => fetch(`${API_BASE}/auth/login`, { body: JSON.stringify(creds) }),
  },
};
```

### ❌ DON'T: Network Calls in Components
```jsx
// ❌ Bad
const MyComponent = () => {
  fetch("/api/data").then(...); // ❌ Runs every render
  return <div />;
};

// ✅ Good
const MyComponent = () => {
  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);
  return <div />;
};
```

---

## ✅ Testing

### Unit Tests (Slices & Utils)
```js
// __tests__/chatSlice.test.js
import chatReducer, { addMessage } from "../slices/chatSlice";

describe("chatSlice", () => {
  it("should add a message", () => {
    const state = { messages: [] };
    const newState = chatReducer(state, addMessage({ role: "user", text: "Hi" }));
    expect(newState.messages).toHaveLength(1);
  });
});
```

### Component Tests (RTL)
```jsx
// __tests__/Header.test.jsx
import { render, screen } from "@testing-library/react";
import Header from "../Header";

it("renders header with title", () => {
  render(<Header />);
  expect(screen.getByText("ChatGPT")).toBeInTheDocument();
});
```

### Coverage Target
| Category | Target |
|----------|--------|
| Utilities | 90%+ |
| Slices | 80%+ |
| Components | 60%+ |

---

## 🔨 Git & Commits

### Commit Message Format
```
<type>(<scope>): <description>

[optional body]
[optional footer]
```

### Types
```
feat:   ✨ New feature
fix:    🐛 Bug fix
refactor: ♻️ Code restructure
chore:  🔧 Tooling, deps
docs:   📖 Documentation
style:  🎨 Code style (no logic change)
test:   ✅ Tests
perf:   ⚡ Performance
```

### Examples
```bash
git commit -m "feat(chat): add message streaming support"
git commit -m "fix(ui): dark mode toggle not persisting"
git commit -m "refactor(store): simplify chatSlice structure"
git commit -m "docs: update PROJECT_RULES"
```

### PR Checklist
- [ ] Branch name: `feature/short-desc` or `fix/short-desc`
- [ ] ESLint: `npm run lint` passes
- [ ] Tests: `npm run test` passes
- [ ] No console errors/warnings
- [ ] Responsive on mobile/desktop
- [ ] A11y: keyboard nav works, colors have contrast
- [ ] Commit messages follow Conventional Commits

---

## ♿ Accessibility & Performance

### 🎯 Accessibility Checklist
- [ ] Semantic HTML (`<button>`, `<header>`, `<main>`)
- [ ] Keyboard navigation (Tab, Enter, Escape)
- [ ] ARIA labels for icon buttons: `<button aria-label="Close">`
- [ ] Color contrast ≥ 4.5:1
- [ ] Alt text on images
- [ ] Focus indicators visible
- [ ] Screen reader friendly

### ⚡ Performance Tips
```jsx
// Use React.memo for expensive renders
const MemoizedMessage = React.memo(ChatMessage);

// Memoize callbacks
const handleSend = useCallback(() => { ... }, [input]);

// Lazy load components
const HeavyComponent = React.lazy(() => import('./Heavy'));

// Use keys on lists
{messages.map((m) => <Message key={m.id} {...m} />)}
```

---

##