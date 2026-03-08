import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import type { LoanApplicationFormData, Asset, Liability, REOProperty } from '@/types';
import {
  createDefaultAsset,
  createDefaultLiability,
  createDefaultREOProperty,
} from '@/utils/fieldArrayHelpers';
import CurrencyInput from '@/components/form-fields/CurrencyInput';
import AddressField from '@/components/form-fields/AddressField';
import FormSection from '@/components/shared/FormSection';
import { Wallet, CreditCard, Building2, Plus, Trash2 } from 'lucide-react';

interface AssetsLiabilitiesStepProps {
  form: UseFormReturn<LoanApplicationFormData>;
}

type TabType = 'assets' | 'liabilities' | 'reo';

export default function AssetsLiabilitiesStep({ form }: AssetsLiabilitiesStepProps) {
  const { watch, setValue } = form;
  const assets = watch('assets');
  const liabilities = watch('liabilities');
  const reoProperties = watch('reoProperties');
  const [activeTab, setActiveTab] = useState<TabType>('assets');

  // ---- Asset helpers ----
  const updateAsset = (index: number, field: keyof Asset, value: any) => {
    const updated = [...assets];
    (updated[index] as any)[field] = value;
    setValue('assets', updated);
  };

  const addAsset = () => setValue('assets', [...assets, createDefaultAsset()]);

  const removeAsset = (index: number) =>
    setValue('assets', assets.filter((_, i) => i !== index));

  // ---- Liability helpers ----
  const updateLiability = (index: number, field: keyof Liability, value: any) => {
    const updated = [...liabilities];
    (updated[index] as any)[field] = value;
    setValue('liabilities', updated);
  };

  const addLiability = () => setValue('liabilities', [...liabilities, createDefaultLiability()]);

  const removeLiability = (index: number) =>
    setValue('liabilities', liabilities.filter((_, i) => i !== index));

  // ---- REO helpers ----
  const updateREO = (index: number, field: keyof REOProperty, value: any) => {
    const updated = [...reoProperties];
    (updated[index] as any)[field] = value;
    setValue('reoProperties', updated);
  };

  const addREO = () => setValue('reoProperties', [...reoProperties, createDefaultREOProperty()]);

  const removeREO = (index: number) =>
    setValue('reoProperties', reoProperties.filter((_, i) => i !== index));

  const tabs = [
    { key: 'assets' as TabType, label: 'Assets', icon: Wallet, count: assets.length },
    { key: 'liabilities' as TabType, label: 'Liabilities', icon: CreditCard, count: liabilities.length },
    { key: 'reo' as TabType, label: 'REO Properties', icon: Building2, count: reoProperties.length },
  ];

  return (
    <div>
      {/* Tab bar */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-brand-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.count > 0 && (
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.key ? 'bg-brand-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ===== ASSETS ===== */}
      {activeTab === 'assets' && (
        <FormSection
          title="Assets"
          description="List your bank accounts, investments, and other assets."
          icon={Wallet}
        >
          {assets.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              No assets added yet. Click below to add an asset.
            </p>
          ) : (
            assets.map((asset, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-700">Asset {idx + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeAsset(idx)}
                    className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="label">Asset Type</label>
                    <select
                      value={asset.type}
                      onChange={(e) => updateAsset(idx, 'type', e.target.value)}
                      className="select-field"
                    >
                      <option value="">Select type...</option>
                      <option value="Checking">Checking</option>
                      <option value="Savings">Savings</option>
                      <option value="Money Market">Money Market</option>
                      <option value="CD">CD</option>
                      <option value="Mutual Fund">Mutual Fund</option>
                      <option value="Stocks">Stocks</option>
                      <option value="Bonds">Bonds</option>
                      <option value="Retirement">Retirement (401k/IRA)</option>
                      <option value="Trust">Trust</option>
                      <option value="Bridge Loan">Bridge Loan Proceeds</option>
                      <option value="Gift">Gift</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Bank / Institution</label>
                    <input
                      type="text"
                      value={asset.institution}
                      onChange={(e) => updateAsset(idx, 'institution', e.target.value)}
                      className="input-field"
                      placeholder="Institution name"
                    />
                  </div>
                  <div>
                    <label className="label">Account Number</label>
                    <input
                      type="text"
                      value={asset.accountNumber}
                      onChange={(e) => updateAsset(idx, 'accountNumber', e.target.value)}
                      className="input-field"
                      placeholder="Account number"
                    />
                  </div>
                  <CurrencyInput
                    label="Value"
                    value={asset.value}
                    onChange={(val) => updateAsset(idx, 'value', val)}
                    placeholder="0.00"
                  />
                </div>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={asset.usedForDownPayment}
                    onChange={(e) => updateAsset(idx, 'usedForDownPayment', e.target.checked)}
                    className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-sm text-gray-700">Will be used for down payment</span>
                </label>
              </div>
            ))
          )}

          <button
            type="button"
            onClick={addAsset}
            className="btn-secondary flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Asset
          </button>
        </FormSection>
      )}

      {/* ===== LIABILITIES ===== */}
      {activeTab === 'liabilities' && (
        <FormSection
          title="Liabilities"
          description="List your debts including credit cards, loans, and other obligations."
          icon={CreditCard}
        >
          {liabilities.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              No liabilities added yet. Click below to add a liability.
            </p>
          ) : (
            liabilities.map((liability, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-700">Liability {idx + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeLiability(idx)}
                    className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="label">Creditor Name</label>
                    <input
                      type="text"
                      value={liability.creditor}
                      onChange={(e) => updateLiability(idx, 'creditor', e.target.value)}
                      className="input-field"
                      placeholder="Creditor name"
                    />
                  </div>
                  <div>
                    <label className="label">Liability Type</label>
                    <select
                      value={liability.type}
                      onChange={(e) => updateLiability(idx, 'type', e.target.value)}
                      className="select-field"
                    >
                      <option value="">Select type...</option>
                      <option value="Revolving">Revolving (Credit Card)</option>
                      <option value="Installment">Installment (Auto Loan, etc.)</option>
                      <option value="Open">Open (30-day charge)</option>
                      <option value="Lease">Lease</option>
                      <option value="Mortgage">Mortgage</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Account Number</label>
                    <input
                      type="text"
                      value={liability.accountNumber}
                      onChange={(e) => updateLiability(idx, 'accountNumber', e.target.value)}
                      className="input-field"
                      placeholder="Account number"
                    />
                  </div>
                  <CurrencyInput
                    label="Monthly Payment"
                    value={liability.monthlyPayment}
                    onChange={(val) => updateLiability(idx, 'monthlyPayment', val)}
                    placeholder="0.00"
                  />
                  <CurrencyInput
                    label="Unpaid Balance"
                    value={liability.unpaidBalance}
                    onChange={(val) => updateLiability(idx, 'unpaidBalance', val)}
                    placeholder="0.00"
                  />
                </div>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={liability.toBePaidOff}
                    onChange={(e) => updateLiability(idx, 'toBePaidOff', e.target.checked)}
                    className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-sm text-gray-700">To be paid off at or before closing</span>
                </label>
              </div>
            ))
          )}

          <button
            type="button"
            onClick={addLiability}
            className="btn-secondary flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Liability
          </button>
        </FormSection>
      )}

      {/* ===== REO PROPERTIES ===== */}
      {activeTab === 'reo' && (
        <FormSection
          title="Real Estate Owned (REO)"
          description="List any other properties you currently own."
          icon={Building2}
        >
          {reoProperties.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              No real estate properties listed. Click below to add a property.
            </p>
          ) : (
            reoProperties.map((reo, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-700">Property {idx + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeREO(idx)}
                    className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove
                  </button>
                </div>

                <AddressField
                  value={reo.address}
                  onChange={(addr) => {
                    const updated = [...reoProperties];
                    updated[idx].address = addr;
                    setValue('reoProperties', updated);
                  }}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="label">Property Type</label>
                    <select
                      value={reo.propertyType}
                      onChange={(e) => updateREO(idx, 'propertyType', e.target.value)}
                      className="select-field"
                    >
                      <option value="">Select type...</option>
                      <option value="Single Family">Single Family</option>
                      <option value="Condo">Condo</option>
                      <option value="Townhouse">Townhouse</option>
                      <option value="Multi-Family">Multi-Family</option>
                      <option value="Manufactured">Manufactured</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Status</label>
                    <select
                      value={reo.status}
                      onChange={(e) => updateREO(idx, 'status', e.target.value)}
                      className="select-field"
                    >
                      <option value="">Select...</option>
                      <option value="Retained">Retained</option>
                      <option value="Sold">Sold</option>
                      <option value="Pending Sale">Pending Sale</option>
                    </select>
                  </div>
                  <CurrencyInput
                    label="Market Value"
                    value={reo.marketValue}
                    onChange={(val) => updateREO(idx, 'marketValue', val)}
                  />
                  <CurrencyInput
                    label="Monthly Rental Income"
                    value={reo.monthlyRentalIncome}
                    onChange={(val) => updateREO(idx, 'monthlyRentalIncome', val)}
                  />
                  <CurrencyInput
                    label="Monthly Mortgage Payment"
                    value={reo.monthlyMortgagePayment}
                    onChange={(val) => updateREO(idx, 'monthlyMortgagePayment', val)}
                  />
                  <CurrencyInput
                    label="Unpaid Balance"
                    value={reo.unpaidBalance}
                    onChange={(val) => updateREO(idx, 'unpaidBalance', val)}
                  />
                </div>
              </div>
            ))
          )}

          <button
            type="button"
            onClick={addREO}
            className="btn-secondary flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add REO Property
          </button>
        </FormSection>
      )}
    </div>
  );
}
