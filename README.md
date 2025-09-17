# Data Flow

**Live Demo:** [https://data-flow-three-mu.vercel.app/](https://data-flow-tawny.vercel.app/)

Data Flow is an intelligent web application designed to instantly structure your messy data and unlock valuable insights. Simply upload a file (`CSV`, `JSON`, `TXT`) or paste raw text, and let our AI-powered engine clean, organize, and analyze your information.

This application is built with a modern tech stack including **React**, **Vite**, and **Tailwind CSS** for the frontend, with **Firebase** for user authentication and data storage. The core data processing is powered by the **Google Generative AI (Gemini)** API. More feature will be added in time.

---

## Features

- **File Upload & Text Input:** Supports uploading `.csv`, `.json`, and `.txt` files, or directly pasting text.
- **AI-Powered Data Structuring:** Utilizes the Gemini API to automatically convert unstructured data into a clean, tabular format.
- **Insight Generation:** Analyzes the provided data to generate summaries and key insights.
- **User Authentication:** Secure sign-up and login functionality using Firebase Authentication.
- **Upload History:** Logged-in users can view a history of their past data processing sessions, stored in Firestore.
- **Data Export:** Download your structured data or insights as a `.csv` file.
- **Theming:** Includes a dark/light mode toggle for user preference.
- More feature will be added in time.

---

## Tech Stack

- **Frontend:** React, Vite.js
- **Styling:** Tailwind CSS, tailwindcss-animate
- **Routing:** React Router
- **Backend & Database:** Firebase (Authentication, Firestore)
- **AI:** Google Generative AI (Gemini)

---

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 14 or higher)
- npm (or any other package manager like yarn or pnpm)

---

### Installation & Setup

Clone the repository:

```bash
git clone https://github.com/your-username/data-flow.git
cd data-flow
```

Install NPM packages:

```bash
npm install
```

Set up environment variables:

Create a `.env.local` file in the root of the project to store your API keys:

```bash
cp .env.example .env.local
```

Open the `.env.local` file and add your secret keys from Firebase and Google AI Studio:

```env
VITE_FIREBASE_API_KEY="your-firebase-api-key"
VITE_FIREBASE_AUTH_DOMAIN="your-firebase-auth-domain"
VITE_FIREBASE_PROJECT_ID="your-firebase-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-firebase-storage-bucket"
VITE_FIREBASE_MESSAGING_SENDER_ID="your-firebase-messaging-sender-id"
VITE_FIREBASE_APP_ID="your-firebase-app-id"
VITE_GEMINI_API_KEY="your-gemini-api-key"
```

Run the development server:

```bash
npm run dev
```

This will start the Vite development server, typically on [http://localhost:5173](http://localhost:5173).

---

## 🏗 Building for Production

To create a production build of the application, run:

```bash
npm run build
```

This will generate a `dist` directory with the optimized and bundled files ready for deployment.
