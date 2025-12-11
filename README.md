# Iowa DeerBank - Banking Application

A modern banking web application built with React, featuring a nature-inspired design aesthetic with forest greens and warm ambers.

## 🦌 Project Overview

Iowa DeerBank is a full-featured banking application that provides customers with account management, transaction history, fund transfers, bill payments, and loan management capabilities. The application also includes an administrative panel for bank staff to manage loans and create new customer accounts.

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing
- **Redux Toolkit** - State management
- **TanStack Query** - Server state management
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - UI component library
- **Lucide React** - Icons

### Backend Integration
- **Spring Boot** (Java) - REST API backend
- **JWT Authentication** - Secure token-based auth
- **Dual-layer API Security** - API Key + Bearer Token

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── dashboard/       # Dashboard-specific components
│   │   ├── Header.tsx
│   │   ├── BalanceCard.tsx
│   │   ├── QuickActions.tsx
│   │   └── TransactionList.tsx
│   ├── modals/          # Modal components
│   │   ├── TransferModal.tsx
│   │   ├── AddPayeeModal.tsx
│   │   ├── LoansModal.tsx
│   │   ├── ApplyLoanModal.tsx
│   │   └── LoanPaymentModal.tsx
│   ├── admin/           # Admin panel components
│   │   └── CreateAccountForm.tsx
│   ├── Logo.tsx
│   ├── NavLink.tsx
│   ├── ProtectedRoute.tsx
│   └── SessionWarningModal.tsx
├── pages/
│   ├── Index.tsx        # Landing page
│   ├── Auth.tsx         # Login/Register
│   ├── Dashboard.tsx    # Customer dashboard
│   ├── AdminDashboard.tsx # Admin panel
│   └── NotFound.tsx
├── services/
│   └── api.ts           # API integration layer
├── store/
│   ├── index.ts         # Redux store configuration
│   ├── authSlice.ts     # Authentication state
│   └── hooks.ts         # Typed Redux hooks
├── types/
│   └── auth.ts          # TypeScript interfaces
├── lib/
│   ├── utils.ts         # Utility functions
│   └── jwt.ts           # JWT decoding utilities
└── hooks/
    ├── use-mobile.tsx
    └── use-toast.ts
```

## 🎨 Design System

The application follows a **nature-inspired aesthetic** with:
- **Primary Colors**: Forest greens
- **Accent Colors**: Warm ambers
- **Theme**: Light/dark mode support via CSS variables

All colors are defined as HSL values in `src/index.css` and `tailwind.config.ts` using semantic tokens.

## 🔐 Authentication & Security

### Dual-Layer Authentication
1. **API Key** - Static key (`X-API-Key` header) required on all requests
2. **JWT Bearer Token** - User-specific token from login/register

### Session Management
- JWT tokens stored in localStorage
- Automatic logout on token expiration (401/403 responses)
- **Session warning modal** - Appears 30 seconds before token expiry
- Countdown timer with option to re-login

### Route Protection
- `ProtectedRoute` component guards authenticated routes
- Role-based routing: CUSTOMER → `/dashboard`, MASTER → `/admin`

## 👥 User Types

| Type | Role | Access |
|------|------|--------|
| CUSTOMER | Standard user | Dashboard, transactions, loans |
| MASTER | Administrator | Admin panel, loan approval, account creation |

**Admin Credentials**: `admin` / `adminroot`

## 🚀 Features

### Customer Features
- ✅ Account overview with balance display
- ✅ Transaction history
- ✅ Quick transfer/payment
- ✅ Payee management (add/edit/delete)
- ✅ Bill payments
- ✅ Loan viewing and payments
- ✅ Loan application

### Admin Features
- ✅ Loan lookup by ID
- ✅ Loan approval workflow
- ✅ Loan disbursement
- ✅ New customer account creation

## 🔌 API Integration

### Base Configuration
```typescript
API_BASE_URL: configured via .env file
Headers: {
  'Content-Type': 'application/json',
  'X-API-Key': 'my-super-secret-api-key-12345',
  'Authorization': 'Bearer <jwt-token>',
  'ngrok-skip-browser-warning': 'true'
}
```

### Key Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User authentication |
| POST | `/api/auth/register` | User registration |
| POST | `/api/accounts/transactions` | Get transaction history |
| POST | `/api/accounts/create` | Create new account (admin) |
| GET/POST/PUT/DELETE | `/api/payees/*` | Payee management |
| POST | `/api/bill-payment/pay` | Process bill payment |
| GET/POST | `/api/loans/*` | Loan management |
| POST | `/api/loan-payments` | Make loan payment |

## 🏗️ Development Workflow

### Local Development with ngrok
For connecting to a local Spring Boot backend:

```bash
# Start ngrok with CORS headers
ngrok http 8080 --response-header-add "Access-Control-Allow-Origin: *"
```

Update `.env` with the ngrok URL:
```env
VITE_API_BASE_URL=https://your-ngrok-url.ngrok-free.dev/api
```

### CI/CD Pipeline
- **GitHub Actions** workflow (`.github/workflows/deploy.yml`)
- Automatic build and FTP deployment to Hostinger on push to `main`
- SPA routing handled via `.htaccess` configuration

## 📦 Deployment

### Hosting
- **Platform**: Hostinger
- **Type**: Single Page Application (SPA)
- **Routing**: Apache mod_rewrite via `.htaccess`

### Environment Variables
Create a `.env` file:
```env
VITE_API_BASE_URL=https://your-api-url.com/api
```

## 🤝 Collaboration Process

This project was developed collaboratively using **Lovable AI** as the frontend development platform:

### Development Phases

1. **Project Initialization**
   - Set up React + Vite + TypeScript scaffold
   - Configured Tailwind CSS with nature-inspired design tokens
   - Integrated shadcn/ui component library

2. **Core Features**
   - Implemented authentication flow with JWT
   - Built customer dashboard with account overview
   - Created transaction history and payee management

3. **Advanced Features**
   - Added loan management system
   - Implemented admin panel for MASTER users
   - Built session timeout warning system

4. **API Integration**
   - Aligned frontend types with backend Java DTOs
   - Implemented dual-layer authentication
   - Configured ngrok for local backend testing

5. **Deployment**
   - Set up GitHub Actions CI/CD pipeline
   - Configured Hostinger hosting with SPA routing
   - Established automated FTP deployment

### Key Decisions
- **Redux Toolkit** for centralized state management
- **Dual user type system** (CUSTOMER/MASTER) with role-based routing
- **Session warning modal** for graceful token expiration handling
- **Semantic design tokens** for consistent theming

## 📝 License

This project is proprietary to Iowa DeerBank.

---

Built with ❤️ using [Lovable](https://lovable.dev)
