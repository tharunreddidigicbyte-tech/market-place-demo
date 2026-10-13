import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatINR, formatPercent } from '../lib/format';
import { creditCards, spendCategories, transactions } from '../data/cards';
import { activeLoans } from '../data/loans';
import { myPolicies } from '../data/insurance';
import Footer from '../components/layout/Footer';

const netWorth = 8420000;
const monthlyIncome = 185000;
const monthlyExpense = 97400;
const monthlySavings = monthlyIncome - monthlyExpense;

const creditScore = 782;
const scoreLabel = creditScore >= 750 ? 'Excellent' : creditScore >= 700 ? 'Good' : creditScore >= 650 ? 'Fair' : 'Poor';
const scoreColor = creditScore >= 750 ? '#10b981' : creditScore >= 700 ? '#f59e0b' : '#ef4444';

const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
const incomeData = [175000, 185000, 185000, 192000, 185000, 185000];
const expenseData = [98000, 87000, 112000, 95000, 89000, 97400];

const Overview = () => {
  const totalAssets = netWorth;
  const totalLiabilities = activeLoans.reduce((s, l) => s + l.outstanding, 0) +
    creditCards.reduce((s, c) => s + c.used, 0);
  const netWorthCalc = totalAssets - totalLiabilities;

  const maxBar = Math.max(...incomeData, ...expenseData);

  return (
    <div className="page overview-page">
      {/* ── Credit Score ── */}
      <section className="overview-section credit-score-section">
        <h3 className="section-title">Credit Score</h3>
        <div className="credit-score-card">
          <div className="score-gauge-wrap">
            <svg viewBox="0 0 200 110" className="score-gauge">
              <defs>
                <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="40%" stopColor="#f59e0b" />
                  <stop offset="80%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
              {/* Background arc */}
              <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#1e293b" strokeWidth="14" strokeLinecap="round" />
              {/* Score arc */}
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="url(#scoreGrad)"
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray={`${((creditScore - 300) / 600) * 251} 251`}
              />
              {/* Score text */}
              <text x="100" y="90" textAnchor="middle" className="score-number" fill={scoreColor} fontSize="28" fontWeight="700">{creditScore}</text>
              <text x="100" y="106" textAnchor="middle" fill={scoreColor} fontSize="11" fontWeight="600">{scoreLabel}</text>
            </svg>
          </div>
          <div className="score-details">
            <div className="score-factor">
              <span>Payment History</span>
              <div className="score-factor-bar">
                <div className="score-factor-fill" style={{ width: '95%', background: '#10b981' }} />
              </div>
              <span className="text-success">Excellent</span>
            </div>
            <div className="score-factor">
              <span>Credit Utilization</span>
              <div className="score-factor-bar">
                <div className="score-factor-fill" style={{ width: '27%', background: '#10b981' }} />
              </div>
              <span className="text-success">27%</span>
            </div>
            <div className="score-factor">
              <span>Credit Age</span>
              <div className="score-factor-bar">
                <div className="score-factor-fill" style={{ width: '65%', background: '#f59e0b' }} />
              </div>
              <span className="text-warn">4.5 yrs</span>
            </div>
            <div className="score-factor">
              <span>Enquiries</span>
              <div className="score-factor-bar">
                <div className="score-factor-fill" style={{ width: '80%', background: '#10b981' }} />
              </div>
              <span className="text-success">Low</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Net Worth ── */}
      <section className="overview-section">
        <h3 className="section-title">Net Worth Summary</h3>
        <div className="net-worth-grid">
          <div className="nw-card nw-card--asset">
            <FontAwesomeIcon icon="arrow-up" />
            <div>
              <span>Total Assets</span>
              <strong>{formatINR(totalAssets, true)}</strong>
            </div>
          </div>
          <div className="nw-card nw-card--liability">
            <FontAwesomeIcon icon="arrow-down" />
            <div>
              <span>Total Liabilities</span>
              <strong>{formatINR(totalLiabilities, true)}</strong>
            </div>
          </div>
          <div className="nw-card nw-card--net">
            <FontAwesomeIcon icon="chart-line" />
            <div>
              <span>Net Worth</span>
              <strong className="text-success">{formatINR(netWorthCalc, true)}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* ── Income vs Expense Chart ── */}
      <section className="overview-section">
        <h3 className="section-title">Income vs Expense (6 Months)</h3>
        <div className="bar-chart">
          {months.map((month, i) => (
            <div key={month} className="bar-chart-group">
              <div className="bar-chart-bars">
                <div className="bar-wrap">
                  <div
                    className="bar bar--income"
                    style={{ height: `${(incomeData[i] / maxBar) * 160}px` }}
                    title={`Income: ${formatINR(incomeData[i])}`}
                  />
                </div>
                <div className="bar-wrap">
                  <div
                    className="bar bar--expense"
                    style={{ height: `${(expenseData[i] / maxBar) * 160}px` }}
                    title={`Expense: ${formatINR(expenseData[i])}`}
                  />
                </div>
              </div>
              <span className="bar-label">{month}</span>
            </div>
          ))}
          <div className="bar-chart-legend">
            <span className="legend-item"><span className="legend-dot legend-dot--income" /> Income</span>
            <span className="legend-item"><span className="legend-dot legend-dot--expense" /> Expense</span>
          </div>
        </div>
        <div className="income-summary-row">
          <div className="income-chip">
            <FontAwesomeIcon icon="arrow-up" className="text-success" />
            <div><span>Avg Income</span><strong>{formatINR(Math.round(incomeData.reduce((a, b) => a + b) / 6))}</strong></div>
          </div>
          <div className="income-chip">
            <FontAwesomeIcon icon="arrow-down" className="text-danger" />
            <div><span>Avg Expense</span><strong>{formatINR(Math.round(expenseData.reduce((a, b) => a + b) / 6))}</strong></div>
          </div>
          <div className="income-chip">
            <FontAwesomeIcon icon="piggy-bank" className="text-success" />
            <div><span>Savings Rate</span><strong>{formatPercent((monthlySavings / monthlyIncome) * 100)}</strong></div>
          </div>
        </div>
      </section>

      {/* ── Spend by Category Donut ── */}
      <section className="overview-section">
        <h3 className="section-title">Spend by Category</h3>
        <div className="category-breakdown">
          {spendCategories.map(cat => (
            <div key={cat.category} className="cat-row">
              <div className="cat-dot" style={{ background: cat.color }} />
              <span className="cat-name">{cat.category}</span>
              <div className="cat-bar-track">
                <div className="cat-bar-fill" style={{ width: `${cat.pct}%`, background: cat.color }} />
              </div>
              <span className="cat-pct">{cat.pct}%</span>
              <span className="cat-amount">{formatINR(cat.amount)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Quick Portfolio ── */}
      <section className="overview-section">
        <h3 className="section-title">Portfolio at a Glance</h3>
        <div className="portfolio-grid">
          <div className="portfolio-item">
            <FontAwesomeIcon icon="credit-card" className="portfolio-icon" />
            <span>{creditCards.length} Credit Cards</span>
            <strong>{formatINR(creditCards.reduce((s, c) => s + c.limit, 0), true)} limit</strong>
          </div>
          <div className="portfolio-item">
            <FontAwesomeIcon icon="hand-holding-usd" className="portfolio-icon" />
            <span>{activeLoans.length} Active Loans</span>
            <strong>{formatINR(activeLoans.reduce((s, l) => s + l.outstanding, 0), true)} outstanding</strong>
          </div>
          <div className="portfolio-item">
            <FontAwesomeIcon icon="shield-alt" className="portfolio-icon" />
            <span>{myPolicies.length} Policies</span>
            <strong>{formatINR(myPolicies.reduce((s, p) => s + p.sumInsured, 0), true)} coverage</strong>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Overview;
