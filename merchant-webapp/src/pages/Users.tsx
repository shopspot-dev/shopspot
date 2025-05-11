import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { StoreUser } from '../types/users';
import UserList from '../components/users/UserList';
import UserForm from '../components/users/UserForm';

const SAMPLE_USERS: StoreUser[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
    lastLogin: '2024-03-10T15:30:00Z',
    status: 'active',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    role: 'staff',
    createdAt: '2024-02-01T00:00:00Z',
    lastLogin: '2024-03-09T10:15:00Z',
    status: 'active',
  },
];

export default function Users() {
  const [users, setUsers] = useState<StoreUser[]>(SAMPLE_USERS);
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<StoreUser | undefined>();

  const handleAddUser = (userData: Partial<StoreUser>) => {
    const newUser: StoreUser = {
      id: Date.now().toString(),
      name: userData.name!,
      email: userData.email!,
      role: userData.role!,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      status: 'active',
    };
    setUsers([...users, newUser]);
    setShowForm(false);
  };

  const handleEditUser = (user: StoreUser) => {
    setSelectedUser(user);
    setShowForm(true);
  };

  const handleDeactivateUser = (userId: string) => {
    setUsers(users.map(user =>
      user.id === userId
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Users & Permissions</h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage store employees and their access levels
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedUser(undefined);
              setShowForm(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <UserPlus className="h-5 w-5 mr-2" />
            Add User
          </button>
        </div>
      </div>

      {showForm ? (
        <div className="mb-6">
          <UserForm
            user={selectedUser}
            onSubmit={handleAddUser}
            onCancel={() => setShowForm(false)}
          />
        </div>
      ) : (
        <UserList
          users={users}
          onEditUser={handleEditUser}
          onDeactivateUser={handleDeactivateUser}
        />
      )}
    </div>
  );
}