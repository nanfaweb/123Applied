import React from 'react';
import { useUserApplications, Application } from '@/hooks/useUserApplications';

export default function ApplicationTracker() {
  const { applications, loading } = useUserApplications();

  if (loading) return <div>Loading...</div>;
  if (!applications.length) return <div>No applications found.</div>;

  return (
    <table className="min-w-full border">
      <thead>
        <tr>
          <th>Company</th>
          <th>Role / Title</th>
          <th>Date Applied</th>
          <th>Status</th>
          <th>Salary</th>
        </tr>
      </thead>
      <tbody>
        {applications.map((app: Application) => (
          <tr key={app.id}>
            <td>{app.company}</td>
            <td>{app.role_title}</td>
            <td>{app.date_applied}</td>
            <td>{app.status}</td>
            <td>{app.salary}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
} 