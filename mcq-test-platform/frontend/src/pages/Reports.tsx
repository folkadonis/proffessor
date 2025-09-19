import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

interface Report {
  userName?: string;
  userEmail?: string;
  testTitle: string;
  testDescription?: string;
  score: number;
  totalQuestions: number;
  percentage: string;
  isPassed: boolean;
  timeTaken: number;
  completedAt: string;
  attemptId?: string;
}

const Reports: React.FC = () => {
  const { isAdmin } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const endpoint = isAdmin()
        ? '/reports/admin/all-reports'
        : '/reports/user/my-reports';
      const response = await api.get(endpoint);
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = async () => {
    try {
      setExportLoading(true);
      const type = isAdmin() ? 'admin' : 'user';
      const response = await api.get(`/reports/export/${type}`);

      // Convert JSON to CSV
      const data = response.data;
      if (data.length === 0) {
        alert('No data to export');
        return;
      }

      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map((row: any) =>
          headers.map(header =>
            typeof row[header] === 'string' && row[header].includes(',')
              ? `"${row[header]}"`
              : row[header]
          ).join(',')
        )
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `test_reports_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting reports:', error);
      alert('Error exporting reports');
    } finally {
      setExportLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading reports...</div>;
  }

  return (
    <div className="reports-page">
      <div className="page-header">
        <h1>{isAdmin() ? 'All User Reports' : 'My Test Reports'}</h1>
        <button
          onClick={exportToExcel}
          disabled={exportLoading || reports.length === 0}
          className="export-btn primary-btn"
        >
          {exportLoading ? 'Exporting...' : 'Export to Excel'}
        </button>
      </div>

      <div className="reports-table-container">
        <table className="reports-table">
          <thead>
            <tr>
              {isAdmin() && (
                <>
                  <th>User Name</th>
                  <th>Email</th>
                </>
              )}
              <th>Test</th>
              <th>Score</th>
              <th>Percentage</th>
              <th>Status</th>
              <th>Time (min)</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report, index) => (
              <tr key={index}>
                {isAdmin() && (
                  <>
                    <td>{report.userName}</td>
                    <td>{report.userEmail}</td>
                  </>
                )}
                <td>{report.testTitle}</td>
                <td>{report.score}/{report.totalQuestions}</td>
                <td>{report.percentage}%</td>
                <td>
                  <span className={`status-badge ${report.isPassed ? 'passed' : 'failed'}`}>
                    {report.isPassed ? 'Passed' : 'Failed'}
                  </span>
                </td>
                <td>{report.timeTaken}</td>
                <td>{new Date(report.completedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {reports.length === 0 && (
          <div className="no-data">
            <p>No test reports available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;