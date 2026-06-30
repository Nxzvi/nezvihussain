import React, { useState } from 'react';
import { Mail, Send, MessageSquare } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function Contact({ profile, onSendMessage }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success'|'error', text: '' }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus({ type: 'error', text: 'Please fill in all required fields.' });
      return;
    }

    setLoading(true);
    setStatus(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        setStatus({ type: 'success', text: 'Your message has been sent successfully!' });
        setFormData({ name: '', email: '', subject: '', message: '' });
        if (onSendMessage) onSendMessage(); // refresh admin messages count
      } else {
        setStatus({ type: 'error', text: data.message || 'Failed to send message.' });
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', text: 'Error connecting to the server. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" style={{ padding: '80px 0' }}>
      <div className="container">
        <h2 className="section-title">Get In Touch</h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '40px',
          alignItems: 'start'
        }}>
          {/* Contact Details */}
          <div className="glass-panel" style={{ padding: '32px', textAlign: 'left' }}>
            <h3 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '16px' }}>Let's work together!</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: '1.7' }}>
              I am open to DevOps engineering, cloud deployment pipelines, system migrations, or automation scripting opportunities. Feel free to reach out via email or the form.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(0, 255, 156, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(0, 255, 156, 0.15)'
                }}>
                  <Mail style={{ color: 'var(--primary)' }} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Email</div>
                  <a href={`mailto:${profile.email || 'nezvihussain00@gmail.com'}`} style={{ color: '#fff', textDecoration: 'none', fontWeight: 600 }}>
                    {profile.email || 'nezvihussain00@gmail.com'}
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(0, 255, 156, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(0, 255, 156, 0.15)'
                }}>
                  <i className="fab fa-github" style={{ color: 'var(--primary)', fontSize: '20px' }}></i>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>GitHub</div>
                  <a href={profile.github || 'https://github.com/nxzvi'} target="_blank" rel="noreferrer" style={{ color: '#fff', textDecoration: 'none', fontWeight: 600 }}>
                    {profile.github ? profile.github.replace('https://', '') : 'github.com/nxzvi'}
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(0, 255, 156, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(0, 255, 156, 0.15)'
                }}>
                  <i className="fab fa-linkedin" style={{ color: 'var(--primary)', fontSize: '20px' }}></i>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>LinkedIn</div>
                  <a href={profile.linkedin || 'https://linkedin.com/in/nezvihussain'} target="_blank" rel="noreferrer" style={{ color: '#fff', textDecoration: 'none', fontWeight: 600 }}>
                    {profile.linkedin ? profile.linkedin.replace('https://', '') : 'linkedin.com/in/nezvihussain'}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '32px' }}>
            <h3 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare style={{ color: 'var(--primary)' }} />
              Send a Message
            </h3>

            {status && (
              <div className={`toast toast-${status.type}`} style={{
                position: 'static',
                width: '100%',
                marginBottom: '20px',
                animation: 'none'
              }}>
                {status.text}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="name">Name <span style={{ color: 'var(--primary)' }}>*</span></label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control"
                placeholder="John Doe"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email <span style={{ color: 'var(--primary)' }}>*</span></label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control"
                placeholder="john@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="form-control"
                placeholder="Project Inquiry"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message <span style={{ color: 'var(--primary)' }}>*</span></label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="form-control"
                rows="5"
                placeholder="Write your message here..."
                required
              ></textarea>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
