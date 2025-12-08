// Auth DTOs
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  name: string;
  contactNo: string;
  accountNumber: string;
}

export interface LoginResponse {
  credentialId: number;
  username: string;
  userType: 'CUSTOMER' | 'MASTER';
  status: string;
  userId: number;
  name: string;
  dob: string;
  address: string;
  contactNo: string;
  accountId: number;
  accountNo: string;
  accountType: string;
  balance: number;
}

// For backwards compatibility
export type User = LoginResponse;

export interface AuthResponse {
  data: LoginResponse;
  success: boolean;
  message: string;
}

// Account DTOs
export interface CreateAccountRequest {
  name: string;
  dob: string;
  address: string;
  contactNo: string;
  ssn: string;
  createdBy: string;
  accountType: 'SAVINGS' | 'CHECKING' | 'BUSINESS';
  initialBalance: number;
  accountCreatedBy: number;
  interestRate?: number;
  overdraftLimit?: number;
}

export interface AccountResponse {
  userId: number;
  name: string;
  dob: string;
  address: string;
  contactNo: string;
  ssn: string;
  createdBy: string;
  accountId: number;
  accountNo: string;
  accountType: string;
  balance: number;
  status: string;
  openedDate: string;
  interestRate: number;
  overdraftLimit: number;
}

export interface DepositRequest {
  accountNo: string;
  name: string;
  contactNo: string;
  amount: number;
}

export interface WithdrawalRequest {
  accountNo: string;
  name: string;
  contactNo: string;
  amount: number;
}

export interface TransactionResponse {
  transactionNo: string;
  accountNo: string;
  transactionType: string;
  amount: number;
  previousBalance: number;
  newBalance: number;
  transactionDate: string;
  message: string;
}

export interface GetTransactionsRequest {
  accountNo: string;
  name?: string;
  contactNo?: string;
  isMasterUser?: boolean;
}

export interface TransactionHistoryDTO {
  tranId: number;
  tranNo: string;
  tranDatetime: string;
  transferType: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';
  amount: number;
  debit: string | null;
  credit: string | null;
  description: string;
  transferAccId: number | null;
  receivedAccId: number | null;
}

// For backwards compatibility
export type Transaction = TransactionHistoryDTO;

export interface TransactionsResponse {
  data: TransactionHistoryDTO[];
  success: boolean;
  count: number;
  message: string;
}

// Payee DTOs
export interface PayeeRequest {
  name: string;
  nickname?: string;
  email?: string;
  phone?: string;
  accountNo: string;
  userId: number;
}

// For backwards compatibility
export type CreatePayeeRequest = PayeeRequest;

export interface PayeeResponse {
  payeeId: number;
  name: string;
  nickname: string;
  email: string;
  phone: string;
  accountNo: string;
  status: string;
  userId: number;
  accountId: number;
}

export type Payee = PayeeResponse;

export interface PayeeApiResponse {
  data: PayeeResponse;
  success: boolean;
  message: string;
}

export interface PayeesListResponse {
  data: PayeeResponse[];
  success: boolean;
  message: string;
}

// Bill Payment DTOs
export interface BillPaymentRequest {
  customer_account: string;
  payeeAccount: string;
  payment_type: 'ONCE' | 'RECURRING';
  amount: number;
  description: string;
}

// For backwards compatibility
export type PaymentRequest = BillPaymentRequest;

export interface BillPaymentResponse {
  bill_payment_no: string;
  amount: number;
  tran_no: string;
}

export interface PaymentApiResponse {
  data: BillPaymentResponse;
  success: boolean;
  message: string;
}

// For backwards compatibility
export type PaymentResponse = PaymentApiResponse;

// Generic API Response
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
}
