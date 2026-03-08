import type { Address } from '@/types';
import { US_STATES } from '@/utils/states';

interface AddressFieldProps {
  value: Address;
  onChange: (address: Address) => void;
  prefix?: string;
  showCounty?: boolean;
  required?: boolean;
}

export default function AddressField({
  value,
  onChange,
  prefix = '',
  showCounty = false,
  required = false,
}: AddressFieldProps) {
  const update = (field: keyof Address, val: string) => {
    onChange({ ...value, [field]: val });
  };

  const labelPrefix = prefix ? `${prefix} ` : '';

  return (
    <div className="space-y-3">
      {/* Street Address */}
      <div>
        <label className="label">
          {labelPrefix}Street Address
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
          type="text"
          value={value.street}
          onChange={(e) => update('street', e.target.value)}
          placeholder="123 Main Street"
          className="input-field"
        />
      </div>

      {/* Unit/Apt */}
      <div>
        <label className="label">{labelPrefix}Unit / Apt #</label>
        <input
          type="text"
          value={value.unit || ''}
          onChange={(e) => update('unit', e.target.value)}
          placeholder="Apt 4B"
          className="input-field"
        />
      </div>

      {/* City, State, ZIP */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="label">
            City
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type="text"
            value={value.city}
            onChange={(e) => update('city', e.target.value)}
            placeholder="City"
            className="input-field"
          />
        </div>
        <div>
          <label className="label">
            State
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <select
            value={value.state}
            onChange={(e) => update('state', e.target.value)}
            className="select-field"
          >
            <option value="">Select State</option>
            {US_STATES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">
            ZIP Code
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type="text"
            value={value.zipCode}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9-]/g, '').slice(0, 10);
              update('zipCode', val);
            }}
            placeholder="12345"
            className="input-field"
            maxLength={10}
          />
        </div>
      </div>

      {/* County */}
      {showCounty && (
        <div>
          <label className="label">{labelPrefix}County</label>
          <input
            type="text"
            value={value.county || ''}
            onChange={(e) => update('county', e.target.value)}
            placeholder="County"
            className="input-field"
          />
        </div>
      )}
    </div>
  );
}
