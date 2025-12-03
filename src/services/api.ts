import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  TransactionsResponse,
  CreatePayeeRequest,
  PayeeResponse,
  PaymentRequest,
  PaymentResponse
} from '@/types/auth';

const API_BASE_URL = 'http://localhost:8080/api';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || 'An error occurred');
  }
  return response.json();
}

export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return handleResponse<AuthResponse>(response);
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<AuthResponse>(response);
  },
};

export const accountsApi = {
  getTransactions: async (accountNo: string, name: string, contactNo: string, isMasterUser: boolean = true): Promise<TransactionsResponse> => {
    const response = await fetch(`${API_BASE_URL}/accounts/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountNo, name, contactNo, isMasterUser }),
    });
    return handleResponse<TransactionsResponse>(response);
  },
};

export const payeesApi = {
  create: async (data: CreatePayeeRequest): Promise<PayeeResponse> => {
    const response = await fetch(`${API_BASE_URL}/payees/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<PayeeResponse>(response);
  },
};

export const paymentsApi = {
  pay: async (data: PaymentRequest): Promise<PaymentResponse> => {
    const response = await fetch(`${API_BASE_URL}/bill-payment/pay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<PaymentResponse>(response);
  },
};
