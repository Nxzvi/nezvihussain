import React, { useState, useEffect } from 'react';
import { Shield, LayoutGrid, Award, FolderHeart, MailOpen, Lock, LogOut, CheckCircle, Trash2, Edit3, Plus, X } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function AdminDashboard({ token, setToken, onDataUpdate }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success'|'error', text: '' }

  // Dashboard Data State
  const [profile, setProfile] = useState({});
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);

  // Forms states
  const [profileForm, setProfileForm] = useState({});
  const [skillForm, setSkillForm] = useState({ name: '', category: 'DevOps', icon: 'devicon-linux-plain colored', level: 'Expert' });
  const [editingSkill, setEditingSkill] = useState(null);
  
  const [projectForm, setProjectForm] = useState({ title: '', description: '', technologies: '', githubUrl: '', liveUrl: '', category: 'DevOps' });
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  const showToast = (text, type = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchDashboardData = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const pRes = await fetch(`${API_BASE_URL}/api/profile`);
      const profileData = await pRes.json();
      setProfile(profileData);
      setProfileForm(profileData);

      const sRes = await fetch(`${API_BASE_URL}/api/skills`);
      const skillsData = await sRes.json();
      setSkills(skillsData);

      const prRes = await fetch(`${API_BASE_URL}/api/projects`);
      const projectsData = await prRes.json();
      setProjects(projectsData);

      const mRes = await fetch(`${API_BASE_URL}/api/messages`, { headers });
      if (mRes.ok) {
        const messagesData = await mRes.json();
        setMessages(messagesData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      showToast('Error loading dashboard data', 'error');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (response.ok) {
        setToken(data.token);
        localStorage.setItem('adminToken', data.token);
        showToast('Login successful!');
      } else {
        setLoginError(data.message || 'Login failed.');
      }
    } catch (err) {
      setLoginError('Could not reach backend API server.');
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('adminToken');
    showToast('Logged out successfully.');
  };

  // --- Profile submit ---
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileForm)
      });
      if (response.ok) {
        showToast('Profile updated!');
        fetchDashboardData();
        if (onDataUpdate) onDataUpdate();
      } else {
        showToast('Failed to update profile', 'error');
      }
    } catch (err) {
      showToast('Server connection error', 'error');
    } finally {
      setLoading(false);
    }
  };

  // --- Skills Actions ---
  const handleSkillSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const method = editingSkill ? 'PUT' : 'POST';
    const url = editingSkill 
      ? `${API_BASE_URL}/api/skills/${editingSkill}`
      : `${API_BASE_URL}/api/skills`;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(skillForm)
      });
      if (response.ok) {
        showToast(editingSkill ? 'Skill updated!' : 'Skill added!');
        setSkillForm({ name: '', category: 'DevOps', icon: 'devicon-linux-plain colored', level: 'Expert' });
        setEditingSkill(null);
        fetchDashboardData();
        if (onDataUpdate) onDataUpdate();
      } else {
        showToast('Failed to save skill', 'error');
      }
    } catch (err) {
      showToast('Server connection error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSkill = async (id) => {
    if (!window.confirm('Delete this skill?')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/skills/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        showToast('Skill deleted!');
        fetchDashboardData();
        if (onDataUpdate) onDataUpdate();
      }
    } catch (err) {
      showToast('Error deleting skill', 'error');
    }
  };

  // --- Projects Actions ---
  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const method = editingProject ? 'PUT' : 'POST';
    const url = editingProject 
      ? `${API_BASE_URL}/api/projects/${editingProject}`
      : `${API_BASE_URL}/api/projects`;

    const finalForm = {
      ...projectForm,
      technologies: typeof projectForm.technologies === 'string'
        ? projectForm.technologies.split(',').map(t => t.trim()).filter(Boolean)
        : projectForm.technologies
    };

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(finalForm)
      });
      if (response.ok) {
        showToast(editingProject ? 'Project updated!' : 'Project created!');
        setProjectForm({ title: '', description: '', technologies: '', githubUrl: '', liveUrl: '', category: 'DevOps' });
        setEditingProject(null);
        fetchDashboardData();
        if (onDataUpdate) onDataUpdate();
      } else {
        showToast('Failed to save project', 'error');
      }
    } catch (err) {
      showToast('Server connection error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        showToast('Project deleted!');
        fetchDashboardData();
        if (onDataUpdate) onDataUpdate();
      }
    } catch (err) {
      showToast('Error deleting project', 'error');
    }
  };

  // --- Messages Actions ---
  const handleMarkRead = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/messages/${id}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        showToast('Marked as read!');
        fetchDashboardData();
      }
    } catch (err) {
      showToast('Error modifying message', 'error');
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/messages/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        showToast('Message deleted!');
        fetchDashboardData();
      }
    } catch (err) {
      showToast('Error deleting message', 'error');
    }
  };

  // --- LOGIN GATEWAY ---
  if (!token) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        padding: '24px'
      }}>
        <form onSubmit={handleLogin} className="glass-panel" style={{
          padding: '40px',
          width: '100%',
          maxWidth: '400px',
          textAlign: 'left'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 255, 156, 0.1)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <Shield size={28} style={{ color: 'var(--primary)' }} />
            </div>
            <h2 style={{ color: '#fff', fontSize: '1.6rem' }}>Admin Gateway</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>Enter credentials to configure profile</p>
          </div>

          {loginError && (
            <div style={{
              padding: '12px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5',
              borderRadius: '6px',
              fontSize: '0.85rem',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              {loginError}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-control"
              placeholder="admin"
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '28px' }}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            Login <Lock size={16} />
          </button>
        </form>
      </div>
    );
  }

  // --- LOGGED IN DASHBOARD ---
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', position: 'relative' }}>
      {toast && (
        <div className={`toast toast-${toast.type}`} style={{ top: '24px', bottom: 'auto' }}>
          {toast.text}
        </div>
      )}

      {/* Sidebar Nav */}
      <div className="admin-sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
          <Shield style={{ color: 'var(--primary)' }} />
          <h3 style={{ color: '#fff', fontSize: '1.2rem' }}>Console</h3>
        </div>

        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <li>
            <button
              onClick={() => setActiveTab('profile')}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'profile' ? 'rgba(0, 255, 156, 0.12)' : 'transparent',
                color: activeTab === 'profile' ? 'var(--primary)' : 'var(--text-secondary)',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                fontWeight: 500,
                transition: 'var(--transition)'
              }}
            >
              <LayoutGrid size={18} /> Profile
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('skills')}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'skills' ? 'rgba(0, 255, 156, 0.12)' : 'transparent',
                color: activeTab === 'skills' ? 'var(--primary)' : 'var(--text-secondary)',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                fontWeight: 500,
                transition: 'var(--transition)'
              }}
            >
              <Award size={18} /> Skills
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('projects')}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'projects' ? 'rgba(0, 255, 156, 0.12)' : 'transparent',
                color: activeTab === 'projects' ? 'var(--primary)' : 'var(--text-secondary)',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                fontWeight: 500,
                transition: 'var(--transition)'
              }}
            >
              <FolderHeart size={18} /> Projects
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('messages')}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'messages' ? 'rgba(0, 255, 156, 0.12)' : 'transparent',
                color: activeTab === 'messages' ? 'var(--primary)' : 'var(--text-secondary)',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                fontWeight: 500,
                position: 'relative',
                transition: 'var(--transition)'
              }}
            >
              <MailOpen size={18} /> Messages
              {messages.filter(m => !m.isRead).length > 0 && (
                <span style={{
                  position: 'absolute',
                  right: '12px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  borderRadius: '10px',
                  padding: '2px 8px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}>
                  {messages.filter(m => !m.isRead).length}
                </span>
              )}
            </button>
          </li>
        </ul>

        <button 
          onClick={handleLogout}
          className="btn-secondary" 
          style={{
            position: 'absolute',
            bottom: '24px',
            left: '24px',
            right: '24px',
            padding: '10px',
            justifyContent: 'center',
            fontSize: '0.9rem',
            borderColor: '#ef4444',
            color: '#ef4444'
          }}
        >
          Logout <LogOut size={16} />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="admin-content" style={{ flex: 1, textAlign: 'left' }}>
        
        {/* --- PROFILE EDITOR TAB --- */}
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSubmit} className="glass-panel" style={{ padding: '32px' }}>
            <h2 style={{ color: '#fff', marginBottom: '24px' }}>Edit Profile Information</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={profileForm.fullName || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={profileForm.email || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="form-control"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label>GitHub Profile URL</label>
                <input
                  type="url"
                  value={profileForm.github || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>LinkedIn Profile URL</label>
                <input
                  type="url"
                  value={profileForm.linkedin || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, linkedin: e.target.value })}
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Role / Subtitles (Separated by Bullet or pipe)</label>
              <input
                type="text"
                value={profileForm.roleText || ''}
                onChange={(e) => setProfileForm({ ...profileForm, roleText: e.target.value })}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>About Me Bio Paragraph</label>
              <textarea
                value={profileForm.aboutText || ''}
                onChange={(e) => setProfileForm({ ...profileForm, aboutText: e.target.value })}
                className="form-control"
                rows="6"
              ></textarea>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Profile Details'}
            </button>
          </form>
        )}

        {/* --- SKILLS MANAGER TAB --- */}
        {activeTab === 'skills' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '32px' }}>
            {/* Left side Form */}
            <form onSubmit={handleSkillSubmit} className="glass-panel" style={{ padding: '24px', height: 'fit-content' }}>
              <h3 style={{ color: '#fff', marginBottom: '20px' }}>
                {editingSkill ? 'Edit Skill Details' : 'Add New Skill'}
              </h3>

              <div className="form-group">
                <label>Skill Name</label>
                <input
                  type="text"
                  value={skillForm.name}
                  onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                  className="form-control"
                  placeholder="Terraform"
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  value={skillForm.category}
                  onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                  className="form-control"
                >
                  <option value="DevOps">DevOps</option>
                  <option value="Cloud">Cloud</option>
                  <option value="Programming">Programming</option>
                </select>
              </div>

              <div className="form-group">
                <label>Icon CSS Class (FontAwesome or Devicon)</label>
                <input
                  type="text"
                  value={skillForm.icon}
                  onChange={(e) => setSkillForm({ ...skillForm, icon: e.target.value })}
                  className="form-control"
                  placeholder="devicon-terraform-plain colored"
                  required
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Use any classes from devicons or fontawesome (e.g. devicon-docker-plain colored)
                </span>
              </div>

              <div className="form-group">
                <label>Proficiency level</label>
                <input
                  type="text"
                  value={skillForm.level}
                  onChange={(e) => setSkillForm({ ...skillForm, level: e.target.value })}
                  className="form-control"
                  placeholder="Expert"
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  {editingSkill ? 'Update' : 'Add'} <Plus size={16} />
                </button>
                {editingSkill && (
                  <button 
                    type="button" 
                    onClick={() => {
                      setEditingSkill(null);
                      setSkillForm({ name: '', category: 'DevOps', icon: 'devicon-linux-plain colored', level: 'Expert' });
                    }} 
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            {/* Right side Table/List */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ color: '#fff', marginBottom: '20px' }}>Active Skills</h3>
              <div style={{ maxHeight: '550px', overflowY: 'auto' }}>
                {skills.map((skill) => (
                  <div key={skill.id || skill._id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 0',
                    borderBottom: '1px solid var(--border-glass)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <i className={skill.icon} style={{ fontSize: '24px', color: 'var(--primary)' }}></i>
                      <div>
                        <div style={{ color: '#fff', fontWeight: 600 }}>{skill.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{skill.category} • {skill.level}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => {
                          setEditingSkill(skill.id || skill._id);
                          setSkillForm(skill);
                        }}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--secondary)' }}
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteSkill(skill.id || skill._id)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- PROJECTS MANAGER TAB --- */}
        {activeTab === 'projects' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px' }}>
            {/* Edit/Create Form */}
            <form onSubmit={handleProjectSubmit} className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ color: '#fff', marginBottom: '20px' }}>
                {editingProject ? 'Edit Project Details' : 'Create New Project'}
              </h3>

              <div className="form-group">
                <label>Project Title</label>
                <input
                  type="text"
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  className="form-control"
                  placeholder="K8s Deployer"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  className="form-control"
                  rows="4"
                  placeholder="Describe your implementation details..."
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label>Technologies Used (Separated by comma)</label>
                <input
                  type="text"
                  value={Array.isArray(projectForm.technologies) ? projectForm.technologies.join(', ') : projectForm.technologies}
                  onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
                  className="form-control"
                  placeholder="Kubernetes, Ansible, Docker, Python"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>GitHub Repository URL</label>
                  <input
                    type="url"
                    value={projectForm.githubUrl}
                    onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label>Live URL (if any)</label>
                  <input
                    type="url"
                    value={projectForm.liveUrl}
                    onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Project Category</label>
                <input
                  type="text"
                  value={projectForm.category}
                  onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                  className="form-control"
                  placeholder="DevOps"
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  {editingProject ? 'Save Changes' : 'Create Project'}
                </button>
                {editingProject && (
                  <button 
                    type="button" 
                    onClick={() => {
                      setEditingProject(null);
                      setProjectForm({ title: '', description: '', technologies: '', githubUrl: '', liveUrl: '', category: 'DevOps' });
                    }} 
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            {/* Project List */}
            <div className="glass-panel" style={{ padding: '24px', height: 'fit-content' }}>
              <h3 style={{ color: '#fff', marginBottom: '20px' }}>Active Projects</h3>
              <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {projects.map((project) => (
                  <div key={project.id || project._id} style={{
                    padding: '16px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--border-glass)',
                    marginBottom: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ color: '#fff' }}>{project.title}</h4>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => {
                            setEditingProject(project.id || project._id);
                            setProjectForm(project);
                          }}
                          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--secondary)' }}
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteProject(project.id || project._id)}
                          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: '1.4' }}>
                      {project.description.substring(0, 100)}...
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- MESSAGES INBOX TAB --- */}
        {activeTab === 'messages' && (
          <div className="glass-panel" style={{ padding: '32px' }}>
            <h2 style={{ color: '#fff', marginBottom: '24px' }}>Inquiries Inbox</h2>
            {messages.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '40px' }}>No messages found in your inbox.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {messages.map((msg) => (
                  <div key={msg.id || msg._id} style={{
                    padding: '24px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-glass)',
                    background: msg.isRead ? 'rgba(255,255,255,0.01)' : 'rgba(0, 255, 156, 0.03)',
                    textAlign: 'left'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
                      <div>
                        <h4 style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {msg.name} 
                          {!msg.isRead && (
                            <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'var(--primary)', color: '#000', fontWeight: 'bold' }}>
                              New
                            </span>
                          )}
                        </h4>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          <a href={`mailto:${msg.email}`} style={{ color: 'var(--primary)', textDecoration: 'none' }}>{msg.email}</a> • {new Date(msg.createdAt).toLocaleString()}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '12px' }}>
                        {!msg.isRead && (
                          <button 
                            onClick={() => handleMarkRead(msg.id || msg._id)}
                            className="btn-secondary" 
                            style={{ padding: '6px 12px', fontSize: '0.75rem', borderColor: 'var(--primary)', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <CheckCircle size={12} /> Mark Read
                          </button>
                        )}
                        <button 
                          onClick={() => handleDeleteMessage(msg.id || msg._id)}
                          className="btn-secondary" 
                          style={{ padding: '6px 12px', fontSize: '0.75rem', borderColor: '#ef4444', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
                      <strong style={{ color: '#fff' }}>Subject:</strong> {msg.subject || '(No Subject)'} <br />
                      <p style={{ marginTop: '8px', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{msg.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
