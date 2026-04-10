import { useState } from 'react';
import './Tips.css';

const TIPS = [
  {
    icon: '📸', title: 'Profile Picture Check',
    desc: 'Fake accounts often use stock photos, celebrity images, or AI-generated faces. Use reverse image search to verify.',
    severity: 'high', tag: 'Visual',
  },
  {
    icon: '📅', title: 'Account Age',
    desc: 'Recently created accounts with massive followings are a strong red flag. Real growth takes time.',
    severity: 'high', tag: 'History',
  },
  {
    icon: '👥', title: 'Follower Ratio',
    desc: 'An account following thousands but having few followers (or vice versa with zero engagement) signals bot activity.',
    severity: 'medium', tag: 'Network',
  },
  {
    icon: '📝', title: 'Post Quality',
    desc: 'Generic, repetitive, or mass-produced content is a hallmark of automated accounts.',
    severity: 'medium', tag: 'Content',
  },
  {
    icon: '📋', title: 'Bio Analysis',
    desc: 'Empty bios, suspicious links, or overly promotional descriptions often indicate fake profiles.',
    severity: 'medium', tag: 'Profile',
  },
  {
    icon: '💬', title: 'Engagement Quality',
    desc: 'Comments that are generic emojis or "nice!" on every post suggest purchased or bot engagement.',
    severity: 'low', tag: 'Social',
  },
  {
    icon: '🔗', title: 'External Links',
    desc: 'Be wary of profiles directing you to unfamiliar external websites, especially those requesting personal info.',
    severity: 'high', tag: 'Safety',
  },
  {
    icon: '🔒', title: 'Privacy Settings',
    desc: 'Some fake accounts use private settings to avoid scrutiny while sending unsolicited follow requests.',
    severity: 'low', tag: 'Privacy',
  },
];

const QUIZ = [
  {
    q: 'An account has 50k followers but only 3 posts. Is this suspicious?',
    a: true,
    exp: 'Extremely suspicious — genuine accounts build followers through consistent content over time.',
  },
  {
    q: 'A profile has a verified badge. Does this guarantee it\'s real?',
    a: false,
    exp: 'Verification badges reduce risk but aren\'t foolproof. Some platforms sell verification, and impersonators may use look-alike badges.',
  },
  {
    q: 'An account follows 5,000 people and has 10 followers. Red flag?',
    a: true,
    exp: 'This follow-to-follower ratio strongly suggests bot or spam behavior — following en masse hoping for follow-backs.',
  },
  {
    q: 'The account posts consistently 3 times a week with varied content. Suspicious?',
    a: false,
    exp: 'Regular, diverse posting is a strong indicator of a genuine human-operated account.',
  },
];

const FAQ = [
  { q: 'How accurate is FakeGuard?', a: 'FakeGuard uses multi-signal analysis that evaluates several authenticity factors. While no tool is 100% accurate, it provides strong indicative guidance.' },
  { q: 'Which platforms are supported?', a: 'Instagram, Twitter/X, Facebook, TikTok, LinkedIn, and YouTube.' },
  { q: 'Is my data stored?', a: 'Scan history is stored locally in your browser. No data is sent to external servers.' },
  { q: 'What should I do if I find a fake account?', a: 'Report it directly to the social media platform using their built-in reporting feature. Warn your contacts and avoid sharing personal information.' },
];

export default function Tips() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, boolean | null>>({});

  const answerQuiz = (idx: number, answer: boolean) => {
    setQuizAnswers((prev) => ({ ...prev, [idx]: answer }));
  };

  return (
    <div className="tips" id="tips-page">
      <header className="tips-head">
        <p className="section-label">Safety Guide</p>
        <h1 className="section-title">How to Spot <span className="gradient-text">Fake Accounts</span></h1>
        <p className="section-desc">Learn the key signals that separate real profiles from fake ones.</p>
      </header>

      {/* Featured tip */}
      <div className="tip-featured surface-static anim-fade-up">
        <div className="tip-featured-badge">🔥 Most Important</div>
        <h2>The #1 Red Flag</h2>
        <p>
          A brand new account with many followers, generic content, and no meaningful interactions is
          almost always fake. Trust your instincts — if something feels off, it probably is.
        </p>
      </div>

      {/* Tips Grid */}
      <div className="tips-grid">
        {TIPS.map((tip, i) => (
          <div
            key={tip.title}
            className="tip-card surface-static anim-fade-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="tip-card-head">
              <span className="tip-icon">{tip.icon}</span>
              <div className="tip-meta">
                <span className="tip-tag">{tip.tag}</span>
                <span className={`tip-severity sev-${tip.severity}`}>
                  {tip.severity === 'high' ? '🔴' : tip.severity === 'medium' ? '🟡' : '🟢'} {tip.severity}
                </span>
              </div>
            </div>
            <h3>{tip.title}</h3>
            <p>{tip.desc}</p>
          </div>
        ))}
      </div>

      {/* Quiz */}
      <section className="quiz-section" id="quiz-section">
        <p className="section-label">Test Yourself</p>
        <h2 className="section-title">Quick Knowledge Check</h2>
        <p className="section-desc">Can you identify the red flags?</p>

        <div className="quiz-list">
          {QUIZ.map((q, i) => {
            const answered = quizAnswers[i] !== undefined && quizAnswers[i] !== null;
            const correct = answered && quizAnswers[i] === q.a;
            return (
              <div key={i} className={`quiz-card surface-static ${answered ? (correct ? 'quiz-correct' : 'quiz-wrong') : ''}`}>
                <p className="quiz-q">{q.q}</p>
                {!answered ? (
                  <div className="quiz-btns">
                    <button className="btn btn-sm btn-ghost" onClick={() => answerQuiz(i, true)}>Yes, suspicious</button>
                    <button className="btn btn-sm btn-ghost" onClick={() => answerQuiz(i, false)}>No, it's fine</button>
                  </div>
                ) : (
                  <div className="quiz-result anim-fade">
                    <span className={correct ? 'quiz-correct-label' : 'quiz-wrong-label'}>
                      {correct ? '✓ Correct!' : '✗ Not quite'}
                    </span>
                    <p>{q.exp}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section" id="faq-section">
        <p className="section-label">FAQ</p>
        <h2 className="section-title">Common Questions</h2>

        <div className="faq-list">
          {FAQ.map((f, i) => (
            <div key={i} className={`faq-item surface-static ${openFaq === i ? 'open' : ''}`}>
              <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span>{f.q}</span>
                <span className="faq-chev">{openFaq === i ? '−' : '+'}</span>
              </button>
              {openFaq === i && (
                <p className="faq-a anim-fade">{f.a}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
