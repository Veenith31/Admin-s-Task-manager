/*import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { agentsAPI, tasksAPI } from '../utils/api';
import { toast } from 'react-toastify';

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({
    totalAgents: 0,
    totalTasks: 0,
    pendingTasks: 0,
    completedTasks: 0
  });
  const [loading, setLoading] = useState(true);
  
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [mounted, authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (mounted && isAuthenticated) {
      fetchStats();
    }
  }, [mounted, isAuthenticated]);

  const fetchStats = async () => {
    try {
      const [agentsResponse, tasksResponse] = await Promise.all([
        agentsAPI.getAll(),
        tasksAPI.getAll()
      ]);

      const tasks = tasksResponse.data.data;
      const agents = agentsResponse.data.data;

      setStats({
        totalAgents: agents.length,
        totalTasks: tasks.length,
        pendingTasks: tasks.filter(task => task.status === 'pending').length,
        completedTasks: tasks.filter(task => task.status === 'completed').length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || authLoading) {
    return (
      <div className="text-center mt-4">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Dashboard | Task Distribution System</title>
      </Head>

      <div>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Dashboard</h1>
          <p>Welcome back, {user?.name}!</p>
        </div>

        {/* Stats Cards *//*}
        <div className="row mb-4">
          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-left-primary shadow h-100 py-2">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                      Total Agents
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                      {loading ? '...' : stats.totalAgents}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-left-success shadow h-100 py-2">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                      Total Tasks
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                      {loading ? '...' : stats.totalTasks}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-left-warning shadow h-100 py-2">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                      Pending Tasks
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                      {loading ? '...' : stats.pendingTasks}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-left-info shadow h-100 py-2">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                      Completed Tasks
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                      {loading ? '...' : stats.completedTasks}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions *//*}
        <div className="row">
          <div className="col-lg-6 mb-4">
            <div className="card">
              <div className="card-header">
                <h6 className="m-0 font-weight-bold text-primary">Quick Actions</h6>
              </div>
              <div className="card-body">
                <div className="d-flex flex-column gap-3">
                  <Link href="/agents" className="btn btn-primary">
                    <i className="fas fa-users mr-2"></i>
                    Manage Agents
                  </Link>
                  <Link href="/tasks/upload" className="btn btn-success">
                    <i className="fas fa-upload mr-2"></i>
                    Upload CSV File
                  </Link>
                  <Link href="/tasks" className="btn btn-info">
                    <i className="fas fa-tasks mr-2"></i>
                    View All Tasks
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6 mb-4">
            <div className="card">
              <div className="card-header">
                <h6 className="m-0 font-weight-bold text-primary">Recent Activity</h6>
              </div>
              <div className="card-body">
                {loading ? (
                  <p>Loading recent activity...</p>
                ) : (
                  <div>
                    <p>• {stats.totalAgents} agents are currently active</p>
                    <p>• {stats.pendingTasks} tasks are waiting to be processed</p>
                    <p>• {stats.completedTasks} tasks have been completed</p>
                    {stats.totalTasks === 0 && (
                      <p className="text-warning">• No tasks uploaded yet. Click "Upload CSV File" to get started!</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .row {
          display: flex;
          flex-wrap: wrap;
          margin: -0.75rem;
        }

        .col-xl-3, .col-md-6, .col-lg-6 {
          flex: 0 0 auto;
          padding: 0 0.75rem;
        }

        .col-xl-3 {
          width: 25%;
        }

        .col-md-6 {
          width: 50%;
        }

        .col-lg-6 {
          width: 50%;
        }

        @media (max-width: 768px) {
          .col-xl-3, .col-md-6, .col-lg-6 {
            width: 100%;
          }
        }

        .border-left-primary {
          border-left: 0.25rem solid var(--primary) !important;
        }

        .border-left-success {
          border-left: 0.25rem solid var(--success) !important;
        }

        .border-left-warning {
          border-left: 0.25rem solid var(--warning) !important;
        }

        .border-left-info {
          border-left: 0.25rem solid var(--info) !important;
        }

        .shadow {
          box-shadow: 0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15) !important;
        }

        .h-100 {
          height: 100% !important;
        }

        .py-2 {
          padding-top: 0.5rem !important;
          padding-bottom: 0.5rem !important;
        }

        .no-gutters {
          margin-right: 0;
          margin-left: 0;
        }

        .mr-2 {
          margin-right: 0.5rem !important;
        }

        .mb-1 {
          margin-bottom: 0.25rem !important;
        }

        .text-xs {
          font-size: 0.75rem !important;
        }

        .font-weight-bold {
          font-weight: 700 !important;
        }

        .text-uppercase {
          text-transform: uppercase !important;
        }

        .h5 {
          font-size: 1.25rem;
        }

        .text-gray-800 {
          color: #5a5c69 !important;
        }

        .gap-3 {
          gap: 1rem;
        }

        .btn {
          text-decoration: none;
          display: inline-block;
          text-align: center;
        }

        .btn:hover {
          text-decoration: none;
        }
      `}</style>
    </>
  );
}
*/

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { agentsAPI, tasksAPI } from '../utils/api';
import { toast } from 'react-toastify';

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({
    totalAgents: 0,
    totalTasks: 0,
    pendingTasks: 0,
    completedTasks: 0
  });
  const [loading, setLoading] = useState(true);
  
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !authLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [mounted, authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (mounted && isAuthenticated) {
      fetchStats();
    }
  }, [mounted, isAuthenticated]);

  const fetchStats = async () => {
    try {
      const [agentsResponse, tasksResponse] = await Promise.all([
        agentsAPI.getAll(),
        tasksAPI.getAll()
      ]);

      const tasks = tasksResponse.data.data;
      const agents = agentsResponse.data.data;

      setStats({
        totalAgents: agents.length,
        totalTasks: tasks.length,
        pendingTasks: tasks.filter(task => task.status === 'pending').length,
        completedTasks: tasks.filter(task => task.status === 'completed').length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || authLoading) {
    return (
      <div className="text-center mt-4">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Dashboard | Task Distribution System</title>
      </Head>

      <div>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Dashboard</h1>
          <p>Welcome back, {user?.name}!</p>
        </div>

        {/* Stats Cards */}
        <div className="row mb-4">
          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-left-primary shadow h-100 py-2">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                      Total Agents
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                      {loading ? '...' : stats.totalAgents}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-left-success shadow h-100 py-2">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                      Total Tasks
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                      {loading ? '...' : stats.totalTasks}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-left-warning shadow h-100 py-2">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                      Pending Tasks
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                      {loading ? '...' : stats.pendingTasks}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-left-info shadow h-100 py-2">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                      Completed Tasks
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                      {loading ? '...' : stats.completedTasks}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="row">
          <div className="col-lg-6 mb-4">
            <div className="card">
              <div className="card-header">
                <h6 className="m-0 font-weight-bold text-primary">Quick Actions</h6>
              </div>
              <div className="card-body">
                <div className="d-flex flex-column gap-3">
                  <Link href="/agents" className="btn btn-primary">
                    <i className="fas fa-users mr-2"></i>
                    Manage Agents
                  </Link>
                  <Link href="/tasks/upload" className="btn btn-success">
                    <i className="fas fa-upload mr-2"></i>
                    Upload CSV File
                  </Link>
                  <Link href="/tasks" className="btn btn-info">
                    <i className="fas fa-tasks mr-2"></i>
                    View All Tasks
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6 mb-4">
            <div className="card">
              <div className="card-header">
                <h6 className="m-0 font-weight-bold text-primary">Recent Activity</h6>
              </div>
              <div className="card-body">
                {loading ? (
                  <p>Loading recent activity...</p>
                ) : (
                  <div>
                    <p>• {stats.totalAgents} agents are currently active</p>
                    <p>• {stats.pendingTasks} tasks are waiting to be processed</p>
                    <p>• {stats.completedTasks} tasks have been completed</p>
                    {stats.totalTasks === 0 && (
                      <p className="text-warning">• No tasks uploaded yet. Click "Upload CSV File" to get started!</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .row {
          display: flex;
          flex-wrap: wrap;
          margin: -0.75rem;
        }

        .col-xl-3, .col-md-6, .col-lg-6 {
          flex: 0 0 auto;
          padding: 0 0.75rem;
        }

        .col-xl-3 {
          width: 25%;
        }

        .col-md-6 {
          width: 50%;
        }

        .col-lg-6 {
          width: 50%;
        }

        @media (max-width: 768px) {
          .col-xl-3, .col-md-6, .col-lg-6 {
            width: 100%;
          }
        }

        .border-left-primary {
          border-left: 0.25rem solid var(--primary) !important;
        }

        .border-left-success {
          border-left: 0.25rem solid var(--success) !important;
        }

        .border-left-warning {
          border-left: 0.25rem solid var(--warning) !important;
        }

        .border-left-info {
          border-left: 0.25rem solid var(--info) !important;
        }

        .shadow {
          box-shadow: 0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15) !important;
        }

        .h-100 {
          height: 100% !important;
        }

        .py-2 {
          padding-top: 0.5rem !important;
          padding-bottom: 0.5rem !important;
        }

        .no-gutters {
          margin-right: 0;
          margin-left: 0;
        }

        .mr-2 {
          margin-right: 0.5rem !important;
        }

        .mb-1 {
          margin-bottom: 0.25rem !important;
        }

        .text-xs {
          font-size: 0.75rem !important;
        }

        .font-weight-bold {
          font-weight: 700 !important;
        }

        .text-uppercase {
          text-transform: uppercase !important;
        }

        .h5 {
          font-size: 1.25rem;
        }

        .text-gray-800 {
          color: #5a5c69 !important;
        }

        .gap-3 {
          gap: 1rem;
        }

        .btn {
          text-decoration: none;
          display: inline-block;
          text-align: center;
        }

        .btn:hover {
          text-decoration: none;
        }
      `}</style>
    </>
  );
}