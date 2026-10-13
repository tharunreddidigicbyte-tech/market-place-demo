import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { creditCards, marketplaceCards, transactions, spendCategories } from '../data/cards';
import { formatINR } from '../lib/format';
import CardCarousel from '../components/cards/CardCarousel';
import TransactionTable from '../components/cards/TransactionTable';
import MarketplaceGrid from '../components/cards/MarketplaceGrid';
import Footer from '../components/layout/Footer';

const tabs = ['My Cards', 'Transactions', 'Marketplace', 'Rewards'];

const CreditCards = () => {
  const [activeTab, setActiveTab] = useState('My Cards');

  const totalCashback = creditCards.reduce((s, c) => s + c.cashback, 0);
  const totalPoints = creditCards.reduce((s, c) => s + c.rewardPoints, 0);

  return (
    <div className="page">
      {/* ── Tab nav ── */}
      <div className="page-tabs">
        {tabs.map(t => (
          <button
            key={t}
            className={`page-tab ${activeTab === t ? 'page-tab--active' : ''}`}
            onClick={() => setActiveTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── My Cards Tab ── */}
      {activeTab === 'My Cards' && (
        <div className="tab-content">
          <CardCarousel cards={creditCards} />

          {/* All cards quick view */}
          <div className="cards-quick-list">
            {creditCards.map(c => (
              <div key={c.id} className="cards-quick-row">
                <div className="cards-quick-visual" style={{ background: c.gradient }}>
                  <span>{c.bank.split(' ')[0]}</span>
                </div>
                <div className="cards-quick-info">
                  <strong>{c.name}</strong>
                  <span>{c.numberMask} · {c.tier}</span>
                </div>
                <div className="cards-quick-due">
                  <strong>{formatINR(c.totalDue)}</strong>
                  <span>Due {c.dueDate}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Spend breakdown */}
          <div className="spend-breakdown">
            <h3 className="section-sub-title">Spend Breakdown (This Month)</h3>
            <div className="spend-bars">
              {spendCategories.map(cat => (
                <div key={cat.category} className="spend-bar-row">
                  <div className="spend-bar-label">
                    <span>{cat.category}</span>
                    <span>{formatINR(cat.amount)}</span>
                  </div>
                  <div className="spend-bar-track">
                    <div
                      className="spend-bar-fill"
                      style={{ width: `${cat.pct}%`, background: cat.color }}
                    />
                  </div>
                  <span className="spend-bar-pct">{cat.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Transactions Tab ── */}
      {activeTab === 'Transactions' && (
        <div className="tab-content">
          <TransactionTable
            transactions={transactions}
            title="All Card Transactions"
          />
        </div>
      )}

      {/* ── Marketplace Tab ── */}
      {activeTab === 'Marketplace' && (
        <div className="tab-content">
          <MarketplaceGrid cards={marketplaceCards} />
        </div>
      )}

      {/* ── Rewards Tab ── */}
      {activeTab === 'Rewards' && (
        <div className="tab-content">
          <div className="rewards-hero">
            <div className="rewards-hero-icon"><FontAwesomeIcon icon="trophy" /></div>
            <div>
              <h3>Total Reward Points</h3>
              <div className="rewards-pts-big">{totalPoints.toLocaleString('en-IN')} pts</div>
              <span>≈ {formatINR(Math.round(totalPoints * 0.25))} value</span>
            </div>
          </div>

          <div className="rewards-cashback">
            <div className="cashback-chip">
              <FontAwesomeIcon icon="piggy-bank" />
              <div>
                <span>Total Cashback Earned</span>
                <strong>{formatINR(totalCashback)}</strong>
              </div>
            </div>
          </div>

          {/* Points per card */}
          <div className="rewards-card-list">
            {creditCards.map(c => (
              <div key={c.id} className="rewards-card-row">
                <div className="rewards-card-visual" style={{ background: c.gradient }}>
                  {c.bank.split(' ')[0]}
                </div>
                <div className="rewards-card-info">
                  <strong>{c.name}</strong>
                  <span>{c.rewardPoints.toLocaleString('en-IN')} pts · ₹{c.cashback} cashback</span>
                </div>
                <button className="redeem-btn">Redeem <FontAwesomeIcon icon="gift" /></button>
              </div>
            ))}
          </div>

          {/* Offers */}
          <h3 className="section-sub-title">Redeem Rewards At</h3>
          <div className="redeem-grid">
            {['Amazon', 'Flipkart', 'Zomato', 'Swiggy', 'BookMyShow', 'Myntra', 'Uber', 'IRCTC'].map(brand => (
              <button key={brand} className="redeem-brand-btn">{brand}</button>
            ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default CreditCards;
