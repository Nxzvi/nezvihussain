import React from 'react';
import { Terminal, Mail, ArrowRight, Shield, Cloud } from 'lucide-react';

export default function Hero({ profile }) {
  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" style={{ padding: '100px 0 80px 0', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '40px',
        flexWrap: 'wrap',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Left Side: Text and Content */}
        <div style={{ flex: '1 1 45%', minWidth: '350px', textAlign: 'left' }}>
          <h2 style={{
            fontSize: '1.4rem',
            color: 'var(--text-secondary)',
            marginBottom: '8px',
            fontWeight: 500,
            letterSpacing: '2px'
          }}>
            HELLO, I'M
          </h2>
          <h1 style={{
            fontSize: '4.5rem',
            lineHeight: 1.1,
            marginBottom: '20px',
            color: '#fff',
            textShadow: '0 0 25px rgba(176, 38, 255, 0.4)',
            whiteSpace: 'nowrap'
          }}>
            <span style={{ background: 'linear-gradient(to right, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{profile.fullName || 'Nezvi Hussain'}</span>
          </h1>

          <p style={{
            fontSize: '1.4rem',
            color: 'var(--text-secondary)',
            fontWeight: 500,
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Terminal size={24} color="var(--primary)" />
            {profile.roleText || 'DevOps • Cloud • Automation • Security'}
          </p>

          <p style={{
            fontSize: '1.1rem',
            color: 'var(--text-muted)',
            marginBottom: '40px',
            lineHeight: 1.8,
            maxWidth: '500px'
          }}>
            A passionate engineer transforming manual processes into efficient pipelines. I specialize in building secure, scalable, and highly automated cloud infrastructures that power modern applications.
          </p>

          <div style={{ display: 'flex', gap: '24px', marginBottom: '40px', alignItems: 'center' }}>
            <a 
              href={profile.github || 'https://github.com/nxzvi'} 
              target="_blank" 
              rel="noreferrer"
              style={{ color: 'var(--text-secondary)', transition: 'var(--transition)', fontSize: '26px' }}
              onMouseOver={(e) => { e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <i className="fab fa-github"></i>
            </a>
            <a 
              href={profile.linkedin || 'https://linkedin.com/in/nezvihussain'} 
              target="_blank" 
              rel="noreferrer"
              style={{ color: 'var(--text-secondary)', transition: 'var(--transition)', fontSize: '26px' }}
              onMouseOver={(e) => { e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <i className="fab fa-linkedin"></i>
            </a>
            <a 
              href={`mailto:${profile.email || 'nezvihussain00@gmail.com'}`}
              style={{ color: 'var(--text-secondary)', transition: 'var(--transition)', fontSize: '26px' }}
              onMouseOver={(e) => { e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <Mail size={26} />
            </a>
          </div>

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <button onClick={() => handleScroll('projects')} className="btn-primary" style={{ padding: '14px 32px' }}>
              View Projects
              <ArrowRight size={18} />
            </button>
            <button onClick={() => handleScroll('contact')} className="btn-secondary" style={{ padding: '14px 32px' }}>
              Contact Me
            </button>
          </div>
        </div>

        {/* Right Side: Professional Photo and Floating Elements */}
        <div style={{ flex: '1 1 45%', minWidth: '350px', position: 'relative', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          
          <div style={{ position: 'relative', marginRight: '20px' }}>
            <div style={{
              position: 'relative',
              width: '320px',
              height: '320px',
              borderRadius: '50%',
              padding: '5px',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              boxShadow: '0 0 30px rgba(176, 38, 255, 0.25), 0 0 50px rgba(0, 229, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'var(--transition)',
              marginRight: '20px'
            }}
            onMouseOver={(e) => { 
              e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 0 45px rgba(176, 38, 255, 0.45), 0 0 75px rgba(0, 229, 255, 0.25)';
            }}
            onMouseOut={(e) => { 
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 0 30px rgba(176, 38, 255, 0.25), 0 0 50px rgba(0, 229, 255, 0.15)';
            }}
            >
              <img 
                src="/bright_galaxy_user_profile.png" 
                alt="Nezvi Hussain" 
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            </div>
            
            {/* Floating Content Card 1 */}
            <div style={{
              position: 'absolute',
              top: '-20px',
              left: '-40px',
              background: 'rgba(15, 0, 36, 0.8)',
              backdropFilter: 'blur(12px)',
              border: '1px solid var(--border-glass)',
              borderRadius: '16px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              animation: 'float 5s infinite ease-in-out'
            }}>
              <div style={{ background: 'rgba(176, 38, 255, 0.2)', padding: '10px', borderRadius: '10px' }}>
                <Cloud size={24} color="var(--primary)" />
              </div>
              <div>
                <p style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 'bold' }}>Cloud Enthusiast</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>AWS , GCP </p>
              </div>
            </div>

            {/* Floating Content Card 2 */}
            <div style={{
              position: 'absolute',
              bottom: '-10px',
              right: '-30px',
              background: 'rgba(15, 0, 36, 0.8)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(0, 229, 255, 0.3)',
              borderRadius: '16px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              animation: 'float 6s infinite ease-in-out reverse'
            }}>
              <div style={{ background: 'rgba(0, 229, 255, 0.1)', padding: '10px', borderRadius: '10px' }}>
                <Shield size={24} color="var(--secondary)" />
              </div>
              <div>
                <p style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 'bold' }}>SOC Security</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Wazuh & Splunk</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
