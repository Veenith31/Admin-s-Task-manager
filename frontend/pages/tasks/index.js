import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { tasksAPI, agentsAPI } from '../../utils/api';
import { toast } from 'react-toastify';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    agent: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 25,
    total: 0
  });

  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAgents();
      fetchTasks();
    }
  }, [isAuthenticated, filters, pagination.page]);

  const fetchAgents = async () => {
    try {
      const response = await agentsAPI.getAll();
      setAgents(response.data.data);
    } catch (error) {
      console.error('Error fetching agents:', error);
    }
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      };

      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '') {
          delete params[key];
        }
      });

      const response = await tasksAPI.getAll(params);
      setTasks(response.data.data);
      setPagination(prev => ({
        ...prev,
        total: response.data.count,
        pagination: response.data.pagination
      }));
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      await tasksAPI.update(taskId, { status: newStatus });
      toast.success('Task status updated successfully!');
      fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update task status');
    }
  };

  const handleDelete = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await tasksAPI.delete(taskId);
      toast.success('Task deleted successfully!');
      fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete task');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'completed':
        return 'badge-success';
      case 'in-progress':
        return 'badge-warning';
      case 'pending':
      default:
        return 'badge-secondary';
    }
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="text-center mt-4">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Tasks | Task Distribution System</title>
      </Head>

      <div>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Tasks Management</h1>
          <Link href="/tasks/upload" className="btn btn-primary">
            Upload New Tasks
          </Link>
        </div>

        {/* Filters */}
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="mb-0">Filters</h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-3">
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="form-control"
                  >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label className="form-label">Agent</label>
                  <select
                    name="agent"
                    value={filters.agent}
                    onChange={handleFilterChange}
                    className="form-control"
                  >
                    <option value="">All Agents</option>
                    {agents.map(agent => (
                      <option key={agent._id} value={agent._id}>
                        {agent.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label">Search</label>
                  <input
                    type="text"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    className="form-control"
                    placeholder="Search by name or phone..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Stats */}
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card border-left-primary">
              <div className="card-body">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                  Total Tasks
                </div>
                <div className="h5 mb-0 font-weight-bold text-gray-800">
                  {pagination.total || tasks.length}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-left-warning">
              <div className="card-body">
                <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                  Pending
                </div>
                <div className="h5 mb-0 font-weight-bold text-gray-800">
                  {tasks.filter(t => t.status === 'pending').length}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-left-info">
              <div className="card-body">
                <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                  In Progress
                </div>
                <div className="h5 mb-0 font-weight-bold text-gray-800">
                  {tasks.filter(t => t.status === 'in-progress').length}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-left-success">
              <div className="card-body">
                <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                  Completed
                </div>
                <div className="h5 mb-0 font-weight-bold text-gray-800">
                  {tasks.filter(t => t.status === 'completed').length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">
              Tasks List 
              {!loading && (
                <span className="text-muted ml-2">
                  (Showing {tasks.length} of {pagination.total})
                </span>
              )}
            </h5>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="text-center py-4">
                <p>Loading tasks...</p>
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-4">
                <p>No tasks found.</p>
                <Link href="/tasks/upload" className="btn btn-primary">
                  Upload Your First CSV File
                </Link>
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="table table-bordered table-hover">
                    <thead>
                      <tr>
                        <th>First Name</th>
                        <th>Phone</th>
                        <th>Notes</th>
                        <th>Agent</th>
                        <th>Status</th>
                        <th>Assigned Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.map((task) => (
                        <tr key={task._id}>
                          <td>{task.firstName}</td>
                          <td>{task.phone}</td>
                          <td>{task.notes || '-'}</td>
                          <td>{task.agent?.name || 'Unassigned'}</td>
                          <td>
                            <span className={`badge ${getStatusBadgeClass(task.status)}`}>
                              {task.status}
                            </span>
                          </td>
                          <td>{new Date(task.assignedAt).toLocaleDateString()}</td>
                          <td>
                            <select
                              value={task.status}
                              onChange={(e) => handleStatusUpdate(task._id, e.target.value)}
                              className="form-control form-control-sm mb-1"
                              style={{ minWidth: '120px' }}
                            >
                              <option value="pending">Pending</option>
                              <option value="in-progress">In Progress</option>
                              <option value="completed">Completed</option>
                            </select>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(task._id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {pagination.total > pagination.limit && (
                  <div className="d-flex justify-content-center mt-4">
                    <nav>
                      <ul className="pagination">
                        {pagination.pagination?.prev && (
                          <li className="page-item">
                            <button
                              className="page-link"
                              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                            >
                              Previous
                            </button>
                          </li>
                        )}
                        <li className="page-item active">
                          <span className="page-link">
                            Page {pagination.page}
                          </span>
                        </li>
                        {pagination.pagination?.next && (
                          <li className="page-item">
                            <button
                              className="page-link"
                              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                            >
                              Next
                            </button>
                          </li>
                        )}
                      </ul>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .row {
          display: flex;
          flex-wrap: wrap;
          margin: -0.75rem;
        }

        .col-md-3, .col-md-6 {
          padding: 0 0.75rem;
        }

        .col-md-3 {
          flex: 0 0 25%;
          max-width: 25%;
        }

        .col-md-6 {
          flex: 0 0 50%;
          max-width: 50%;
        }

        @media (max-width: 768px) {
          .col-md-3, .col-md-6 {
            flex: 0 0 100%;
            max-width: 100%;
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

        .text-muted {
          color: #6c757d !important;
        }

        .ml-2 {
          margin-left: 0.5rem;
        }

        .mb-1 {
          margin-bottom: 0.25rem;
        }

        .py-4 {
          padding-top: 1.5rem;
          padding-bottom: 1.5rem;
        }

        .badge {
          display: inline-block;
          padding: 0.25em 0.4em;
          font-size: 75%;
          font-weight: 700;
          line-height: 1;
          text-align: center;
          white-space: nowrap;
          vertical-align: baseline;
          border-radius: 0.25rem;
        }

        .badge-success {
          color: #fff;
          background-color: var(--success);
        }

        .badge-warning {
          color: #212529;
          background-color: var(--warning);
        }

        .badge-secondary {
          color: #fff;
          background-color: #6c757d;
        }

        .btn-sm {
          padding: 0.25rem 0.5rem;
          font-size: 0.875rem;
          line-height: 1.5;
          border-radius: 0.2rem;
        }

        .form-control-sm {
          height: calc(1.5em + 0.5rem + 2px);
          padding: 0.25rem 0.5rem;
          font-size: 0.875rem;
          line-height: 1.5;
          border-radius: 0.2rem;
        }

        .table-responsive {
          display: block;
          width: 100%;
          overflow-x: auto;
        }

        .pagination {
          display: flex;
          padding-left: 0;
          list-style: none;
          border-radius: 0.25rem;
        }

        .page-item {
          margin: 0 0.25rem;
        }

        .page-link {
          position: relative;
          display: block;
          padding: 0.5rem 0.75rem;
          margin-left: -1px;
          line-height: 1.25;
          color: var(--primary);
          background-color: #fff;
          border: 1px solid #dee2e6;
          text-decoration: none;
          cursor: pointer;
        }

        .page-item.active .page-link {
          z-index: 3;
          color: #fff;
          background-color: var(--primary);
          border-color: var(--primary);
        }

        .btn {
          text-decoration: none;
        }

        .btn:hover {
          text-decoration: none;
        }
      `}</style>
    </>
  );
}