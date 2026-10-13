import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatINR } from '../lib/format';
import { creditCards, transactions } from '../data/cards';
import { activeLoans } from '../data/loans';
import { myPolicies } from '../data/insurance';
import TransactionTable from '../components/cards/TransactionTable';
import Footer from '../components/layout/Footer';

const quickLinks = [
  { label: 'My Cards',   icon: 'credit-card',      path: '/cards',     color: '#6366f1', bg: '#6366f120' },
  { label: 'Loans',      icon: 'hand-holding-usd', path: '/loans',     color: '#10b981', bg: '#10b98120' },
  { label: 'Insurance',  icon: 'shield-alt',        path: '/insurance', color: '#f59e0b', bg: '#f59e0b20' },
  { label: 'Overview',   icon: 'chart-pie',         path: '/overview',  color: '#ec4899', bg: '#ec489920' },
];

const totalCreditLimit = creditCards.reduce((s, c) => s + c.limit, 0);
const totalUsed = creditCards.reduce((s, c) => s + c.used, 0);
const totalOutstanding = activeLoans.reduce((s, l) => s + l.outstanding, 0);
const totalEMI = activeLoans.reduce((s, l) => s + l.emi, 0);
const totalRewardPts = creditCards.reduce((s, c) => s + c.rewardPoints, 0);

const Home = () => {
  return (
    <div className="page home-page">
      {/* ── Hero Greeting ── */}
      <section className="home-hero">
        <div className="home-hero-text">
          <h2 className="home-greeting">
            Good afternoon, <span className="gradient-text">Ravi</span> 👋
          </h2>
          <p className="home-sub">Here's your financial snapshot for today</p>
        </div>
        <div className="home-hero-date">
          <FontAwesomeIcon icon="calendar" />
          <span>Tuesday, 13 Oct 2026</span>
        </div>
      </section>

      {/* ── Key Stats ── */}
      <section className="stats-grid">
        <div className="stat-card stat-card--credit">
          <div className="stat-card-icon"><FontAwesomeIcon icon="credit-card" /></div>
          <div className="stat-card-body">
            <span className="stat-label">Total Credit Limit</span>
            <strong className="stat-value">{formatINR(totalCreditLimit)}</strong>
            <span className="stat-sub">{formatINR(totalUsed)} used · {Math.round(totalUsed / totalCreditLimit * 100)}% utilization</span>
          </div>
        </div>
        <div className="stat-card stat-card--loan">
          <div className="stat-card-icon"><FontAwesomeIcon icon="hand-holding-usd" /></div>
          <div className="stat-card-body">
            <span className="stat-label">Loan Outstanding</span>
            <strong className="stat-value">{formatINR(totalOutstanding, true)}</strong>
            <span className="stat-sub">EMI due: {formatINR(totalEMI)}/month</span>
          </div>
        </div>
        <div className="stat-card stat-card--insurance">
          <div className="stat-card-icon"><FontAwesomeIcon icon="shield-alt" /></div>
          <div className="stat-card-body">
            <span className="stat-label">Active Policies</span>
            <strong className="stat-value">{myPolicies.length}</strong>
            <span className="stat-sub">Health · Life · Motor</span>
          </div>
        </div>
        <div className="stat-card stat-card--rewards">
          <div className="stat-card-icon"><FontAwesomeIcon icon="star" /></div>
          <div className="stat-card-body">
            <span className="stat-label">Reward Points</span>
            <strong className="stat-value">{totalRewardPts.toLocaleString('en-IN')}</strong>
            <span className="stat-sub">≈ {formatINR(Math.round(totalRewardPts * 0.25))} value</span>
          </div>
        </div>
      </section>

      {/* ── Quick Links ── */}
      <section className="home-section">
        <h3 className="section-title">Quick Actions</h3>
        <div className="quick-links-grid">
          {quickLinks.map(link => (
            <Link key={link.path} to={link.path} className="quick-link" style={{ '--ql-color': link.color, '--ql-bg': link.bg }}>
              <div className="quick-link-icon">
                <FontAwesomeIcon icon={link.icon} />
              </div>
              <span>{link.label}</span>
              <FontAwesomeIcon icon="chevron-right" className="quick-link-arrow" />
            </Link>
          ))}
        </div>
      </section>

      {/* ── Upcoming EMIs / Due Dates ── */}
      <section className="home-section">
        <h3 className="section-title">Upcoming Dues</h3>
        <div className="dues-list">
          {creditCards.map(c => (
            <div key={c.id} className="due-row">
              <div className="due-icon due-icon--card"><FontAwesomeIcon icon="credit-card" /></div>
              <div className="due-info">
                <strong>{c.name}</strong>
                <span>{c.bank} · Due {c.dueDate}</span>
              </div>
              <div className="due-amount">
                <strong>{formatINR(c.minDue)}</strong>
                <span>Min due</span>
              </div>
            </div>
          ))}
          {activeLoans.map(l => (
            <div key={l.id} className="due-row">
              <div className="due-icon due-icon--loan"><FontAwesomeIcon icon="hand-holding-usd" /></div>
              <div className="due-info">
                <strong>{l.type}</strong>
                <span>{l.bank} · Due {l.nextEmiDate}</span>
              </div>
              <div className="due-amount">
                <strong>{formatINR(l.emi)}</strong>
                <span>EMI</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Recent Transactions ── */}
      <section className="home-section">
        <h3 className="section-title">Recent Transactions</h3>
        <TransactionTable
          transactions={transactions.slice(0, 20)}
          title=""
          compact
        />
        <Link to="/cards" className="view-all-link">
          View all transactions <FontAwesomeIcon icon="arrow-right" />
        </Link>
      </section>

      {/* ── Offers Banner ── */}
      <section className="home-section">
        <h3 className="section-title">Exclusive Offers for You</h3>
        <div className="offers-strip">
          {[
            { icon: '⚡', title: 'Pre-approved ₹5L Loan', sub: 'HDFC Bank · Instant disbursal', color: '#6366f1' },
            { icon: '🛡️', title: 'Save ₹3,200 on Health Cover', sub: 'Star Health · Family floater', color: '#10b981' },
            { icon: '💳', title: 'Axis Magnus — Pre-approved', sub: '12 RP per ₹200 spend', color: '#f59e0b' },
          ].map((offer, i) => (
            <div key={i} className="offer-strip-card" style={{ '--offer-color': offer.color }}>
              <span className="offer-strip-icon">{offer.icon}</span>
              <div>
                <strong>{offer.title}</strong>
                <span>{offer.sub}</span>
              </div>
              <button className="offer-strip-cta">View <FontAwesomeIcon icon="arrow-right" /></button>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
