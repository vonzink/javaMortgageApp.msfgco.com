// ===================== Auth Types =====================

export interface User {
  id: number;
  email: string;
  name: string;
  initials: string;
  role: 'borrower' | 'loan_officer' | 'processor' | 'admin';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

// ===================== Address =====================

export interface Address {
  street: string;
  unit?: string;
  city: string;
  state: string;
  zipCode: string;
  county?: string;
}

// ===================== Borrower =====================

export interface Residence {
  address: Address;
  residencyType: 'Own' | 'Rent' | 'Living Rent Free' | '';
  monthlyPayment: number;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
}

export interface Employment {
  employerName: string;
  position: string;
  phone: string;
  address: Address;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  monthlyIncome: number;
  employmentStatus: 'Full-Time' | 'Part-Time' | 'Contract' | 'Seasonal' | 'Self-Employed' | '';
  isSelfEmployed: boolean;
}

export interface IncomeSource {
  type: 'Base Employment' | 'Overtime' | 'Bonus' | 'Commission' | 'Military' | 'Social Security' | 'Pension' | 'Child Support' | 'Alimony' | 'Investment' | 'Rental' | 'Other' | '';
  monthlyAmount: number;
  description?: string;
}

export interface Declaration {
  outstandingJudgments: boolean | null;
  bankruptcyDeclared: boolean | null;
  propertyForeclosed: boolean | null;
  lawsuitParty: boolean | null;
  loanForeclosureOrDefault: boolean | null;
  delinquentOnDebt: boolean | null;
  alimonyObligation: boolean | null;
  downPaymentBorrowed: boolean | null;
  coSignerOnNote: boolean | null;
  usCitizen: boolean | null;
  permanentResident: boolean | null;
  primaryResidence: boolean | null;
  ownershipInterest: boolean | null;
  priorPropertyType: 'Primary Residence' | 'Second Home' | 'Investment Property' | 'FHA Primary Residence' | '' | null;
  priorPropertyTitle: 'Solely By Yourself' | 'Jointly With Your Spouse' | 'Jointly With Another Person' | '' | null;
  newCredit: boolean | null;
  newMortgage: boolean | null;
  priorityLien: boolean | null;
  sellerRelationship: boolean | null;
  undisclosedBorrowing: boolean | null;
  explanations?: string;
}

export interface Borrower {
  id?: number;
  isPrimary: boolean;
  firstName: string;
  lastName: string;
  middleName?: string;
  suffix?: string;
  ssn: string;
  dateOfBirth: string;
  maritalStatus: 'Married' | 'Unmarried' | 'Separated' | '';
  email: string;
  phone: string;
  citizenship: 'US Citizen' | 'Permanent Resident' | 'Non-Permanent Resident' | '';
  numberOfDependents: number;
  dependentAges?: string;
  residences: Residence[];
  employments: Employment[];
  incomeSources: IncomeSource[];
  declarations: Declaration;
}

// ===================== Property =====================

export interface Property {
  address: Address;
  propertyType: 'Single Family' | 'Condo' | 'Townhouse' | 'Multi-Family' | 'Manufactured' | '';
  constructionType: 'Site Built' | 'Manufactured' | '';
  yearBuilt: string;
  numberOfUnits: number;
  occupancyType: 'Primary Residence' | 'Second Home' | 'Investment Property' | '';
}

// ===================== Assets & Liabilities =====================

export interface Asset {
  type: 'Checking' | 'Savings' | 'Money Market' | 'CD' | 'Mutual Fund' | 'Stocks' | 'Bonds' | 'Retirement' | 'Trust' | 'Bridge Loan' | 'Gift' | 'Other' | '';
  institution: string;
  accountNumber: string;
  value: number;
  usedForDownPayment: boolean;
}

export interface Liability {
  creditor: string;
  type: 'Revolving' | 'Installment' | 'Open' | 'Lease' | 'Mortgage' | 'Other' | '';
  accountNumber: string;
  monthlyPayment: number;
  unpaidBalance: number;
  toBePaidOff: boolean;
}

export interface REOProperty {
  address: Address;
  propertyType: 'Single Family' | 'Condo' | 'Townhouse' | 'Multi-Family' | 'Manufactured' | '';
  marketValue: number;
  monthlyRentalIncome: number;
  monthlyMortgagePayment: number;
  unpaidBalance: number;
  status: 'Sold' | 'Pending Sale' | 'Retained' | '';
}

// ===================== Documents =====================

export interface DocumentRecord {
  id: number;
  applicationId: number;
  fileName: string;
  originalName: string;
  fileSize: number;
  mimeType: string;
  documentType: string;
  uploadedAt: string;
  uploadedBy: number;
  downloadUrl?: string;
}

// ===================== Loan Application =====================

export interface LoanApplication {
  id: number;
  userId: number;
  applicationNumber: string;
  status: 'DRAFT' | 'SUBMITTED' | 'PROCESSING' | 'UNDERWRITING' | 'APPROVED' | 'CONDITIONAL' | 'DENIED' | 'WITHDRAWN' | 'CLOSED';
  loanPurpose: 'Purchase' | 'Refinance' | 'Cash-Out Refinance' | '';
  loanType: 'Conventional' | 'FHA' | 'VA' | 'USDA' | '';
  loanAmount: number;
  propertyValue: number;
  interestRate?: number;
  loanTerm?: number;
  property: Property;
  borrowers: Borrower[];
  assets: Asset[];
  liabilities: Liability[];
  reoProperties: REOProperty[];
  documents: DocumentRecord[];
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
}

// ===================== Form Data =====================

export interface LoanApplicationFormData {
  // Loan Information
  loanPurpose: 'Purchase' | 'Refinance' | 'Cash-Out Refinance' | '';
  loanType: 'Conventional' | 'FHA' | 'VA' | 'USDA' | '';
  loanAmount: number;
  propertyValue: number;

  // Property
  property: Property;

  // Borrowers
  borrowers: Borrower[];

  // Assets, Liabilities, REO
  assets: Asset[];
  liabilities: Liability[];
  reoProperties: REOProperty[];
}

// ===================== AI Review =====================

export interface AIReviewIssue {
  field: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
}

export interface AIReviewResult {
  summary: string;
  issues: AIReviewIssue[];
  missingFields: string[];
  recommendedDocuments: string[];
  overallScore: number;
}

// ===================== API Responses =====================

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApplicationStats {
  total: number;
  draft: number;
  submitted: number;
  processing: number;
  approved: number;
  denied: number;
}
