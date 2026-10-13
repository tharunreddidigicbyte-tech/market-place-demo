import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { loanOffers, homeLoanOffers, activeLoans, emiSchedule } from '../data/loans';
import { formatINR, formatPercent, formatDate } from '../lib/format';
import LoanWizard from '../components/loans/LoanWizard';
import EmiTable from '../components/loans/EmiTable';
import PrepaySimulator from '../components/loans/PrepaySimulator';
import Footer from '../components/layout/Footer';

const tabs = ['My Loans', 'Apply', 'EMI Schedule', 'Prepayment'];
const loanTypeOptions = ['Personal', 'Home'];

const Loans = () => {
  const [activeTab, setActiveTab] = useState('My Loans');
  const [loanType, setLoanType] = useState('Personal');
  const [activeLoanIdx, setActiveLoanIdx] = useState(0);

  const offers = loanType === 'Personal' ? loanOffers : homeLoanOffers;
  const selectedLoan = activeLoans[activeLoanIdx];

  return (
    <div className="page">
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

      {/* ── My Loans ── */}
      {activeTab === 'My Loans' && (
        <div className="tab-content">
          <div className="my-loans-grid">
            {activeLoans.map((loan, i) => {
              const pct = Math.round((loan.completedEmis / loan.totalEmis) * 100);
              return (
                <div key={loan.id} className="my-loan-card">
                  <div className="loan-card-header">
                    <div>
                      <span className="loan-type-badge">{loan.type}</span>
                      <h4>{loan.bank}</h4>
                      <span className="loan-account-no">{loan.accountNo}</span>
                    </div>
                    <div className="loan-status-badge">
                      <FontAwesomeIcon icon="check-circle" /> Active
                    </div>
                  </div>

                  <div className="loan-key-figures">
                    <div className="loan-figure">
                      <span>Outstanding</span>
                      <strong className="text-warn">{formatINR(loan.outstanding, true)}</strong>
                    </div>
                    <div className="loan-figure">
                      <span>EMI</span>
                      <strong>{formatINR(loan.emi)}/mo</strong>
                    </div>
                    <div className="loan-figure">
                      <span>Rate</span>
                      <strong>{formatPercent(loan.rate)}</strong>
                    </div>
                    <div className="loan-figure">
                      <span>Next Due</span>
                      <strong>{loan.nextEmiDate}</strong>
                    </div>
                  </div>

                  <div className="loan-progress">
                    <div className="loan-progress-header">
                      <span>EMI Progress</span>
                      <span>{loan.completedEmis}/{loan.totalEmis} paid ({pct}%)</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${pct}%`, background: '#10b981' }} />
                    </div>
                  </div>

                  <div className="loan-actions">
                    <button className="btn btn-secondary btn-sm" onClick={() => { setActiveLoanIdx(i); setActiveTab('Prepayment'); }}>
                      <FontAwesomeIcon icon="calculator" /> Prepay
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('EMI Schedule')}>
                      <FontAwesomeIcon icon="calendar" /> Schedule
                    </button>
                    <button className="btn btn-primary btn-sm">
                      <FontAwesomeIcon icon="rupee-sign" /> Pay EMI
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Apply ── */}
      {activeTab === 'Apply' && (
        <div className="tab-content">
          {/* Loan type toggle */}
          <div className="loan-type-toggle">
            {loanTypeOptions.map(t => (
              <button
                key={t}
                className={`loan-type-btn ${loanType === t ? 'active' : ''}`}
                onClick={() => setLoanType(t)}
              >
                <FontAwesomeIcon icon={t === 'Personal' ? 'user' : 'home'} /> {t} Loan
              </button>
            ))}
          </div>

          {/* Offers summary */}
          <div className="offers-summary">
            <div className="offers-summary-stat">
              <FontAwesomeIcon icon="building" />
              <div>
                <strong>{offers.length} Lenders</strong>
                <span>available</span>
              </div>
            </div>
            <div className="offers-summary-stat">
              <FontAwesomeIcon icon="percent" />
              <div>
                <strong>{Math.min(...offers.map(o => o.minRate))}%</strong>
                <span>lowest rate</span>
              </div>
            </div>
            <div className="offers-summary-stat">
              <FontAwesomeIcon icon="bolt" />
              <div>
                <strong>{offers.filter(o => o.preApproved).length} Pre-approved</strong>
                <span>for you</span>
              </div>
            </div>
          </div>

          <LoanWizard offers={offers} />
        </div>
      )}

      {/* ── EMI Schedule ── */}
      {activeTab === 'EMI Schedule' && (
        <div className="tab-content">
          {/* Loan selector */}
          <div className="loan-selector">
            {activeLoans.map((l, i) => (
              <button
                key={l.id}
                className={`loan-selector-btn ${activeLoanIdx === i ? 'active' : ''}`}
                onClick={() => setActiveLoanIdx(i)}
              >
                {l.type} · {l.bank}
              </button>
            ))}
          </div>
          <EmiTable schedule={emiSchedule} title={`EMI Schedule — ${selectedLoan.bank} ${selectedLoan.type}`} />
        </div>
      )}

      {/* ── Prepayment ── */}
      {activeTab === 'Prepayment' && (
        <div className="tab-content">
          <div className="loan-selector">
            {activeLoans.map((l, i) => (
              <button
                key={l.id}
                className={`loan-selector-btn ${activeLoanIdx === i ? 'active' : ''}`}
                onClick={() => setActiveLoanIdx(i)}
              >
                {l.type} · {l.bank}
              </button>
            ))}
          </div>
          <PrepaySimulator loan={selectedLoan} />
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Loans;
