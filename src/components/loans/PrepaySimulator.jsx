import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatINR, calculateEMI } from '../../lib/format';

const PrepaySimulator = ({ loan }) => {
  const [prepayAmount, setPrepayAmount] = useState(100000);
  const [prepayFreq, setPrepayFreq] = useState('once');

  const originalEMI = calculateEMI(loan.outstanding, loan.rate, loan.totalEmis - loan.completedEmis);
  const remaining = loan.totalEmis - loan.completedEmis;

  // Simple savings estimate
  const interestSaved = Math.round(prepayAmount * (loan.rate / 100) * (remaining / 24));
  const monthsSaved = Math.round(prepayAmount / originalEMI);
  const newBalance = Math.max(0, loan.outstanding - prepayAmount);
  const newEMI = calculateEMI(newBalance, loan.rate, remaining - monthsSaved);

  return (
    <div className="prepay-simulator">
      <h3 className="section-sub-title">
        <FontAwesomeIcon icon="calculator" /> Prepayment Simulator
      </h3>
      <p className="prepay-desc">See how prepaying reduces your interest and tenure</p>

      <div className="prepay-controls">
        <div className="prepay-field">
          <label htmlFor="prepay-amount">Prepayment Amount</label>
          <div className="prepay-input-wrap">
            <span className="prepay-prefix">₹</span>
            <input
              id="prepay-amount"
              type="number"
              min={10000}
              max={loan.outstanding}
              step={10000}
              value={prepayAmount}
              onChange={e => setPrepayAmount(Number(e.target.value))}
              className="prepay-input"
            />
          </div>
          <input
            type="range"
            min={10000}
            max={loan.outstanding}
            step={10000}
            value={prepayAmount}
            onChange={e => setPrepayAmount(Number(e.target.value))}
            className="amount-slider"
            id="prepay-slider"
          />
        </div>

        <div className="prepay-field">
          <label>Prepayment Type</label>
          <div className="prepay-type-btns">
            {['once', 'yearly', 'monthly'].map(f => (
              <button
                key={f}
                className={`prepay-type-btn ${prepayFreq === f ? 'active' : ''}`}
                onClick={() => setPrepayFreq(f)}
              >
                {f === 'once' ? 'One Time' : f === 'yearly' ? 'Every Year' : 'Every Month'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="prepay-results">
        <div className="prepay-result-card prepay-result-card--save">
          <FontAwesomeIcon icon="piggy-bank" className="prepay-result-icon" />
          <div>
            <span className="prepay-result-label">Interest Saved</span>
            <strong className="prepay-result-value text-success">{formatINR(interestSaved)}</strong>
          </div>
        </div>
        <div className="prepay-result-card">
          <FontAwesomeIcon icon="clock" className="prepay-result-icon" />
          <div>
            <span className="prepay-result-label">Months Saved</span>
            <strong className="prepay-result-value">{monthsSaved} months</strong>
          </div>
        </div>
        <div className="prepay-result-card">
          <FontAwesomeIcon icon="rupee-sign" className="prepay-result-icon" />
          <div>
            <span className="prepay-result-label">New EMI</span>
            <strong className="prepay-result-value">{formatINR(newEMI)}/mo</strong>
          </div>
        </div>
      </div>

      <button className="btn btn-primary prepay-cta">
        <FontAwesomeIcon icon="paper-plane" /> Initiate Prepayment
      </button>
    </div>
  );
};

export default PrepaySimulator;
