import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Education from './components/Education';
import Contact from './components/Contact';
import AdminDashboard from './components/AdminDashboard';
import GalaxyBackground from './components/GalaxyBackground';
import { Terminal } from 'lucide-react';
import { API_BASE_URL } from './config';

export default function App() {
  const [view, setView] = useState('home'); // 'home' or 'admin'
  const [profile, setProfile] = useState({});
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('adminToken') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPortfolioData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch Profile
      const profileResponse = await fetch(`${API_BASE_URL}/api/profile`);
      if (!profileResponse.ok) throw new Error('Failed to load profile details');
      const profileData = await profileResponse.json();
      setProfile(profileData);

      // Fetch Skills
      const skillsResponse = await fetch(`${API_BASE_URL}/api/skills`);
      if (!skillsResponse.ok) throw new Error('Failed to load skills list');
      const skillsData = await skillsResponse.json();
      setSkills(skillsData);

      // Fetch Projects
      const projectsResponse = await fetch(`${API_BASE_URL}/api/projects`);
      if (!projectsResponse.ok) throw new Error('Failed to load projects list');
      const projectsData = await projectsResponse.json();
      setProjects(projectsData);
    } catch (err) {
      console.error(err);
      setError('Could not connect to API server. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: '16px',
        background: '#030a08',
        color: '#fff'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          border: '3px solid rgba(0, 255, 156, 0.1)',
          borderTopColor: 'var(--primary)',
          animation: 'float 2s infinite ease-in-out'
        }}></div>
        <p style={{ fontFamily: 'monospace', color: 'var(--primary)' }}>Bootstrapping systems...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: '24px',
        padding: '24px',
        background: '#030a08',
        color: '#fff',
        textAlign: 'center'
      }}>
        <div className="glass-panel" style={{ padding: '40px', maxWidth: '500px' }}>
          <h2 style={{ color: '#ef4444', marginBottom: '16px' }}>Connection Offline</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.95rem' }}>{error}</p>
          <button onClick={fetchPortfolioData} className="btn-primary">
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <GalaxyBackground />
      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar currentView={view} setView={setView} />

        <main style={{ flex: 1, paddingBottom: '60px' }}>
          {view === 'admin' ? (
            <AdminDashboard 
              token={token} 
              setToken={setToken} 
              onDataUpdate={fetchPortfolioData} 
            />
          ) : (
            <>
              <Hero profile={profile} />
              <About profile={profile} />
              <Skills skills={skills} />
              <Experience profile={profile} />
              <Projects projects={projects} />
              <Education profile={profile} />
              <Contact profile={profile} onSendMessage={fetchPortfolioData} />
            </>
          )}
        </main>

        <footer style={{
          textAlign: 'center',
          padding: '24px',
          backgroundColor: '#020617',
          borderTop: '1px solid var(--border-glass)',
          color: 'var(--text-secondary)',
          fontSize: '0.9rem'
        }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <p>© {new Date().getFullYear()} {profile.fullName || 'Nezvi Hussain'}. All rights reserved.</p>
            <p style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <Terminal size={12} /> Powered by Nxz
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
