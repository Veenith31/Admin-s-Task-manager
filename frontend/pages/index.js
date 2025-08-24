import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import Head from 'next/head';
import Link from 'next/link';

export default function HomePage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // Will redirect to dashboard
  }

  return (
    <>
      <Head>
        <title>Task Distribution System | MERN Stack Application</title>
        <meta name="description" content="A comprehensive task distribution system built with MERN stack for managing agents and distributing tasks efficiently." />
      </Head>

      <div className="landing-container">
        <div className="landing-content">
          <div className="hero-section">
            <h1>Task Distribution System</h1>
            <p className="lead">
              Efficiently manage agents and distribute tasks with our comprehensive MERN stack application
            </p>
            
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-users"></i>
                </div>
                <h3>Agent Management</h3>
                <p>Create and manage agents with detailed information including contact details and passwords</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-upload"></i>
                </div>
                <h3>CSV Upload</h3>
                <p>Upload CSV files with task data and automatically distribute them among available agents</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-tasks"></i>
                </div>
                <h3>Task Tracking</h3>
                <p>Monitor task progress with status updates and comprehensive filtering options</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-chart-bar"></i>
                </div>
                <h3>Analytics Dashboard</h3>
                <p>Get insights with real-time statistics and progress tracking</p>
              </div>
            </div>

            <div className="cta-section">
              <Link href="/login" className="btn btn-primary btn-lg">
                Get Started
              </Link>
              <p className="login-info">
                <strong>Default Admin Credentials:</strong><br />
                Email: admin@example.com<br />
                Password: admin123
              </p>
            </div>
          </div>

          <div className="tech-stack">
            <h2>Built with Modern Technologies</h2>
            <div className="tech-grid">
              <div className="tech-item">
                <strong>Frontend:</strong> React.js with Next.js
              </div>
              <div className="tech-item">
                <strong>Backend:</strong> Node.js with Express.js
              </div>
              <div className="tech-item">
                <strong>Database:</strong> MongoDB with Mongoose
              </div>
              <div className="tech-item">
                <strong>Authentication:</strong> JWT Tokens
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .landing-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2rem;
        }

        .landing-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .hero-section {
          text-align: center;
          padding: 4rem 0;
        }

        .hero-section h1 {
          font-size: 3.5rem;
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .lead {
          font-size: 1.5rem;
          margin-bottom: 3rem;
          opacity: 0.9;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin: 3rem 0;
        }

        .feature-card {
          background: rgba(255, 255, 255, 0.1);
          padding: 2rem;
          border-radius: 15px;
          backdrop-filter: blur(10px);
          text-align: center;
          transition: transform 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-5px);
        }

        .feature-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          color: #ffd700;
        }

        .feature-card h3 {
          margin-bottom: 1rem;
          font-size: 1.25rem;
        }

        .feature-card p {
          opacity: 0.9;
          line-height: 1.6;
        }

        .cta-section {
          margin: 4rem 0;
        }

        .btn-lg {
          padding: 1rem 2rem;
          font-size: 1.25rem;
          margin-bottom: 2rem;
          display: inline-block;
          text-decoration: none;
          background: rgba(255, 255, 255, 0.2);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50px;
          transition: all 0.3s ease;
        }

        .btn-lg:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
          text-decoration: none;
          color: white;
        }

        .login-info {
          background: rgba(0, 0, 0, 0.2);
          padding: 1.5rem;
          border-radius: 10px;
          margin-top: 2rem;
          display: inline-block;
          backdrop-filter: blur(5px);
        }

        .tech-stack {
          text-align: center;
          padding: 3rem 0;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
        }

        .tech-stack h2 {
          margin-bottom: 2rem;
          font-size: 2rem;
        }

        .tech-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
        }

        .tech-item {
          background: rgba(255, 255, 255, 0.1);
          padding: 1.5rem;
          border-radius: 10px;
          backdrop-filter: blur(5px);
        }

        .loading-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        @media (max-width: 768px) {
          .hero-section h1 {
            font-size: 2.5rem;
          }

          .lead {
            font-size: 1.25rem;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .tech-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}