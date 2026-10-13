import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatINR } from '../../lib/format';

// ─── CardVisual ───────────────────────────────────────────────────────────────
export const CardVisual = ({ card, flipped = false, onFlip }) => {
  const usedPct = Math.round((card.used / card.limit) * 100);

  return (
    <div className={`card-3d ${flipped ? 'card-3d--flipped' : ''}`} onClick={onFlip}>
      <div className="card-3d-inner">
        {/* Front */}
        <div className="card-face card-face--front" style={{ background: card.gradient }}>
          <div className="card-face-top">
            <div className="card-chip" />
            <div className="card-network" style={{ color: card.accentColor }}>
              {card.network}
            </div>
          </div>
          <div className="card-number">{card.numberMask}</div>
          <div className="card-face-bottom">
            <div>
              <div className="card-label">Card Holder</div>
              <div className="card-value">{card.holder}</div>
            </div>
            <div>
              <div className="card-label">Expires</div>
              <div className="card-value">{card.expiry}</div>
            </div>
            <div>
              <div className="card-label">Tier</div>
              <div className="card-value" style={{ color: card.accentColor }}>{card.tier}</div>
            </div>
          </div>
          <div className="card-bank">{card.bank}</div>
          <div className="card-bg-pattern" />
        </div>

        {/* Back */}
        <div className="card-face card-face--back" style={{ background: card.gradient }}>
          <div className="card-stripe" />
          <div className="card-cvv-row">
            <span className="card-cvv-label">CVV</span>
            <span className="card-cvv-value">•••</span>
          </div>
          <div className="card-back-limits">
            <div className="card-limit-row">
              <span>Credit Limit</span>
              <strong>{formatINR(card.limit)}</strong>
            </div>
            <div className="card-limit-row">
              <span>Available</span>
              <strong style={{ color: '#10b981' }}>{formatINR(card.available)}</strong>
            </div>
            <div className="card-limit-row">
              <span>Used</span>
              <strong style={{ color: '#f59e0b' }}>{formatINR(card.used)} ({usedPct}%)</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── CardCarousel ─────────────────────────────────────────────────────────────
const CardCarousel = ({ cards }) => {
  const [active, setActive] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const prev = () => { setActive(p => (p - 1 + cards.length) % cards.length); setFlipped(false); };
  const next = () => { setActive(p => (p + 1) % cards.length); setFlipped(false); };

  const card = cards[active];
  const usedPct = Math.round((card.used / card.limit) * 100);

  return (
    <div className="card-carousel">
      <div className="card-carousel-header">
        <button className="carousel-nav-btn" onClick={prev} aria-label="Previous card">
          <FontAwesomeIcon icon="chevron-left" />
        </button>
        <div className="card-carousel-viewer">
          <CardVisual card={card} flipped={flipped} onFlip={() => setFlipped(p => !p)} />
          <p className="card-flip-hint">
            <FontAwesomeIcon icon="sync-alt" /> Click card to flip
          </p>
        </div>
        <button className="carousel-nav-btn" onClick={next} aria-label="Next card">
          <FontAwesomeIcon icon="chevron-right" />
        </button>
      </div>

      {/* Card dots */}
      <div className="carousel-dots">
        {cards.map((_, i) => (
          <button
            key={i}
            className={`carousel-dot ${i === active ? 'active' : ''}`}
            onClick={() => { setActive(i); setFlipped(false); }}
            aria-label={`Card ${i + 1}`}
          />
        ))}
      </div>

      {/* Mini stats */}
      <div className="card-stats-row">
        <div className="card-stat-chip">
          <FontAwesomeIcon icon="rupee-sign" />
          <div>
            <span className="stat-chip-label">Total Due</span>
            <span className="stat-chip-value">{formatINR(card.totalDue)}</span>
          </div>
        </div>
        <div className="card-stat-chip">
          <FontAwesomeIcon icon="calendar" />
          <div>
            <span className="stat-chip-label">Due Date</span>
            <span className="stat-chip-value">{card.dueDate}</span>
          </div>
        </div>
        <div className="card-stat-chip">
          <FontAwesomeIcon icon="star" />
          <div>
            <span className="stat-chip-label">Reward Pts</span>
            <span className="stat-chip-value">{card.rewardPoints.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Usage bar */}
      <div className="limit-panel">
        <div className="limit-panel-row">
          <span>Credit Utilization</span>
          <span className={usedPct > 70 ? 'text-danger' : usedPct > 40 ? 'text-warn' : 'text-success'}>
            {usedPct}%
          </span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${usedPct}%`,
              background: usedPct > 70 ? '#ef4444' : usedPct > 40 ? '#f59e0b' : '#10b981',
            }}
          />
        </div>
        <div className="limit-panel-row limit-panel-amounts">
          <span>Used: {formatINR(card.used)}</span>
          <span>Limit: {formatINR(card.limit)}</span>
        </div>
      </div>
    </div>
  );
};

export default CardCarousel;
