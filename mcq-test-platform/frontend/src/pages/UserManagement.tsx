import React, { useState, useEffect } from 'react';
import api from '../services/api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isApproved: boolean;
  isActive: boolean;
  createdAt: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/all-users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId: string) => {
    try {
      const response = await api.put(`/admin/toggle-user-status/${userId}`);
      if (response.data.user) {
        setUsers(users.map(user =>
          user._id === userId
            ? { ...user, isActive: response.data.user.isActive }
            : user
        ));
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error toggling user status:', error);
      alert('Error updating user status');
    }
  };

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div className="user-management-page">
      <h1>User Management</h1>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Approved</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${user.isApproved ? 'approved' : 'pending'}`}>
                    {user.isApproved ? 'Approved' : 'Pending'}
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={() => toggleUserStatus(user._id)}
                    className={user.isActive ? 'deactivate-btn' : 'activate-btn'}
                  >
                    {user.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="no-data">
            <p>No users found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;