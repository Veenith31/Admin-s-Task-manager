import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Sidebar({ isOpen, setIsOpen }) {
  const router = useRouter();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/agents', label: 'Agents', icon: '👨‍💼' },
    { path: '/tasks', label: 'Tasks', icon: '✅' },
    { path: '/tasks/upload', label: 'Upload CSV', icon: '📤' },
  ];

  return (
    <>
      <div className={`sidebar ${isOpen ? 'active' : ''}`}>
        <div className="sidebar-header">
          <h4 className="text-center py-3">Task System</h4>
        </div>
        
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li key={item.path} className="menu-item">
              <Link 
                href={item.path} 
                className={`menu-link ${router.pathname === item.path ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                <span className="menu-icon">{item.icon}</span>
                <span className="menu-text">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <style jsx>{`
        .sidebar {
          width: var(--sidebar-width);
          background: linear-gradient(180deg, var(--primary) 10%, var(--secondary) 100%);
          color: white;
          position: fixed;
          height: 100vh;
          overflow-y: auto;
          transition: all 0.3s;
          z-index: 1000;
        }
        
        .sidebar-header {
          padding: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .sidebar-menu {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .menu-item {
          margin-bottom: 0.25rem;
        }
        
        .menu-link {
          display: flex;
          align-items: center;
          padding: 1rem;
          color: rgba(255, 255, 255, 0.8);
          transition: all 0.3s;
        }
        
        .menu-link:hover,
        .menu-link.active {
          color: white;
          background-color: rgba(255, 255, 255, 0.1);
        }
        
        .menu-icon {
          margin-right: 0.75rem;
          font-size: 1.2rem;
        }
        
        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 999;
        }
        
        @media (max-width: 768px) {
          .sidebar {
            margin-left: -250px;
          }
          
          .sidebar.active {
            margin-left: 0;
          }
        }
      `}</style>
    </>
  );
}