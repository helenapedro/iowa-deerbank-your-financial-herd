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
  ApiResponse
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
  create: async (data: CreateAccountRequest): Promise<ApiResponse<AccountResponse>> => {
    const response = await fetch(`${API_BASE_URL}/accounts/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<ApiResponse<AccountResponse>>(response);
  },

  deposit: async (data: DepositRequest): Promise<ApiResponse<TransactionResponse>> => {
    const response = await fetch(`${API_BASE_URL}/accounts/deposit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<ApiResponse<TransactionResponse>>(response);
  },

  withdraw: async (data: WithdrawalRequest): Promise<ApiResponse<TransactionResponse>> => {
    const response = await fetch(`${API_BASE_URL}/accounts/withdrawal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<ApiResponse<TransactionResponse>>(response);
  },

  getTransactions: async (data: GetTransactionsRequest): Promise<TransactionsResponse> => {
    const response = await fetch(`${API_BASE_URL}/accounts/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<TransactionsResponse>(response);
  },
};

export const payeesApi = {
  getAll: async (): Promise<PayeesListResponse> => {
    const response = await fetch(`${API_BASE_URL}/payees`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse<PayeesListResponse>(response);
  },

  getById: async (id: number): Promise<PayeeApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/payees/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse<PayeeApiResponse>(response);
  },

  create: async (data: PayeeRequest): Promise<PayeeApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/payees/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<PayeeApiResponse>(response);
  },

  update: async (id: number, data: PayeeRequest): Promise<PayeeApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/payees?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<PayeeApiResponse>(response);
  },

  delete: async (id: number): Promise<ApiResponse<string>> => {
    const response = await fetch(`${API_BASE_URL}/payees?id=${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse<ApiResponse<string>>(response);
  },
};

export const paymentsApi = {
  pay: async (data: BillPaymentRequest): Promise<PaymentApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/bill-payment/pay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<PaymentApiResponse>(response);
  },
};
