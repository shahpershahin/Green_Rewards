# Green Rewards – Smart Waste Segregation & Citizen Incentive Platform

> **Academic Project** &bull; B.Tech Semester 3 &bull; Built with React.js, Next.js App Router, and Tailwind CSS.

---

## 📖 Project Overview

**Green Rewards** is a full-stack web application designed to encourage household waste segregation at source through digital incentives. 

Citizens upload photographs of segregated household waste (Wet, Dry, E-Waste, Other). Municipal administrators review and verify submissions to award digital **Green Coins**. Participating local merchants offer predefined cash discount vouchers that citizens can redeem using their earned Green Coins.

---

## 🛠️ Technology Stack (Academic Syllabus)

- **Frontend Framework**: Next.js 16 (App Router) with pure JavaScript & JSX
- **Styling**: Tailwind CSS with custom eco-friendly palette
- **State Management**: React Context API (`AuthContext`, `WalletContext`) & native hooks (`useState`, `useEffect`, `useContext`, `useCallback`)
- **Backend**: Next.js Route Handlers (`app/api/`) adhering to REST principles
- **Validation**: Zod (client-side form validation & server-side payload validation)
- **Database**: Local relational JSON database engine with atomic file transactions
- **Authentication**: SHA-256 password hashing with salt and session token handling

---

## 👥 User Roles & Features

### 1. Citizen Portal
- Register, login, and access citizen dashboard
- Upload waste photographs with category selection, quantity, and live image preview
- Automated **Simulated AI Pre-Verification** screening
- View submission history with status badges (`Pending`, `Approved`, `Rejected`) and admin feedback
- Track live Green Coin balance in the **Green Coin Wallet**
- Browse partner business discount vouchers and redeem Green Coins
- View claimed voucher tokens (`Requested`, `Accepted`, `Rejected`)

### 2. Administrator Portal
- Admin dashboard displaying registered citizens, submissions, approvals, and coins issued
- Submission review queue with waste photos, contributor details, and category matching
- **Approve** contributions (automatically awards Green Coins and logs transaction)
- **Reject** contributions with required explanatory feedback
- Waste Categories manager with live reward coin modifier
- Citizen directory, merchant directory, and platform-wide immutable transaction ledger

### 3. Business Portal
- Merchant registration and store profile management
- Publish and manage discount offers (set required coins and discount amount)
- Customer voucher verification queue: **Accept & Honor** or **Reject** (with auto-refund to citizen)
- Track total Green Coins accepted and discount metrics

---

## ⚡ One-Click Demo Credentials (Viva Testing)

The database comes pre-seeded with sample data for immediate viva demonstration:

| Role | Email | Password | Pre-seeded Balance / State |
| :--- | :--- | :--- | :--- |
| **Citizen** | `citizen@example.com` | `citizen123` | 30 Green Coins, 2 approved submissions, 1 pending |
| **Administrator** | `admin@greenrewards.org` | `admin123` | Full administrative review and category controls |
| **Business** | `mart@prakriti.com` | `business123` | Prakriti Organic Mart (2 active discount offers) |

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 📂 Project Structure

```
├── app/
│   ├── api/                     # REST Route Handlers (auth, waste, citizen, admin, business)
│   ├── citizen/                 # Citizen portal routes (dashboard, upload, wallet, rewards)
│   ├── admin/                   # Admin portal routes (dashboard, submissions, categories)
│   ├── business/                # Business portal routes (dashboard, offers, redemptions)
│   ├── layout.js                # Root layout with persistent Navbar, Footer, and Providers
│   └── page.js                  # Public homepage
├── components/
│   ├── ui/                      # Reusable components (Button, Badge, Card)
│   ├── Navbar.js                # Responsive navigation with live wallet counter
│   ├── Footer.js                # Footer with project and course details
│   ├── PortalSidebar.js         # Role-specific portal sidebar
│   ├── ProtectedRoute.js        # Role-based route authorization guard
│   └── Providers.js             # Context providers wrapper
├── context/                     # AuthContext & WalletContext
├── hooks/                       # useAuth & useWallet custom hooks
├── lib/                         # db.js, auth.js, validations.js, constants.js
├── public/uploads/              # Uploaded waste photos storage
└── data/db.json                 # Persistent relational data store
```
