import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatINR } from '../../lib/format';
import Badge from '../ui/Badge';
import Modal from '../ui/Modal';
import Pagination from '../ui/Pagination';
import { usePagination } from '../../hooks/usePagination';

const categoryFilters = ['All', 'travel', 'cashback', 'shopping', 'lifestyle', 'fuel'];

const MarketplaceGrid = ({ cards }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedCard, setSelectedCard] = useState(null);

  const filtered = cards.filter(c =>
    activeFilter === 'All' || c.category === activeFilter
  );

  const { paginatedItems, ...pagination } = usePagination(filtered, 6);

  return (
    <div className="marketplace-section">
      <div className="marketplace-header">
        <h3 className="section-sub-title">Cards Marketplace</h3>
        <div className="filter-pills">
          {categoryFilters.map(f => (
            <button
              key={f}
              className={`filter-pill ${activeFilter === f ? 'active' : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f === 'All' ? 'All Cards' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="marketplace-grid">
        {paginatedItems.map(card => (
          <div key={card.id} className="market-card">
            <div className="market-card-visual" style={{ background: card.gradient }}>
              {card.badge && <Badge label={card.badge} color={card.badgeColor} size="sm" />}
              {card.preApproved && <span className="pre-approved-tag">Pre-approved</span>}
              <div className="market-card-name">
                <span className="market-card-bank">{card.bank}</span>
                <span className="market-card-title">{card.name}</span>
              </div>
              <div className="market-card-network">{card.network}</div>
            </div>
            <div className="market-card-body">
              <div className="market-card-meta-row">
                <span className="market-card-rate">{card.rewardRate} rewards</span>
                <span className="market-card-fee">
                  {card.annualFee === 0 ? 'Free' : `₹${card.annualFee.toLocaleString('en-IN')}/yr`}
                </span>
              </div>
              <ul className="market-card-features">
                {card.features.slice(0, 3).map((f, i) => (
                  <li key={i}><FontAwesomeIcon icon="check" className="feature-check" />{f}</li>
                ))}
              </ul>
              <div className="market-card-rating">
                <FontAwesomeIcon icon="star" className="star-icon" />
                <span>{card.rating}</span>
                <span className="rating-count">({card.reviews.toLocaleString('en-IN')} reviews)</span>
              </div>
              <button
                className={`apply-btn ${!card.eligible ? 'apply-btn--disabled' : ''}`}
                onClick={() => card.eligible && setSelectedCard(card)}
                disabled={!card.eligible}
              >
                {card.preApproved ? '⚡ Apply Now' : card.eligible ? 'Apply Now' : 'Check Eligibility'}
                <FontAwesomeIcon icon="arrow-right" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Pagination {...pagination} />

      {/* Card Detail Modal */}
      <Modal
        isOpen={!!selectedCard}
        onClose={() => setSelectedCard(null)}
        title={selectedCard ? `${selectedCard.bank} ${selectedCard.name}` : ''}
        size="md"
        footer={
          <div className="modal-footer-btns">
            <button className="btn btn-secondary" onClick={() => setSelectedCard(null)}>Cancel</button>
            <button className="btn btn-primary">Apply Now <FontAwesomeIcon icon="arrow-right" /></button>
          </div>
        }
      >
        {selectedCard && (
          <div className="card-detail-modal">
            <div className="card-detail-visual" style={{ background: selectedCard.gradient }} />
            <div className="card-detail-grid">
              <div className="detail-item">
                <span>Annual Fee</span>
                <strong>{selectedCard.annualFee === 0 ? 'Free' : formatINR(selectedCard.annualFee)}</strong>
              </div>
              <div className="detail-item">
                <span>Joining Fee</span>
                <strong>{formatINR(selectedCard.joinFee)}</strong>
              </div>
              <div className="detail-item">
                <span>Reward Rate</span>
                <strong>{selectedCard.rewardRate}</strong>
              </div>
              <div className="detail-item">
                <span>Network</span>
                <strong>{selectedCard.network}</strong>
              </div>
            </div>
            <div className="card-detail-features">
              <h4>All Features</h4>
              <ul>
                {selectedCard.features.map((f, i) => (
                  <li key={i}><FontAwesomeIcon icon="check-circle" className="feature-check-icon" />{f}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MarketplaceGrid;
