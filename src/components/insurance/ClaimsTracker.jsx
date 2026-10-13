import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatINR, formatDate } from '../../lib/format';
import Badge from '../ui/Badge';

const statusConfig = {
  settled:    { label: 'Settled',    color: 'green',  icon: 'check-circle' },
  processing: { label: 'Processing', color: 'cyan',   icon: 'spinner' },
  rejected:   { label: 'Rejected',   color: 'red',    icon: 'times-circle' },
  submitted:  { label: 'Submitted',  color: 'purple', icon: 'paper-plane' },
};

const ClaimsTracker = ({ claims }) => {
  const [selectedClaim, setSelectedClaim] = useState(null);

  return (
    <div className="claims-tracker">
      <div className="claims-list">
        {claims.map(claim => {
          const s = statusConfig[claim.status] || statusConfig.processing;
          return (
            <div
              key={claim.id}
              className={`claim-row ${selectedClaim?.id === claim.id ? 'claim-row--active' : ''}`}
              onClick={() => setSelectedClaim(claim.id === selectedClaim?.id ? null : claim)}
            >
              <div className={`claim-status-dot claim-status-dot--${s.color}`}>
                <FontAwesomeIcon icon={s.icon} spin={claim.status === 'processing'} />
              </div>
              <div className="claim-info">
                <div className="claim-top-row">
                  <strong className="claim-no">{claim.claimNo}</strong>
                  <span className={`status-pill status-pill--${s.color}`}>{s.label}</span>
                </div>
                <span className="claim-sub">
                  {claim.type} · {claim.hospital || claim.garage || 'Vehicle Repair'} · {formatDate(claim.admissionDate || claim.incidentDate)}
                </span>
                <div className="claim-amounts">
                  <span>Claimed: <strong>{formatINR(claim.claimAmount)}</strong></span>
                  {claim.approvedAmount && (
                    <span>Approved: <strong className="text-success">{formatINR(claim.approvedAmount)}</strong></span>
                  )}
                </div>
              </div>
              <FontAwesomeIcon icon={selectedClaim?.id === claim.id ? 'angle-up' : 'angle-down'} className="claim-chevron" />
            </div>
          );
        })}
      </div>

      {/* Claim detail panel */}
      {selectedClaim && (
        <div className="claim-detail-panel">
          <h4>Claim Timeline</h4>
          <div className="claim-timeline">
            {[
              { label: 'Claim Submitted', date: selectedClaim.admissionDate || selectedClaim.incidentDate, done: true },
              { label: 'Documents Verified', date: null, done: selectedClaim.status !== 'submitted' },
              { label: 'Under Assessment', date: null, done: selectedClaim.status === 'settled' || selectedClaim.status === 'rejected' },
              { label: 'Settled', date: selectedClaim.settledDate, done: selectedClaim.status === 'settled' },
            ].map((tl, i) => (
              <div key={i} className={`timeline-step ${tl.done ? 'done' : ''}`}>
                <div className="timeline-dot">
                  {tl.done ? <FontAwesomeIcon icon="check" /> : <span>{i + 1}</span>}
                </div>
                <div className="timeline-content">
                  <span className="timeline-label">{tl.label}</span>
                  {tl.date && <span className="timeline-date">{formatDate(tl.date)}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClaimsTracker;
