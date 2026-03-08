import { UseFormReturn } from 'react-hook-form';
import type { LoanApplicationFormData } from '@/types';
import AddressField from '@/components/form-fields/AddressField';
import FormSection from '@/components/shared/FormSection';
import { Home } from 'lucide-react';

interface PropertyDetailsStepProps {
  form: UseFormReturn<LoanApplicationFormData>;
}

export default function PropertyDetailsStep({ form }: PropertyDetailsStepProps) {
  const { watch, setValue } = form;
  const property = watch('property');

  return (
    <div>
      <FormSection
        title="Property Details"
        description="Provide information about the property for this loan."
        icon={Home}
      >
        {/* Address */}
        <AddressField
          value={property.address}
          onChange={(addr) => setValue('property', { ...property, address: addr })}
          prefix="Property"
          showCounty
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {/* Property Type */}
          <div>
            <label className="label">
              Property Type <span className="text-red-500">*</span>
            </label>
            <select
              value={property.propertyType}
              onChange={(e) => setValue('property', { ...property, propertyType: e.target.value as any })}
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

          {/* Construction Type */}
          <div>
            <label className="label">Construction Type</label>
            <select
              value={property.constructionType}
              onChange={(e) =>
                setValue('property', { ...property, constructionType: e.target.value as any })
              }
              className="select-field"
            >
              <option value="">Select...</option>
              <option value="Site Built">Site Built</option>
              <option value="Manufactured">Manufactured</option>
            </select>
          </div>

          {/* Year Built */}
          <div>
            <label className="label">Year Built</label>
            <input
              type="text"
              value={property.yearBuilt}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                setValue('property', { ...property, yearBuilt: val });
              }}
              className="input-field"
              placeholder="e.g., 2005"
              maxLength={4}
            />
          </div>

          {/* Number of Units */}
          <div>
            <label className="label">Number of Units</label>
            <select
              value={property.numberOfUnits}
              onChange={(e) =>
                setValue('property', { ...property, numberOfUnits: parseInt(e.target.value) || 1 })
              }
              className="select-field"
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
            </select>
          </div>

          {/* Occupancy Type */}
          <div>
            <label className="label">Occupancy Type</label>
            <select
              value={property.occupancyType}
              onChange={(e) =>
                setValue('property', { ...property, occupancyType: e.target.value as any })
              }
              className="select-field"
            >
              <option value="">Select...</option>
              <option value="Primary Residence">Primary Residence</option>
              <option value="Second Home">Second Home</option>
              <option value="Investment Property">Investment Property</option>
            </select>
          </div>
        </div>
      </FormSection>
    </div>
  );
}
