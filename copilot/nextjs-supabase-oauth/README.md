# README.md

# Next.js Supabase OAuth

This project is a Next.js application that integrates Google OAuth authentication using Supabase. It provides a simple interface for users to sign in with their Google accounts and access protected resources.

## Features

- Google OAuth authentication
- User session management
- Protected routes
- Responsive Navbar

## Getting Started

### Prerequisites

- Node.js (version 14 or later)
- npm or yarn

### Installation

1. Clone the repository:

   git clone https://github.com/yourusername/nextjs-supabase-oauth.git

2. Navigate to the project directory:

   cd nextjs-supabase-oauth

3. Install the dependencies:

   npm install

   or

   yarn install

### Environment Variables

Create a `.env.local` file in the root of the project and add your Supabase URL and anon key, as well as your Google OAuth credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Running the Application

To start the development server, run:

npm run dev

or

yarn dev

Open your browser and navigate to `http://localhost:3000` to see the application in action.

### Usage

- Click on the "Sign in with Google" button to authenticate.
- Access the profile page to view user data.
- Use the Navbar to navigate between pages and sign out.

### License

This project is licensed under the MIT License. See the LICENSE file for more details.