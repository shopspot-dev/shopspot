import React from 'react';
import { Calendar, Clock } from 'lucide-react';

export default function PayoutSchedule() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Payout Schedule</h2>
      <div className="flex items-start space-x-4">
        <div className="flex-1">
          <div className="flex items-center mb-4">
            <Calendar className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-sm font-medium text-gray-900">Weekly payouts</span>
          </div>
          <p className="text-sm text-gray-600">
            Your earnings are automatically paid out every Monday for the previous week's
            orders (Monday-Sunday).
          </p>
        </div>
        <div className="flex-1">
          <div className="flex items-center mb-4">
            <Clock className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-sm font-medium text-gray-900">Processing time</span>
          </div>
          <p className="text-sm text-gray-600">
            Payouts typically take 1-2 business days to appear in your bank account
            after being initiated.
          </p>
        </div>
      </div>
      <div className="mt-6">
        <button className="text-sm text-indigo-600 hover:text-indigo-500">
          Change payout schedule
        </button>
      </div>
    </div>
  );
}