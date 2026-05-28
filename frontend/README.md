# onShift - Frontend

onShift is a staffing platform for the restaurant industry. Workers can browse and apply for shifts, manage their profile and track their applications. Employers can post shifts, manage applications and hire workers. After a completed shift, both workers and employers can leave reviews for each other.

## Technologies Used

- React
- TypeScript
- Vite
- React Router
- Context API
- ESLint
- Prettier

## Requirements

Make sure you have the following installed:

- Node.js (version 18 or higher)
- Backend server running (see backend README for setup instructions)

## Getting Started

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/on-shift.git
```

2. Navigate to the frontend directory:

```bash
cd frontend
```

3. Install dependencies:

```bash
npm install
```

### Environment Variables

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5001
```

Replace `http://localhost:5001` with the actual URL of your backend server if it differs.

### Run Locally

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## Project Structure

src/
├── api/ # API calls and backend communication
├── assets/ # Static assets
├── components/ # Reusable UI components
├── context/ # React context (auth)
├── hooks/ # Custom React hooks
├── layouts/ # Layout components
├── pages/ # Page components
├── services/ # Service functions
├── styles/ # CSS files
├── types/ # TypeScript interfaces and types
├── utils/ # Utility functions
├── App.tsx # Root component and routing
└── main.tsx # Application entry point

## Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Format code
npm run format
```
