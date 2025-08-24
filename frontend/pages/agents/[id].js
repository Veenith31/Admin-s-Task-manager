import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import Head from 'next/head';
import Link from 'next/link';
import { agentsAPI, tasksAPI } from '../../utils/api';
import { toast } from 'react-toastify';

export default function AgentDetailPage() {
  const [agent, setAgent] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (id && isAuthenticated) {
      fetchAgentDetails();
    }
  }, [id, isAuthenticated]);

  const fetchAgentDetails = async () => {
    try {
      const [agentResponse, tasksResponse] = await Promise.all([
        agentsAPI.getById(id),
        tasksAPI.getAll({ agent: id })
      ]);
      
      setAgent(agentResponse.data.data);
      setTasks(tasksResponse.data.data);
    } catch (error) {
      console.error('Error fetching agent details:', error);
      toast.error('Failed to load agent details');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="text-center mt-4">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!agent) {
    return (
      <div className="text-center mt-4">
        <p>Agent not found</p>
        <Link href="/agents" className="btn btn-primary">
          Back to Agents
        </Link>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{agent.name} | Agent Details</title>
      </Head>

      <div>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Agent Details</h1>
          <Link href="/agents" className="btn btn-secondary">
            Back to Agents
          </Link>
        </div>

        {/* Agent Information */}
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="mb-0">Agent Information</h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <p><strong>Name:</strong> {agent.name}</p>
                <p><strong>Email:</strong> {agent.email}</p>
                <p><strong>Mobile:</strong> {agent.mobile}</p>
              </div>
              <div className="col-md-6">
                <p>
                  <strong>Status:</strong>{' '}
                  <span className={`badge badge-${agent.isActive ? 'success' : 'danger'}`}>
                    {agent.isActive ? 'Active' : 'Inactive'}
                  </span>
                </p>
                <p><strong>Total Tasks:</strong> {tasks.length}</p>
                <p><strong>Created:</strong> {new Date(agent.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Task Statistics */}
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="card border-left-warning">
              <div className="card-body">
                <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                  Pending Tasks
                </div>
                <div className="h5 mb-0 font-weight-bold text-gray-800">
                  {tasks.filter(t => t.status === 'pending').length}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
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
          <div className="col-md-4">
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

        {/* Assigned Tasks */}
        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">Assigned Tasks ({tasks.length})</h5>
          </div>
          <div className="card-body">
            {tasks.length === 0 ? (
              <p className="text-center py-4">No tasks assigned to this agent yet.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead>
                    <tr>
                      <th>First Name</th>
                      <th>Phone</th>
                      <th>Notes</th>
                      <th>Status</th>
                      <th>Assigned Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task) => (
                      <tr key={task._id}>
                        <td>{task.firstName}</td>
                        <td>{task.phone}</td>
                        <td>{task.notes || '-'}</td>
                        <td>
                          <span className={`badge badge-${
                            task.status === 'completed' ? 'success' :
                            task.status === 'in-progress' ? 'warning' : 'secondary'
                          }`}>
                            {task.status}
                          </span>
                        </td>
                        <td>{new Date(task.assignedAt).toLocaleDateString()}</td>
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

        .col-md-4, .col-md-6 {
          padding: 0 0.75rem;
        }

        .col-md-4 {
          flex: 0 0 33.333333%;
          max-width: 33.333333%;
        }

        .col-md-6 {
          flex: 0 0 50%;
          max-width: 50%;
        }

        @media (max-width: 768px) {
          .col-md-4, .col-md-6 {
            flex: 0 0 100%;
            max-width: 100%;
          }
        }

        .border-left-warning {
          border-left: 0.25rem solid var(--warning) !important;
        }

        .border-left-info {
          border-left: 0.25rem solid var(--info) !important;
        }

        .border-left-success {
          border-left: 0.25rem solid var(--success) !important;
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

        .badge-danger {
          color: #fff;
          background-color: var(--danger);
        }

        .table-responsive {
          display: block;
          width: 100%;
          overflow-x: auto;
        }

        .py-4 {
          padding-top: 1.5rem;
          padding-bottom: 1.5rem;
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