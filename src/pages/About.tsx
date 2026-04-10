import './About.css';

const METHODOLOGY = [
  { step: '01', title: 'URL Parsing', desc: 'Identify platform and extract username from the profile link.', icon: '🔗' },
  { step: '02', title: 'Data Collection', desc: 'Fetch publicly available profile metadata, posts, and engagement data.', icon: '📡' },
  { step: '03', title: 'Pattern Analysis', desc: 'Analyze follower graphs, posting frequency, and content authenticity.', icon: '🔬' },
  { step: '04', title: 'AI Scoring', desc: 'Compute trust score across 6 weighted metrics with risk classification.', icon: '🧠' },
  { step: '05', title: 'Report Generation', desc: 'Produce a detailed breakdown with actionable recommendations.', icon: '📊' },
];

const FEATURES = [
  { icon: '🔍', title: 'Multi-Platform', desc: 'Analyze 6 major social networks from a single tool.' },
  { icon: '🤖', title: 'AI Detection', desc: 'Advanced algorithms evaluate multiple authenticity signals.' },
  { icon: '📊', title: 'Detailed Reports', desc: 'Comprehensive breakdowns with per-metric scoring.' },
  { icon: '🔒', title: 'Privacy First', desc: 'Client-side analysis. Nothing leaves your browser.' },
  { icon: '⚡', title: 'Instant Results', desc: 'Get analysis in under 3 seconds, no sign-up needed.' },
  { icon: '📦', title: 'Batch Scanning', desc: 'Analyze multiple profiles at once with batch mode.' },
];

export default function About() {
  return (
    <div className="about" id="about-page">
      <header className="about-head">
        <p className="section-label">About</p>
        <h1 className="about-title">
          Built to make the internet<br />
          <span className="gradient-text">safer for everyone</span>
        </h1>
        <p className="about-intro">
          FakeGuard is an AI-powered tool that helps anyone — from tech-savvy analysts to everyday
          users — identify fake social media accounts quickly and confidently.
        </p>
      </header>

      {/* Mission */}
      <section className="about-mission surface-static accent-border-l" id="mission">
        <h2>Our Mission</h2>
        <p>
          Social media fraud costs individuals and businesses billions annually. Fake accounts
          power scams, misinformation, and identity theft. FakeGuard was created to democratize
          detection — providing everyone with institutional-grade analysis tools, completely free.
        </p>
      </section>

      {/* Methodology Timeline */}
      <section className="about-method" id="methodology">
        <p className="section-label">How It Works</p>
        <h2 className="section-title">Detection Methodology</h2>

        <div className="timeline">
          {METHODOLOGY.map((m, i) => (
            <div
              key={m.step}
              className="timeline-item anim-fade-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="timeline-marker">
                <span className="timeline-num">{m.step}</span>
                {i < METHODOLOGY.length - 1 && <div className="timeline-line" />}
              </div>
              <div className="timeline-content surface-static">
                <span className="timeline-icon">{m.icon}</span>
                <h3>{m.title}</h3>
                <p>{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="about-features" id="features">
        <p className="section-label">Capabilities</p>
        <h2 className="section-title">Key Features</h2>

        <div className="features-grid">
          {FEATURES.map((f) => (
            <div key={f.title} className="feature-item surface-static">
              <span className="feature-icon">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech */}
      <section className="about-tech" id="tech">
        <p className="section-label">Technology</p>
        <h2 className="section-title">Built With</h2>
        <div className="tech-chips">
          {['React', 'TypeScript', 'Vite', 'CSS3', 'LocalStorage API'].map((t) => (
            <span key={t} className="tech-chip">{t}</span>
          ))}
        </div>
      </section>
    </div>
  );
}
