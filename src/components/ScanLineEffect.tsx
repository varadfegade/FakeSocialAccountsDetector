import './ScanLineEffect.css';

interface Props {
  platform?: string;
  username?: string;
}

export default function ScanLineEffect({ platform, username }: Props) {
  return (
    <div className="scan-effect" id="scan-effect">
      <div className="scan-effect-inner">
        <div className="scan-terminal">
          <div className="scan-terminal-header">
            <span className="scan-dot red" />
            <span className="scan-dot yellow" />
            <span className="scan-dot green" />
            <span className="scan-terminal-title">fakeguard — analysis</span>
          </div>
          <div className="scan-terminal-body">
            <div className="scan-line anim-fade" style={{ animationDelay: '0ms' }}>
              <span className="scan-prompt">$</span>
              <span className="scan-cmd">fakeguard scan</span>
              <span className="scan-arg">{platform && username ? `@${username}` : 'target'}</span>
            </div>
            <div className="scan-line anim-fade" style={{ animationDelay: '300ms' }}>
              <span className="scan-info">→</span>
              <span>Connecting to {platform || 'platform'} API...</span>
            </div>
            <div className="scan-line anim-fade" style={{ animationDelay: '700ms' }}>
              <span className="scan-info">→</span>
              <span>Fetching profile metadata...</span>
            </div>
            <div className="scan-line anim-fade" style={{ animationDelay: '1100ms' }}>
              <span className="scan-info">→</span>
              <span>Analyzing follower graph...</span>
            </div>
            <div className="scan-line anim-fade" style={{ animationDelay: '1500ms' }}>
              <span className="scan-info">→</span>
              <span>Running content authenticity checks...</span>
            </div>
            <div className="scan-line anim-fade" style={{ animationDelay: '1900ms' }}>
              <span className="scan-info">→</span>
              <span>Computing trust score...</span>
            </div>
            <div className="scan-line anim-fade blink" style={{ animationDelay: '2200ms' }}>
              <span className="scan-cursor">▌</span>
            </div>
          </div>
          <div className="scan-bar-container">
            <div className="scan-progress-bar" />
          </div>
        </div>
      </div>
    </div>
  );
}
