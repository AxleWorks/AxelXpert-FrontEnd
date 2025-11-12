# Testing Guide for AxelXpert Frontend

## Overview
This project uses **Vitest** as the test runner along with **React Testing Library** for component testing.

## Installation
All testing dependencies are already installed. If you need to reinstall:
```bash
npm install --save-dev vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitest/coverage-v8
```

## Available Test Scripts

### Run tests in watch mode (interactive)
```bash
npm test
```

### Run tests with UI dashboard
```bash
npm run test:ui
```
This opens a browser-based UI at `http://localhost:51204/__vitest__/`

### Run tests once (CI/CD mode)
```bash
npm run test:run
```

### Run tests with coverage report
```bash
npm run test:coverage
```
Coverage report will be generated in `coverage/` directory

### Run tests in watch mode
```bash
npm run test:watch
```

## Test File Patterns
Vitest will automatically detect test files matching these patterns:
- `**/*.test.{js,jsx}`
- `**/*.spec.{js,jsx}`
- `**/__tests__/**/*.{js,jsx}`

## Writing Tests

### Component Testing Example
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('handles user interaction', () => {
    const handleClick = vi.fn();
    render(<MyComponent onClick={handleClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });
});
```

### Testing with React Router
```javascript
import { BrowserRouter } from 'react-router-dom';

render(
  <BrowserRouter>
    <YourComponent />
  </BrowserRouter>
);
```

### Mocking Contexts
```javascript
vi.mock('./contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 1, role: 'user' },
    loading: false,
  }),
}));
```

### Async Testing
```javascript
import { waitFor } from '@testing-library/react';

it('loads data', async () => {
  render(<DataComponent />);
  
  await waitFor(() => {
    expect(screen.getByText('Loaded Data')).toBeInTheDocument();
  });
});
```

## Test Coverage Goals
Current coverage thresholds set in `vitest.config.js`:
- Lines: 70%
- Functions: 70%
- Branches: 70%
- Statements: 70%

## Best Practices

### 1. Test User Behavior, Not Implementation
```javascript
// ✅ Good
expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();

// ❌ Bad
expect(wrapper.find('.submit-button')).toHaveLength(1);
```

### 2. Use Accessible Queries
Priority order:
1. `getByRole`
2. `getByLabelText`
3. `getByPlaceholderText`
4. `getByText`
5. `getByTestId` (last resort)

### 3. Clean Up After Tests
The setup file automatically cleans up after each test, but for manual cleanup:
```javascript
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});
```

### 4. Mock External Dependencies
```javascript
vi.mock('axios');
vi.mock('./services/apiService');
```

### 5. Test Edge Cases
- Loading states
- Error states
- Empty states
- Disabled states
- Different user roles

## Common Testing Patterns

### Testing Forms
```javascript
import userEvent from '@testing-library/user-event';

it('submits form with user input', async () => {
  const user = userEvent.setup();
  render(<LoginForm />);
  
  await user.type(screen.getByLabelText(/email/i), 'test@example.com');
  await user.type(screen.getByLabelText(/password/i), 'password123');
  await user.click(screen.getByRole('button', { name: /sign in/i }));
  
  expect(mockSubmit).toHaveBeenCalledWith({
    email: 'test@example.com',
    password: 'password123',
  });
});
```

### Testing API Calls
```javascript
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/user', (req, res, ctx) => {
    return res(ctx.json({ name: 'John Doe' }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### Testing Protected Routes
```javascript
it('redirects unauthenticated users', () => {
  useAuth.mockReturnValue({ user: null, loading: false });
  
  render(
    <BrowserRouter>
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    </BrowserRouter>
  );
  
  expect(screen.getByText(/redirecting/i)).toBeInTheDocument();
});
```

## Debugging Tests

### Run specific test file
```bash
npm test -- src/components/Button.test.jsx
```

### Run tests matching pattern
```bash
npm test -- --grep "Button Component"
```

### Debug in VS Code
Add breakpoint in test file and use VS Code's built-in debugger with Vitest extension.

### View test output
```bash
npm run test:ui
```
Opens interactive UI for debugging failed tests.

## CI/CD Integration

### GitHub Actions Example
```yaml
- name: Run tests
  run: npm run test:coverage

- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/coverage-final.json
```

## Files Structure
```
src/
├── components/
│   ├── auth/
│   │   ├── ProtectedRoute.jsx
│   │   └── ProtectedRoute.test.jsx
│   └── ui/
│       ├── button.jsx
│       └── button.test.jsx
├── utils/
│   ├── jwtUtils.js
│   └── jwtUtils.test.js
└── App.test.jsx

tests/
└── setup.js (global test configuration)
```

## Troubleshooting

### Issue: Tests timeout
- Increase timeout in `vitest.config.js`
- Use `waitFor` for async operations

### Issue: Module not found
- Check import paths
- Ensure aliases are configured in `vitest.config.js`

### Issue: React hooks error
- Wrap component in proper context providers
- Use `act` from `@testing-library/react` for state updates

## Resources
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Example Test Reports

After running `npm run test:coverage`, view:
- HTML Report: `coverage/index.html`
- Console Summary: Displayed in terminal
- JSON Report: `coverage/coverage-final.json`
