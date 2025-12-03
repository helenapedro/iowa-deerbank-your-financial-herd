export interface User {
  credentialId: number;
  username: string;
  userType: 'CUSTOMER' | 'ADMIN';
  status: 'ACTIVE' | 'INACTIVE';
  userId: number;
  name: string;
  dob: string;
  address: string;
  contactNo: string;
  accountId: number;
  accountNo: string;
  accountType: 'SAVINGS' | 'CHECKING';
  balance: number;
}

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

export interface AuthResponse {
  data: User;
  success: boolean;
  message: string;
}

export interface Transaction {
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

export interface TransactionsResponse {
  data: Transaction[];
  success: boolean;
  count: number;
  message: string;
}

export interface Payee {
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

export interface CreatePayeeRequest {
  name: string;
  nickname: string;
  email: string;
  phone: string;
  accountNo: string;
  userId: number;
}

export interface PayeeResponse {
  data: Payee;
  success: boolean;
  message: string;
}

export interface PaymentRequest {
  customer_account: string;
  payeeAccount: string;
  payment_type: 'ONCE' | 'RECURRING';
  amount: number;
  description: string;
}

export interface PaymentResponse {
  data: {
    bill_payment_no: string;
    amount: number;
    tran_no: string;
  };
  success: boolean;
  message: string;
}
