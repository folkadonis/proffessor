import React, { useState, useEffect } from 'react';
import api from '../services/api';

interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

const PendingUsers: React.FC = () => {
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/pending-users');
      setPendingUsers(response.data);
    } catch (error) {
      console.error('Error fetching pending users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    try {
      await api.put(`/admin/approve-user/${userId}`);
      setPendingUsers(pendingUsers.filter(user => user._id !== userId));
      alert('User approved successfully');
    } catch (error) {
      console.error('Error approving user:', error);
      alert('Error approving user');
    }
  };

  const handleReject = async (userId: string) => {
    if (!window.confirm('Are you sure you want to reject this user?')) return;

    try {
      await api.delete(`/admin/reject-user/${userId}`);
      setPendingUsers(pendingUsers.filter(user => user._id !== userId));
      alert('User rejected successfully');
    } catch (error) {
      console.error('Error rejecting user:', error);
      alert('Error rejecting user');
    }
  };

  if (loading) {
    return <div className="loading">Loading pending users...</div>;
  }

  return (
    <div className="pending-users-page">
      <h1>Pending User Approvals</h1>

      {pendingUsers.length === 0 ? (
        <div className="no-data">
          <p>No pending user approvals</p>
        </div>
      ) : (
        <div className="users-list">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Registration Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      onClick={() => handleApprove(user._id)}
                      className="approve-btn"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(user._id)}
                      className="reject-btn"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PendingUsers;