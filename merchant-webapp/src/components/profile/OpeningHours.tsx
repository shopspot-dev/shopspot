import React from 'react';
import { StoreProfile } from '../../types';

interface OpeningHoursProps {
  openingHours: StoreProfile['openingHours'];
  isEditing: boolean;
  onUpdate: (day: string, hours: typeof INITIAL_PROFILE.openingHours[string]) => void;
}

export default function OpeningHours({ openingHours, isEditing, onUpdate }: OpeningHoursProps) {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Opening Hours</h3>
      <div className="space-y-4">
        {Object.entries(openingHours).map(([day, hours]) => (
          <div key={day} className="flex items-center space-x-4">
            <span className="w-32 text-sm font-medium text-gray-700 capitalize">
              {day}
            </span>
            {!hours.isClosed ? (
              <div className="flex items-center space-x-2">
                <input
                  type="time"
                  value={hours.open}
                  onChange={(e) =>
                    onUpdate(day, { ...hours, open: e.target.value })
                  }
                  disabled={!isEditing}
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <span>to</span>
                <input
                  type="time"
                  value={hours.close}
                  onChange={(e) =>
                    onUpdate(day, { ...hours, close: e.target.value })
                  }
                  disabled={!isEditing}
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            ) : (
              <span className="text-sm text-gray-500">Closed</span>
            )}
            {isEditing && (
              <button
                type="button"
                onClick={() =>
                  onUpdate(day, { ...hours, isClosed: !hours.isClosed })
                }
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                {hours.isClosed ? 'Set Hours' : 'Mark as Closed'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}