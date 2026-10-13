import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatINR, formatPercent } from '../../lib/format';
import Badge from '../ui/Badge';
import Modal from '../ui/Modal';
import Stepper from '../ui/Stepper';

const wizardSteps = [
  { id: 'amount', title: 'Loan Amount', subtitle: 'Set your need' },
  { id: 'offer', title: 'Choose Offer', subtitle: 'Pick a lender' },
  { id: 'docs', title: 'Documents', subtitle: 'Upload KYC' },
  { id: 'confirm', title: 'Confirm', subtitle: 'Review & submit' },
];

const docList = [
  { id: 'pan', label: 'PAN Card', icon: 'id-card', uploaded: true },
  { id: 'aadhaar', label: 'Aadhaar Card', icon: 'id-card', uploaded: true },
  { id: 'salary', label: 'Last 3 months salary slips', icon: 'file-alt', uploaded: false },
  { id: 'bank', label: 'Bank statement (6 months)', icon: 'file-alt', uploaded: false },
];

const LoanWizard = ({ offers }) => {
  const [step, setStep] = useState(0);
  const [amount, setAmount] = useState(500000);
  const [tenure, setTenure] = useState(36);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [docs, setDocs] = useState(docList);
  const [submitted, setSubmitted] = useState(false);

  const emi = selectedOffer
    ? Math.round((amount * (selectedOffer.minRate / 12 / 100) * Math.pow(1 + selectedOffer.minRate / 12 / 100, tenure)) /
        (Math.pow(1 + selectedOffer.minRate / 12 / 100, tenure) - 1))
    : null;

  const toggleDoc = (id) => {
    setDocs(prev => prev.map(d => d.id === id ? { ...d, uploaded: !d.uploaded } : d));
  };

  const canProceed = () => {
    if (step === 0) return amount >= 50000;
    if (step === 1) return !!selectedOffer;
    if (step === 2) return docs.filter(d => d.uploaded).length >= 2;
    return true;
  };

  if (submitted) {
    return (
      <div className="wizard-success">
        <div className="success-icon"><FontAwesomeIcon icon="check-circle" /></div>
        <h3>Application Submitted!</h3>
        <p>Your loan application has been submitted successfully. You will receive a decision within 24 hours.</p>
        <div className="success-ref">Ref: LNAPP-{Math.random().toString(36).substr(2, 8).toUpperCase()}</div>
        <button className="btn btn-primary" onClick={() => { setStep(0); setSubmitted(false); }}>
          Apply Again
        </button>
      </div>
    );
  }

  return (
    <div className="loan-wizard">
      <Stepper steps={wizardSteps} currentStep={step} onStepClick={setStep} />

      <div className="wizard-body">
        {/* Step 0: Amount */}
        {step === 0 && (
          <div className="wizard-step">
            <h3>How much do you need?</h3>
            <div className="amount-display">{formatINR(amount)}</div>
            <input
              type="range"
              min={50000} max={5000000} step={50000}
              value={amount}
              onChange={e => setAmount(Number(e.target.value))}
              className="amount-slider"
              id="loan-amount-slider"
            />
            <div className="slider-labels">
              <span>₹50K</span><span>₹50L</span>
            </div>
            <div className="tenure-grid">
              {[12, 24, 36, 48, 60].map(t => (
                <button
                  key={t}
                  className={`tenure-btn ${tenure === t ? 'active' : ''}`}
                  onClick={() => setTenure(t)}
                >
                  {t} mo
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Choose Offer */}
        {step === 1 && (
          <div className="wizard-step">
            <h3>Select a Loan Offer</h3>
            <div className="offer-list">
              {offers.filter(o => o.eligible).map(offer => (
                <div
                  key={offer.id}
                  className={`offer-card ${selectedOffer?.id === offer.id ? 'offer-card--selected' : ''}`}
                  onClick={() => setSelectedOffer(offer)}
                >
                  <div className="offer-card-top">
                    <span className="offer-logo">{offer.logo}</span>
                    <div className="offer-info">
                      <strong>{offer.bank}</strong>
                      <span>{formatPercent(offer.minRate)} p.a.</span>
                    </div>
                    {offer.badge && <Badge label={offer.badge} color={offer.badgeColor} />}
                    {offer.preApproved && <span className="pre-approved-tag">Pre-approved</span>}
                    {selectedOffer?.id === offer.id && (
                      <div className="offer-selected-mark"><FontAwesomeIcon icon="check-circle" /></div>
                    )}
                  </div>
                  <div className="offer-card-stats">
                    <div>
                      <span>EMI ~</span>
                      <strong>{formatINR(Math.round((amount * (offer.minRate / 12 / 100) * Math.pow(1 + offer.minRate / 12 / 100, tenure)) / (Math.pow(1 + offer.minRate / 12 / 100, tenure) - 1)))}/mo</strong>
                    </div>
                    <div>
                      <span>Processing</span>
                      <strong>{offer.processingFee}%</strong>
                    </div>
                    <div>
                      <span>Max Tenure</span>
                      <strong>{offer.maxTenure} mo</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Documents */}
        {step === 2 && (
          <div className="wizard-step">
            <h3>Upload Documents</h3>
            <div className="doc-list">
              {docs.map(doc => (
                <div key={doc.id} className={`doc-row ${doc.uploaded ? 'doc-row--uploaded' : ''}`}>
                  <FontAwesomeIcon icon={doc.uploaded ? 'check-circle' : 'file-alt'} className="doc-icon" />
                  <span className="doc-label">{doc.label}</span>
                  <button
                    className={`doc-upload-btn ${doc.uploaded ? 'uploaded' : ''}`}
                    onClick={() => toggleDoc(doc.id)}
                  >
                    {doc.uploaded ? 'Uploaded ✓' : 'Upload'}
                  </button>
                </div>
              ))}
            </div>
            <p className="doc-note"><FontAwesomeIcon icon="lock" /> Your documents are encrypted & secure</p>
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && selectedOffer && (
          <div className="wizard-step">
            <h3>Review & Confirm</h3>
            <div className="confirm-summary">
              <div className="confirm-row"><span>Lender</span><strong>{selectedOffer.bank}</strong></div>
              <div className="confirm-row"><span>Loan Amount</span><strong>{formatINR(amount)}</strong></div>
              <div className="confirm-row"><span>Interest Rate</span><strong>{formatPercent(selectedOffer.minRate)} p.a.</strong></div>
              <div className="confirm-row"><span>Tenure</span><strong>{tenure} months</strong></div>
              <div className="confirm-row"><span>Monthly EMI</span><strong className="text-accent">{formatINR(emi)}</strong></div>
              <div className="confirm-row"><span>Processing Fee</span><strong>{formatINR(amount * selectedOffer.processingFee / 100)}</strong></div>
              <div className="confirm-row confirm-row--total">
                <span>Total Repayment</span>
                <strong>{formatINR(emi * tenure)}</strong>
              </div>
            </div>
            <label className="consent-check">
              <input type="checkbox" id="loan-consent" />
              I agree to the Terms & Conditions and consent to credit bureau enquiry
            </label>
          </div>
        )}
      </div>

      <div className="wizard-nav">
        {step > 0 && (
          <button className="btn btn-secondary" onClick={() => setStep(s => s - 1)}>
            <FontAwesomeIcon icon="arrow-left" /> Back
          </button>
        )}
        <button
          className="btn btn-primary"
          onClick={() => step < 3 ? setStep(s => s + 1) : setSubmitted(true)}
          disabled={!canProceed()}
        >
          {step === 3 ? 'Submit Application' : 'Continue'}
          <FontAwesomeIcon icon={step === 3 ? 'check' : 'arrow-right'} />
        </button>
      </div>
    </div>
  );
};

export default LoanWizard;
