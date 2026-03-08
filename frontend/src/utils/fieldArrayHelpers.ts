import type {
  Borrower,
  Employment,
  Asset,
  Liability,
  Residence,
  REOProperty,
  Declaration,
  IncomeSource,
  Address,
} from '@/types';

export function createDefaultAddress(): Address {
  return {
    street: '',
    unit: '',
    city: '',
    state: '',
    zipCode: '',
    county: '',
  };
}

export function createDefaultDeclaration(): Declaration {
  return {
    outstandingJudgments: null,
    bankruptcyDeclared: null,
    propertyForeclosed: null,
    lawsuitParty: null,
    loanForeclosureOrDefault: null,
    delinquentOnDebt: null,
    alimonyObligation: null,
    downPaymentBorrowed: null,
    coSignerOnNote: null,
    usCitizen: null,
    permanentResident: null,
    primaryResidence: null,
    ownershipInterest: null,
    priorPropertyType: null,
    priorPropertyTitle: null,
    newCredit: null,
    newMortgage: null,
    priorityLien: null,
    sellerRelationship: null,
    undisclosedBorrowing: null,
    explanations: '',
  };
}

export function createDefaultResidence(): Residence {
  return {
    address: createDefaultAddress(),
    residencyType: '',
    monthlyPayment: 0,
    startDate: '',
    endDate: '',
    isCurrent: true,
  };
}

export function createDefaultEmployment(): Employment {
  return {
    employerName: '',
    position: '',
    phone: '',
    address: createDefaultAddress(),
    startDate: '',
    endDate: '',
    isCurrent: true,
    monthlyIncome: 0,
    employmentStatus: '',
    isSelfEmployed: false,
  };
}

export function createDefaultIncomeSource(): IncomeSource {
  return {
    type: '',
    monthlyAmount: 0,
    description: '',
  };
}

export function createDefaultBorrower(isPrimary: boolean = false): Borrower {
  return {
    isPrimary,
    firstName: '',
    lastName: '',
    middleName: '',
    suffix: '',
    ssn: '',
    dateOfBirth: '',
    maritalStatus: '',
    email: '',
    phone: '',
    citizenship: '',
    numberOfDependents: 0,
    dependentAges: '',
    residences: [createDefaultResidence()],
    employments: [createDefaultEmployment()],
    incomeSources: [],
    declarations: createDefaultDeclaration(),
  };
}

export function createDefaultAsset(): Asset {
  return {
    type: '',
    institution: '',
    accountNumber: '',
    value: 0,
    usedForDownPayment: false,
  };
}

export function createDefaultLiability(): Liability {
  return {
    creditor: '',
    type: '',
    accountNumber: '',
    monthlyPayment: 0,
    unpaidBalance: 0,
    toBePaidOff: false,
  };
}

export function createDefaultREOProperty(): REOProperty {
  return {
    address: createDefaultAddress(),
    propertyType: '',
    marketValue: 0,
    monthlyRentalIncome: 0,
    monthlyMortgagePayment: 0,
    unpaidBalance: 0,
    status: '',
  };
}
