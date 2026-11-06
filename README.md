# BookNook 📚

A modern, full-stack book sharing and library management platform designed for book lovers. BookNook allows members to browse curated collections, borrow books with real-time copy tracking, contribute new titles, and manage their personal reading and borrowing history through a seamless, responsive interface.

---

## 🌟 5 Key Features

1. **Curated Book Catalog & Discovery**
   - Browse through recently added books and explore full collections categorized across genres (Fiction, Non-Fiction, Fantasy, Self-Help).
   - Detailed book profile pages showcase cover images, author information, descriptions, user submitters, and live available copies.

2. **One-Time Borrowing & Real-Time Inventory Control**
   - Authenticated users can borrow available books with a streamlined borrowing modal.
   - Intelligent concurrency guard prevents duplicate active borrowing of the same book by the same user while keeping available inventory counts synchronized in real-time.

3. **Personalized "My Books" & Contribution Management**
   - Dedicated dashboard where users can view all the books they have contributed to the platform.
   - Fully interactive edit and delete functionalities with responsive modal dialogs to update book details, adjust copy quantities, or remove listings.

4. **"My Borrows" Reading Hub & 1-Click Return System**
   - A personalized center for tracking all actively borrowed and previously returned books.
   - Built-in 1-click return mechanism that immediately updates the book's status and restores available inventory on the shelf.

5. **Secure Authentication & Cryptographic Session Architecture**
   - Powered by Better-Auth with MongoDB adapter and JWT tokens.
   - Protected routes across private actions (adding, borrowing, editing, and returning books) backed by cryptographic JWKS signature verification supporting both remote endpoint discovery and shared database fallback.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, Base UI / shadcn primitives, Lucide React, React-Toastify
- **Authentication**: Better-Auth, Google OAuth, Email/Password, Jose (JWT / JWKS)
- **Backend**: Express.js, Node.js, MongoDB Driver
- **Database**: MongoDB Atlas

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm (Node Package Manager)
- A running MongoDB instance (or MongoDB Atlas cluster)

### 1. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/Raunak-1607/booknook.git
cd booknook
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Better Auth Configuration
BETTER_AUTH_SECRET=your_auth_secret_key
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Backend API URLs
NEXT_PUBLIC_BACKEND_URL=https://booknook-server-flax.vercel.app
BACKEND_URL=https://booknook-server-flax.vercel.app

# Database Connection
MONGO_URL=your_mongodb_connection_string
```

### 3. Development Server

Run the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 4. Build & Lint

```bash
# Run ESLint check
npm run lint

# Build production bundle & typecheck
npm run build
```

---

## 📁 Project Structure

```text
booknook/
├── app/
│   ├── Add-Books/          # Add book form (protected)
│   ├── All-Books/          # Catalog & dynamic [BooksId] details
│   │   ├── [BooksId]/      # Book detail & borrow modal
│   │   ├── not-found.tsx   # Custom 404 for unauthenticated/missing catalog
│   │   └── page.tsx        # Server-rendered books page
│   ├── Auth/               # Login & Registration pages
│   ├── My-Books/           # User contributed books dashboard
│   ├── My-Borrows/         # Active borrows & return management
│   ├── globals.css         # Tailwind v4 theme tokens
│   ├── layout.tsx          # Root shell with Navbar & ToastContainer
│   └── not-found.tsx       # Global 404 page
├── components/
│   ├── ui/                 # shadcn & Base UI components
│   ├── BookCard.tsx        # Reusable book presentation card
│   ├── EditBooks.tsx       # Responsive book editing modal
│   ├── DeleteBooks.tsx     # Book deletion confirmation modal
│   ├── Navbar.tsx          # Navigation header with auth-aware links
│   └── RecentBooks.tsx     # Homepage fresh books showcase
├── hooks/                  # Custom React hooks
└── lib/                    # Auth clients, API config, types, & utilities
```

---

## 📄 License

This project is licensed under the MIT License.
