import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { agentsAPI } from '../../utils/api';
import { toast } from 'react-toastify';

export default function AgentsPage() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: ''
  });
  const [formLoading, setFormLoading] = useState(false);

  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAgents();
    }
  }, [isAuthenticated]);

  const fetchAgents = async () => {
    try {
      const response = await agentsAPI.getAll();
      setAgents(response.data.data);
    } catch (error) {
      console.error('Error fetching agents:', error);
      toast.error('Failed to load agents');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      await agentsAPI.create(formData);
      toast.success('Agent created successfully!');
      setFormData({ name: '', email: '', mobile: '', password: '' });
      setShowAddForm(false);
      fetchAgents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create agent');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (agentId) => {
    if (!confirm('Are you sure you want to delete this agent?')) {
      return;
    }

    try {
      await agentsAPI.delete(agentId);
      toast.success('Agent deleted successfully!');
      fetchAgents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete agent');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
        <title>Agents | Task Distribution System</title>
      </Head>

      <div>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Agents Management</h1>
          <button
            className="btn btn-primary"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'Cancel' : 'Add New Agent'}
          </button>
        </div>

        {/* Add Agent Form */}
        {showAddForm && (
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">Add New Agent</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                        disabled={formLoading}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                        disabled={formLoading}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Mobile Number with Country Code *</label>
                      <input
                        type="text"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="+1234567890"
                        required
                        disabled={formLoading}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Password *</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="form-control"
                        minLength={6}
                        required
                        disabled={formLoading}
                      />
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={formLoading}
                  >
                    {formLoading ? 'Creating...' : 'Create Agent'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary ml-2"
                    onClick={() => setShowAddForm(false)}
                    disabled={formLoading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Agents List */}
        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">All Agents ({agents.length})</h5>
          </div>
          <div className="card-body">
            {loading ? (
              <p>Loading agents...</p>
            ) : agents.length === 0 ? (
              <div className="text-center py-4">
                <p>No agents found.</p>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowAddForm(true)}
                >
                  Add Your First Agent
                </button>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Mobile</th>
                      <th>Status</th>
                      <th>Tasks Assigned</th>
                      <th>Created Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agents.map((agent) => (
                      <tr key={agent._id}>
                        <td>{agent.name}</td>
                        <td>{agent.email}</td>
                        <td>{agent.mobile}</td>
                        <td>
                          <span className={`badge badge-${agent.isActive ? 'success' : 'danger'}`}>
                            {agent.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>{agent.tasksAssigned?.length || 0}</td>
                        <td>{new Date(agent.createdAt).toLocaleDateString()}</td>
                        <td>
                          <Link
                            href={`/agents/${agent._id}`}
                            className="btn btn-sm btn-primary mr-2"
                          >
                            View
                          </Link>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(agent._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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

        .col-md-6 {
          flex: 0 0 50%;
          max-width: 50%;
          padding: 0 0.75rem;
        }

        @media (max-width: 768px) {
          .col-md-6 {
            flex: 0 0 100%;
            max-width: 100%;
          }
        }

        .ml-2 {
          margin-left: 0.5rem;
        }

        .mr-2 {
          margin-right: 0.5rem;
        }

        .py-4 {
          padding-top: 1.5rem;
          padding-bottom: 1.5rem;
        }

        .btn-sm {
          padding: 0.25rem 0.5rem;
          font-size: 0.875rem;
          line-height: 1.5;
          border-radius: 0.2rem;
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

        .badge-danger {
          color: #fff;
          background-color: var(--danger);
        }

        .table-responsive {
          display: block;
          width: 100%;
          overflow-x: auto;
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