import React from 'react';
import { Building2, CreditCard, Trash2, CheckCircle } from 'lucide-react';

interface PaymentMethodCardProps {
  type: 'bank' | 'card';
  name: string;
  lastFour: string;
  isDefault: boolean;
}

export default function PaymentMethodCard({
  type,
  name,
  lastFour,
  isDefault,
}: PaymentMethodCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          {type === 'bank' ? (
            <Building2 className="h-8 w-8 text-gray-400" />
          ) : (
            <CreditCard className="h-8 w-8 text-gray-400" />
          )}
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">{name}</h3>
            <p className="text-sm text-gray-500">
              {type === 'bank' ? 'Account' : 'Card'} ending in {lastFour}
            </p>
          </div>
        </div>
        {isDefault && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-4 w-4 mr-1" />
            Default
          </span>
        )}
      </div>
      <div className="mt-4 flex justify-end space-x-3">
        <button className="text-sm text-gray-600 hover:text-gray-900">Edit</button>
        {!isDefault && (
          <>
            <button className="text-sm text-gray-600 hover:text-gray-900">
              Set as Default
            </button>
            <button className="text-sm text-red-600 hover:text-red-700">
              <Trash2 className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}