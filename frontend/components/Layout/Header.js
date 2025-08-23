import { useAuth } from '../../contexts/AuthContext';

export default function Header({ onMenuClick }) {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="d-flex align-items-center">
        <button className="btn btn-sm btn-light me-3 d-md-none" onClick={onMenuClick}>
          ☰
        </button>
        <h5 className="mb-0">Task Distribution System</h5>
      </div>
      
      <div className="d-flex align-items-center">
        <span className="me-3">Welcome, {user?.name}</span>
        <button className="btn btn-sm btn-outline-danger" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
}