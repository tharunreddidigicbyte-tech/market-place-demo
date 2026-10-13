import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatINR, formatDate } from '../../lib/format';
import Badge from '../ui/Badge';
import Pagination from '../ui/Pagination';
import { usePagination } from '../../hooks/usePagination';

const categoryIcons = {
  health: 'heart', term: 'shield-alt', motor: 'car', travel: 'plane',
};
const categoryLabels = {
  health: 'Health', term: 'Term Life', motor: 'Motor', travel: 'Travel',
};

const QuoteList = ({ plans, onSelect }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recommended');

  const categories = ['all', 'health', 'term', 'motor', 'travel'];

  const filtered = plans
    .filter(p => activeCategory === 'all' || p.category === activeCategory)
    .sort((a, b) => {
      if (sortBy === 'premium') return a.premium - b.premium;
      if (sortBy === 'claim') return b.claimRatio - a.claimRatio;
      if (sortBy === 'rating') return b.rating - a.rating;
      // recommended: recommended first
      return (b.recommended ? 1 : 0) - (a.recommended ? 1 : 0);
    });

  const { paginatedItems, ...pagination } = usePagination(filtered, 6);

  return (
    <div className="quote-list">
      {/* Category tabs */}
      <div className="insurance-tabs">
        {categories.map(cat => (
          <button
            key={cat}
            className={`insurance-tab ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat !== 'all' && <FontAwesomeIcon icon={categoryIcons[cat]} />}
            {cat === 'all' ? 'All Plans' : categoryLabels[cat]}
          </button>
        ))}
      </div>

      {/* Sort */}
      <div className="quote-controls">
        <span className="quote-count">{filtered.length} plans found</span>
        <select
          className="filter-select"
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          id="insurance-sort"
        >
          <option value="recommended">Recommended</option>
          <option value="premium">Lowest Premium</option>
          <option value="claim">Highest Claim Ratio</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {/* Plan cards */}
      <div className="quote-grid">
        {paginatedItems.map(plan => (
          <div key={plan.id} className={`quote-card ${plan.recommended ? 'quote-card--recommended' : ''}`}>
            {plan.recommended && <div className="recommended-ribbon">Recommended</div>}
            <div className="quote-card-header">
              <div className="quote-insurer-info">
                <span className="quote-logo">{plan.logo}</span>
                <div>
                  <strong className="quote-insurer">{plan.insurer}</strong>
                  <span className="quote-plan-name">{plan.name}</span>
                </div>
              </div>
              {plan.badge && <Badge label={plan.badge} color={plan.badgeColor} />}
            </div>

            <div className="quote-key-stats">
              <div className="quote-stat">
                <span>Sum Insured</span>
                <strong>{formatINR(plan.sumInsured, true)}</strong>
              </div>
              <div className="quote-stat">
                <span>Claim Ratio</span>
                <strong className={plan.claimRatio >= 90 ? 'text-success' : 'text-warn'}>
                  {plan.claimRatio}%
                </strong>
              </div>
              <div className="quote-stat">
                <span>Premium</span>
                <strong className="text-accent">{formatINR(plan.premium)}/{plan.premiumFreq}</strong>
              </div>
            </div>

            <ul className="quote-features">
              {plan.features.slice(0, 3).map((f, i) => (
                <li key={i}><FontAwesomeIcon icon="check" className="feature-check" />{f}</li>
              ))}
            </ul>

            <div className="quote-rating">
              {[1, 2, 3, 4, 5].map(s => (
                <FontAwesomeIcon
                  key={s}
                  icon="star"
                  className={s <= Math.round(plan.rating) ? 'star-filled' : 'star-empty'}
                />
              ))}
              <span>{plan.rating} ({plan.reviews.toLocaleString('en-IN')})</span>
            </div>

            <button className="btn btn-primary quote-cta" onClick={() => onSelect && onSelect(plan)}>
              Get Quote <FontAwesomeIcon icon="arrow-right" />
            </button>
          </div>
        ))}
      </div>

      <Pagination {...pagination} />
    </div>
  );
};

export default QuoteList;
