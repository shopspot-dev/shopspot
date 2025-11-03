import React, { useState, useEffect } from 'react';
import { UserPlus } from 'lucide-react';
import { StoreUser } from '../types/users';
import UserList from '../components/users/UserList';
import UserForm from '../components/users/UserForm';
import { useAuth } from '../contexts/AuthContext';
import { users } from '../lib/supabase';

export default function Users() {
  const { currentStore } = useAuth(); // ✅ Use currentStore
  const [usersList, setUsersList] = useState<StoreUser[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<StoreUser | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentStore?.id) {
      loadUsers();
    } else {
      setLoading(false);
    }
  }, [currentStore?.id]); // ✅ Reload when store changes

  const loadUsers = async () => {
    if (!currentStore?.id) return;
    
    try {
      setLoading(true);
      setError('');
      
      const data = await users.getAll(currentStore.id); // ✅ Use helper
      // Transform data to match StoreUser interface
      const transformed = data.map(u => ({
        id: u.id,
        name: u.name || '',
        email: u.email || '',
        role: u.role || 'staff',
        createdAt: u.created_at || '',
        lastLogin: u.last_login || '',
        status: u.status || 'active',
      }));
      setUsersList(transformed);
    } catch (err) {
      console.error('Error loading users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (userData: Partial<StoreUser>) => {
    if (!currentStore?.id) {
      setError('No store selected');
      return;
    }
    
    try {
      await users.create({
        name: userData.name!,
        email: userData.email!,
        role: userData.role!,
        store_id: currentStore.id,
        status: 'active',
      });
      
      await loadUsers();
      setShowForm(false);
    } catch (err) {
      setError('Failed to add user');
    }
  };

  const handleEditUser = (user: StoreUser) => {
    setSelectedUser(user);
    setShowForm(true);
  };

  const handleDeactivateUser = (userId: string) => {
    setUsersList(usersList.map(user =>
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
          users={usersList}
          onEditUser={handleEditUser}
          onDeactivateUser={handleDeactivateUser}
        />
      )}
    </div>
  );
}