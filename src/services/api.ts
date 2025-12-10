import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  TransactionsResponse,
  GetTransactionsRequest,
  PayeeRequest,
  PayeeApiResponse,
  PayeesListResponse,
  BillPaymentRequest,
  PaymentApiResponse,
  CreateAccountRequest,
  AccountResponse,
  DepositRequest,
  WithdrawalRequest,
  TransactionResponse,
  ApiResponse,
  LoanRequestDTO,
  LoanDTO,
  LoanApiResponse,
  LoansListResponse,
  LoanPaymentRequest,
  LoanPaymentApiResponse,
  LoanPaymentsListResponse,
  LoanSummaryResponse
} from '@/types/auth';

// Use ngrok for Lovable preview, localhost for local development
// Change to 'http://localhost:8080/api' if running frontend locally without ngrok
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://janett-achlamydate-springingly.ngrok-free.dev/api';
const API_KEY = 'my-super-secret-api-key-12345';

// Token management
let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export const getAuthToken = () => authToken;

const getHeaders = (includeAuth: boolean = true): HeadersInit => {
  const headers: HeadersInit = { 
    'Content-Type': 'application/json',
    'X-API-Key': API_KEY,
    'ngrok-skip-browser-warning': 'true' // Required for ngrok free tier
  };
  if (includeAuth && authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  return headers;
};

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    // Preserve the full error object for better error messages (e.g., insufficient balance)
    const errorWithResponse = new Error(error.error || error.message || 'An error occurred');
    (errorWithResponse as any).response = error;
    throw errorWithResponse;
  }
  return response.json();
}

export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify(credentials),
    });
    return handleResponse<AuthResponse>(response);
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify(data),
    });
    return handleResponse<AuthResponse>(response);
  },
};

export const accountsApi = {
  create: async (data: CreateAccountRequest): Promise<ApiResponse<AccountResponse>> => {
    const response = await fetch(`${API_BASE_URL}/accounts/create`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<ApiResponse<AccountResponse>>(response);
  },

  deposit: async (data: DepositRequest): Promise<ApiResponse<TransactionResponse>> => {
    const response = await fetch(`${API_BASE_URL}/accounts/deposit`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<ApiResponse<TransactionResponse>>(response);
  },

  withdraw: async (data: WithdrawalRequest): Promise<ApiResponse<TransactionResponse>> => {
    const response = await fetch(`${API_BASE_URL}/accounts/withdrawal`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<ApiResponse<TransactionResponse>>(response);
  },

  getTransactions: async (data: GetTransactionsRequest): Promise<TransactionsResponse> => {
    const response = await fetch(`${API_BASE_URL}/accounts/transactions`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<TransactionsResponse>(response);
  },
};

export const payeesApi = {
  getAll: async (): Promise<PayeesListResponse> => {
    const response = await fetch(`${API_BASE_URL}/payees`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse<PayeesListResponse>(response);
  },

  getById: async (id: number): Promise<PayeeApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/payees/${id}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse<PayeeApiResponse>(response);
  },

  create: async (data: PayeeRequest): Promise<PayeeApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/payees/create`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<PayeeApiResponse>(response);
  },

  update: async (id: number, data: PayeeRequest): Promise<PayeeApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/payees?id=${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<PayeeApiResponse>(response);
  },

  delete: async (id: number): Promise<ApiResponse<string>> => {
    const response = await fetch(`${API_BASE_URL}/payees?id=${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse<ApiResponse<string>>(response);
  },
};

export const paymentsApi = {
  pay: async (data: BillPaymentRequest): Promise<PaymentApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/bill-payment/pay`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<PaymentApiResponse>(response);
  },
};

export const loansApi = {
  // Apply for a new loan - returns LoanDTO directly
  apply: async (data: LoanRequestDTO): Promise<LoanDTO> => {
    const response = await fetch(`${API_BASE_URL}/loans/apply`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<LoanDTO>(response);
  },

  // Get loan by ID
  getById: async (loanId: number): Promise<LoanApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/loans/${loanId}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse<LoanApiResponse>(response);
  },

  // Get all loans for a user
  getByUserId: async (userId: number): Promise<LoansListResponse> => {
    const response = await fetch(`${API_BASE_URL}/loans/user/${userId}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse<LoansListResponse>(response);
  },

  // Get active loans for a user
  getActiveByUserId: async (userId: number): Promise<LoansListResponse> => {
    const response = await fetch(`${API_BASE_URL}/loans/user/${userId}/active`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse<LoansListResponse>(response);
  },

  // Get loan summary for a user
  getSummary: async (userId: number): Promise<LoanSummaryResponse> => {
    const response = await fetch(`${API_BASE_URL}/loans/user/${userId}/summary`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse<LoanSummaryResponse>(response);
  },

  // Admin: Approve loan
  approve: async (loanId: number, approvedBy: number): Promise<LoanApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/loans/${loanId}/approve?approvedBy=${approvedBy}`, {
      method: 'PUT',
      headers: getHeaders(),
    });
    return handleResponse<LoanApiResponse>(response);
  },

  // Admin: Disburse loan
  disburse: async (loanId: number, disbursedBy: number): Promise<LoanApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/loans/${loanId}/disburse?disbursedBy=${disbursedBy}`, {
      method: 'PUT',
      headers: getHeaders(),
    });
    return handleResponse<LoanApiResponse>(response);
  },
};

export const loanPaymentsApi = {
  // Make a loan payment
  pay: async (data: LoanPaymentRequest): Promise<LoanPaymentApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/loan-payments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<LoanPaymentApiResponse>(response);
  },

  // Get payments for a loan
  getByLoanId: async (loanId: number): Promise<LoanPaymentsListResponse> => {
    const response = await fetch(`${API_BASE_URL}/loan-payments/loan/${loanId}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse<LoanPaymentsListResponse>(response);
  },

  // Get transaction history for a loan
  getTransactionHistory: async (loanId: number): Promise<LoanPaymentsListResponse> => {
    const response = await fetch(`${API_BASE_URL}/loan-payments/loan/${loanId}/transactions`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse<LoanPaymentsListResponse>(response);
  },
};
