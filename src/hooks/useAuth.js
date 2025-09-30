// Re-export the useAuth hook implemented in the AuthContext.
// This keeps imports like `import { useAuth } from '../hooks/useAuth'`
// working while the actual implementation lives in `src/contexts/AuthContext.jsx`.
export { useAuth } from "../contexts/AuthContext";
