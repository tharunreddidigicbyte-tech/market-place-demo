import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { insurancePlans, myPolicies, myClaims } from '../data/insurance';
import { formatINR, formatDate } from '../lib/format';
import QuoteList from '../components/insurance/QuoteList';
import ProposalStepper from '../components/insurance/ProposalStepper';
import ClaimsTracker from '../components/insurance/ClaimsTracker';
import Modal from '../components/ui/Modal';
import Footer from '../components/layout/Footer';

const tabs = ['My Policies', 'Explore Plans', 'Claims'];

const categoryIcons = { health: 'heart', term: 'shield-alt', motor: 'car', travel: 'plane' };

const Insurance = () => {
  const [activeTab, setActiveTab] = useState('My Policies');
  const [selectedPlan, setSelectedPlan] = useState(null);

  const totalCoverage = myPolicies.reduce((s, p) => s + p.sumInsured, 0);
  const totalPremium = myPolicies.reduce((s, p) => s + p.premium, 0);

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setActiveTab('Explore Plans');
  };

  return (
    <div className="page">
      {/* ── Summary bar ── */}
      <div className="insurance-summary-bar">
        <div className="ins-summary-stat">
          <FontAwesomeIcon icon="shield-alt" />
          <div>
            <strong>{myPolicies.length} Active Policies</strong>
            <span>Fully protected</span>
          </div>
        </div>
        <div className="ins-summary-stat">
          <FontAwesomeIcon icon="rupee-sign" />
          <div>
            <strong>{formatINR(totalCoverage, true)}</strong>
            <span>Total Coverage</span>
          </div>
        </div>
        <div className="ins-summary-stat">
          <FontAwesomeIcon icon="calendar" />
          <div>
            <strong>{formatINR(totalPremium)}</strong>
            <span>Annual Premium</span>
          </div>
        </div>
      </div>

      <div className="page-tabs">
        {tabs.map(t => (
          <button
            key={t}
            className={`page-tab ${activeTab === t ? 'page-tab--active' : ''}`}
            onClick={() => setActiveTab(t)}
          >
            {t}
            {t === 'Claims' && myClaims.filter(c => c.status === 'processing').length > 0 && (
              <span className="tab-badge">{myClaims.filter(c => c.status === 'processing').length}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── My Policies ── */}
      {activeTab === 'My Policies' && (
        <div className="tab-content">
          <div className="policies-list">
            {myPolicies.map(policy => {
              const plan = insurancePlans.find(p => p.id === policy.planId);
              const daysToRenewal = Math.round((new Date(policy.nextRenewal) - new Date()) / (1000 * 60 * 60 * 24));
              return (
                <div key={policy.id} className="policy-card">
                  <div className="policy-card-header">
                    <div className="policy-icon-wrap">
                      <FontAwesomeIcon icon={categoryIcons[plan?.category] || 'shield-alt'} />
                    </div>
                    <div className="policy-info">
                      <span className="policy-type">{policy.type}</span>
                      <h4>{policy.insurer} — {policy.name}</h4>
                      <span className="policy-no">{policy.policyNo}</span>
                    </div>
                    <span className="policy-status-badge">
                      <FontAwesomeIcon icon="check-circle" /> Active
                    </span>
                  </div>

                  <div className="policy-details-grid">
                    <div className="policy-detail">
                      <span>Sum Insured</span>
                      <strong>{formatINR(policy.sumInsured, true)}</strong>
                    </div>
                    <div className="policy-detail">
                      <span>Premium</span>
                      <strong>{formatINR(policy.premium)}/yr</strong>
                    </div>
                    <div className="policy-detail">
                      <span>Valid Till</span>
                      <strong>{formatDate(policy.endDate)}</strong>
                    </div>
                    <div className="policy-detail">
                      <span>Renewal In</span>
                      <strong className={daysToRenewal < 90 ? 'text-warn' : 'text-success'}>
                        {daysToRenewal} days
                      </strong>
                    </div>
                  </div>

                  <div className="policy-members">
                    <FontAwesomeIcon icon="user" />
                    {policy.members.join(' · ')}
                  </div>

                  <div className="policy-actions">
                    <button className="btn btn-secondary btn-sm">
                      <FontAwesomeIcon icon="download" /> Download
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setActiveTab('Claims')}
                    >
                      <FontAwesomeIcon icon="file-alt" /> File Claim
                    </button>
                    <button className="btn btn-primary btn-sm">
                      <FontAwesomeIcon icon="sync-alt" /> Renew
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Explore Plans ── */}
      {activeTab === 'Explore Plans' && (
        <div className="tab-content">
          {selectedPlan ? (
            <>
              <button className="back-btn" onClick={() => setSelectedPlan(null)}>
                <FontAwesomeIcon icon="arrow-left" /> Back to Plans
              </button>
              <ProposalStepper plan={selectedPlan} onClose={() => setSelectedPlan(null)} />
            </>
          ) : (
            <QuoteList plans={insurancePlans} onSelect={setSelectedPlan} />
          )}
        </div>
      )}

      {/* ── Claims ── */}
      {activeTab === 'Claims' && (
        <div className="tab-content">
          <div className="claims-header">
            <h3 className="section-sub-title">Claims History</h3>
            <button className="btn btn-primary btn-sm">
              <FontAwesomeIcon icon="plus" /> File New Claim
            </button>
          </div>
          <ClaimsTracker claims={myClaims} />
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Insurance;
