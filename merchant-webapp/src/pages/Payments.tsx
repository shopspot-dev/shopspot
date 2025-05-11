import React from 'react';
import { CreditCard, DollarSign, Building2, FileText } from 'lucide-react';
import PaymentMethodCard from '../components/payments/PaymentMethodCard';
import EarningsSummary from '../components/payments/EarningsSummary';
import TransactionList from '../components/payments/TransactionList';
import PayoutSchedule from '../components/payments/PayoutSchedule';

export default function Payments() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Payments & Earnings</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage your payment methods, view earnings, and track transactions
        </p>
      </div>

      {/* Payment Methods Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Payment Methods</h2>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
            <Building2 className="h-4 w-4 mr-2" />
            Add Bank Account
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PaymentMethodCard
            type="bank"
            name="Business Checking"
            lastFour="4567"
            isDefault={true}
          />
          <PaymentMethodCard
            type="card"
            name="Business Credit Card"
            lastFour="8901"
            isDefault={false}
          />
        </div>
      </div>

      {/* Earnings Summary */}
      <EarningsSummary />

      {/* Recent Transactions */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Recent Transactions</h2>
          <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-500">
            <FileText className="h-4 w-4 mr-2" />
            Download Statement
          </button>
        </div>
        <TransactionList />
      </div>

      {/* Payout Schedule */}
      <div className="mt-8">
        <PayoutSchedule />
      </div>
    </div>
  );
}