import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const transactions = [
  {
    id: '1',
    type: 'payout',
    amount: -1234.56,
    date: '2024-03-10',
    status: 'completed',
    description: 'Weekly payout',
  },
  {
    id: '2',
    type: 'earning',
    amount: 45.99,
    date: '2024-03-09',
    status: 'completed',
    description: 'Order #1234',
  },
  {
    id: '3',
    type: 'earning',
    amount: 32.50,
    date: '2024-03-09',
    status: 'completed',
    description: 'Order #1235',
  },
  {
    id: '4',
    type: 'fee',
    amount: -2.99,
    date: '2024-03-09',
    status: 'completed',
    description: 'Platform fee',
  },
];

export default function TransactionList() {
  return (
    <div className="bg-white shadow-sm rounded-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transaction
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {transaction.type === 'payout' ? (
                      <ArrowUpRight className="h-5 w-5 text-red-500 mr-2" />
                    ) : transaction.type === 'earning' ? (
                      <ArrowDownRight className="h-5 w-5 text-green-500 mr-2" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5 text-gray-500 mr-2" />
                    )}
                    <div className="text-sm font-medium text-gray-900">
                      {transaction.description}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium ${
                    transaction.amount < 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {transaction.amount < 0 ? '-' : '+'}$
                    {Math.abs(transaction.amount).toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(transaction.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}