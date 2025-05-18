## Project Overview

This project is a web application that helps users find jobs and match their resumes to job descriptions. It consists of a client-side application built with React, NextJS, JavaScript, TypeScript, HTML, CSS, and modern UI/UX frameworks (e.g., TailwindCSS, Shadcn, Radix), and a server-side application built with Node.js, Express.js, and MongoDB.

## File Structure

The project has the following file structure:

```
.
├── .git/
├── .github/
├── node_modules/
├── public/
├── server/
├── src/
├── test/
├── .gitignore
├── bun.lockb
├── components.json
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

*   `.git/`: Contains Git repository information.
*   `.github/`: Contains GitHub workflow configurations.
*   `node_modules/`: Contains project dependencies.
*   `public/`: Contains static assets such as images and fonts.
*   `server/`: Contains the server-side code.
*   `src/`: Contains the client-side code.
*   `test/`: Contains unit and integration tests.
*   `.gitignore`: Specifies intentionally untracked files that Git should ignore.
*   `bun.lockb`: Records the exact versions of dependencies used in the project.
*   `components.json`: Configuration file for UI components.
*   `eslint.config.js`: Configuration file for ESLint, a JavaScript linter.
*   `index.html`: The main HTML file for the client-side application.
*   `package-lock.json`: Records the exact versions of dependencies used in the project.
*   `package.json`: Contains project metadata and dependencies.
*   `postcss.config.js`: Configuration file for PostCSS, a CSS transformation tool.
*   `README.md`: Provides a general overview of the project.
*   `tailwind.config.ts`: Configuration file for Tailwind CSS, a CSS framework.
*   `tsconfig.app.json`: Configuration file for the TypeScript compiler, specific to the application.
*   `tsconfig.json`: Configuration file for the TypeScript compiler.
*   `tsconfig.node.json`: Configuration file for the TypeScript compiler.
*   `vite.config.ts`: Configuration file for Vite, a build tool.

### `server/`

```
server/
├── nodemon.json
├── package-lock.json
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── node_modules/
├── src/
└── test/
```

*   `nodemon.json`: Configuration file for Nodemon, a tool that automatically restarts the server when changes are detected.
*   `package-lock.json`: Records the exact versions of dependencies used in the project.
*   `package.json`: Contains project metadata and dependencies.
*   `tsconfig.json`: Configuration file for the TypeScript compiler.
*   `vitest.config.ts`: Configuration file for Vitest, a testing framework.
*   `node_modules/`: Contains project dependencies.
*   `src/`: Contains the server-side code.
*   `test/`: Contains unit and integration tests.

### `src/`

```
src/
├── App.css
├── App.tsx
├── index.css
├── main.tsx
├── vite-env.d.ts
├── components/
├── context/
├── hooks/
├── lib/
├── mocks/
├── pages/
├── services/
├── test/
├── types/
└── utils/
```

*   `App.css`: Contains global CSS styles for the application.
*   `App.tsx`: The main component for the client-side application.
*   `index.css`: Contains global CSS styles for the application.
*   `main.tsx`: The entry point for the client-side application.
*   `vite-env.d.ts`: Contains type definitions for Vite environment variables.
*   `components/`: Contains React components.
*   `context/`: Contains React context providers.
*   `hooks/`: Contains custom React hooks.
*   `lib/`: Contains utility functions and helper modules.
*   `mocks/`: Contains mock data and API handlers for testing.
*   `pages/`: Contains React components for different pages of the application.
*   `services/`: Contains functions for interacting with the server-side API.
*   `test/`: Contains unit and integration tests.
*   `types/`: Contains TypeScript type definitions.
*   `utils/`: Contains utility functions.

## Key Components

*   **`src/App.tsx`**: This is the main component that renders the entire application. It uses React Router to handle navigation and defines the routes for different pages.
*   **`src/components/`**: This directory contains reusable React components that are used throughout the application.
*   **`src/context/`**: This directory contains React context providers that manage the application's state. `AuthContext` is used for authentication, and `JobContext` is used for managing job data.
*   **`src/pages/`**: This directory contains React components for different pages of the application, such as `Dashboard`, `Jobs`, `Profile`, and `AuthPage`.
*   **`server/src/index.ts`**: This is the main entry point for the server-side application. It uses Express.js to handle HTTP requests and defines the API endpoints.
*   **`server/src/routes/`**: This directory contains the route handlers for different API endpoints, such as `auth`, `resume`, and `jobs`.
*   **`server/src/models/`**: This directory contains the data models for the application, such as `User`, `Resume`, and `Job`.

## API Endpoints

The server-side application exposes the following API endpoints:

*   `/api/auth`: Contains authentication-related routes, such as login and registration.
*   `/api/resume`: Contains routes for managing user resumes.
*   `/api/jobs`: Contains routes for managing job listings.

## Authentication

The application uses an authentication flow to protect user data. The `AuthContext` in the client-side manages the authentication state, and the `/api/auth` endpoints on the server-side handle user authentication.

## Data Models

The application uses the following data models:

*   **User**: Represents a user account.
*   **Resume**: Represents a user's resume.
*   **Job**: Represents a job listing.
