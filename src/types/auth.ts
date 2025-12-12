// Auth DTOs
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  isAdmin: boolean;
  accountNumber?: string; // Required for customers, not for admins
}

export interface LoginResponse {
  credentialId: number;
  username: string;
  userType: 'CUSTOMER' | 'MASTER';
  status: string;
  userId: number | null;
  name: string | null;
  dob: string | null;
  address: string | null;
  contactNo: string | null;
  accountId: number | null;
  accountNo: string | null;
  accountType: string | null;
  balance: number | null;
  token: string;
}

// For backwards compatibility
export type User = LoginResponse;

export interface AuthResponse {
  data: LoginResponse;
  success: boolean;
  message: string;
}

// Update Password DTOs
export interface UpdatePasswordRequest {
  username: string;
  currentPassword: string;
  newPassword: string;
}

export interface UpdatePasswordResponse {
  username: string;
  message: string;
  updatedDate: string;
}

export interface UpdatePasswordApiResponse {
  success: boolean;
  message: string;
  data?: UpdatePasswordResponse;
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
  transferType: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER' | 'LOAN_PAYMENT' | 'LOAN_DISBURSEMENT';
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
  customeraccount: string;
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

// Loan DTOs
export interface LoanRequestDTO {
  accountNumber: string;
  loanType: 'PERSONAL' | 'HOME' | 'AUTO' | 'BUSINESS' | 'EDUCATION';
  principalAmount: number;
  interestRate: number;
  loanTermMonths: number;
  purpose: string;
  collateral?: string;
}

export interface LoanDTO {
  loanId: number;
  loanNo: string;
  loanType: string;
  principalAmount: number;
  interestRate: number;
  loanTermMonths: number;
  monthlyPayment: number;
  remainingBalance: number;
  status: 'PENDING' | 'APPROVED' | 'ACTIVE' | 'CLOSED' | 'REJECTED' | 'DEFAULTED';
  applicationDate: string;
  approvalDate: string | null;
  disbursementDate: string | null;
  maturityDate: string | null;
  nextPaymentDate: string | null;
  purpose: string;
  collateral: string | null;
  userId: number;
  accountId: number;
  userName: string;
  accountNo: string;
  totalPaymentsMade: number;
  latePaymentCount: number;
}

export interface LoanPaymentDTO {
  paymentId: number;
  paymentNo: string;
  loanId: number;
  paymentAmount: number;
  principalAmount: number;
  interestAmount: number;
  remainingBalance: number;
  paymentDate: string;
  paymentStatus: 'COMPLETED' | 'PENDING' | 'FAILED' | 'LATE';
  paymentMethod: string;
  accountNumber: string;
  lateFee: number;
  notes: string | null;
  loanNo: string;
}

export interface LoanPaymentRequest {
  loanId: number;
  paymentAmount: number;
  paymentMethod: string;
  accountNumber: string;
  notes?: string;
}

export interface LoanSummary {
  activeLoanCount: number;
  totalOutstandingBalance: number;
  activeLoans: LoanDTO[];
}

export interface LoanApiResponse {
  data: LoanDTO;
  success: boolean;
  message: string;
}

export interface LoansListResponse {
  data: LoanDTO[];
  success: boolean;
  message: string;
}

export interface LoanPaymentApiResponse {
  data: LoanPaymentDTO;
  success: boolean;
  message: string;
}

export interface LoanPaymentsListResponse {
  data: LoanPaymentDTO[];
  success: boolean;
  message: string;
}

export interface LoanSummaryResponse {
  data: LoanSummary;
  success: boolean;
  message: string;
}

// Loan Payment Summary DTO
export interface LoanPaymentSummaryDTO {
  totalPayments: number;
  paymentCount: number;
}

export interface LoanPaymentSummaryResponse {
  data: LoanPaymentSummaryDTO;
  success: boolean;
  message: string;
}

// Generic API Response
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
}
