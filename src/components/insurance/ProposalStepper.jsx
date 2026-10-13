import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatINR, formatDate } from '../../lib/format';
import Badge from '../ui/Badge';
import Stepper from '../ui/Stepper';

const proposalSteps = [
  { id: 'details', title: 'Personal Details', subtitle: 'Who to cover' },
  { id: 'plan', title: 'Plan Details', subtitle: 'Coverage options' },
  { id: 'medical', title: 'Medical Info', subtitle: 'Health history' },
  { id: 'payment', title: 'Payment', subtitle: 'Premium & pay' },
];

const ProposalStepper = ({ plan, onClose }) => {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const [details, setDetails] = useState({
    name: 'Ravi Kumar', dob: '1988-05-14', mobile: '9876543210', email: 'ravi@example.com',
    pincode: '500001',
  });

  const [coverageOption, setCoverageOption] = useState('1x');
  const multiplier = coverageOption === '2x' ? 2 : coverageOption === '0.5x' ? 0.5 : 1;
  const finalPremium = Math.round(plan.premium * multiplier);
  const finalSumInsured = Math.round(plan.sumInsured * multiplier);

  if (submitted) {
    return (
      <div className="wizard-success">
        <div className="success-icon"><FontAwesomeIcon icon="shield-alt" /></div>
        <h3>Proposal Submitted!</h3>
        <p>Your insurance proposal for <strong>{plan.name}</strong> from <strong>{plan.insurer}</strong> has been submitted.</p>
        <div className="success-ref">Proposal No: PROP-{Math.random().toString(36).substr(2, 8).toUpperCase()}</div>
        <button className="btn btn-primary" onClick={onClose}>Done</button>
      </div>
    );
  }

  return (
    <div className="proposal-stepper">
      <Stepper steps={proposalSteps} currentStep={step} onStepClick={setStep} />

      <div className="wizard-body">
        {step === 0 && (
          <div className="wizard-step">
            <h3>Personal & Contact Details</h3>
            <div className="form-grid">
              {['name', 'dob', 'mobile', 'email', 'pincode'].map(field => (
                <div key={field} className="form-field">
                  <label htmlFor={`proposal-${field}`}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                  <input
                    id={`proposal-${field}`}
                    type={field === 'email' ? 'email' : field === 'dob' ? 'date' : 'text'}
                    value={details[field]}
                    onChange={e => setDetails(p => ({ ...p, [field]: e.target.value }))}
                    className="form-input"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="wizard-step">
            <h3>Coverage Options</h3>
            <div className="coverage-options">
              {[
                { id: '0.5x', label: '0.5x Coverage', si: plan.sumInsured * 0.5, premium: plan.premium * 0.5 },
                { id: '1x', label: '1x Coverage (Standard)', si: plan.sumInsured, premium: plan.premium },
                { id: '2x', label: '2x Coverage (Enhanced)', si: plan.sumInsured * 2, premium: plan.premium * 2 },
              ].map(opt => (
                <div
                  key={opt.id}
                  className={`coverage-option ${coverageOption === opt.id ? 'active' : ''}`}
                  onClick={() => setCoverageOption(opt.id)}
                >
                  <div className="coverage-option-top">
                    <strong>{opt.label}</strong>
                    {opt.id === '1x' && <Badge label="Most Popular" color="gold" />}
                  </div>
                  <div>Sum Insured: <strong>{formatINR(opt.si, true)}</strong></div>
                  <div>Premium: <strong className="text-accent">{formatINR(Math.round(opt.premium))}/yr</strong></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="wizard-step">
            <h3>Medical Information</h3>
            <div className="medical-questions">
              {[
                'Do you have diabetes?',
                'Do you have hypertension?',
                'Any pre-existing conditions?',
                'Have you been hospitalized in last 2 years?',
                'Do you smoke or consume tobacco?',
              ].map((q, i) => (
                <div key={i} className="medical-q">
                  <span>{q}</span>
                  <div className="yes-no-btns">
                    <button className="yes-no-btn">Yes</button>
                    <button className="yes-no-btn yes-no-btn--active">No</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="wizard-step">
            <h3>Payment Summary</h3>
            <div className="confirm-summary">
              <div className="confirm-row"><span>Plan</span><strong>{plan.name}</strong></div>
              <div className="confirm-row"><span>Insurer</span><strong>{plan.insurer}</strong></div>
              <div className="confirm-row"><span>Sum Insured</span><strong>{formatINR(finalSumInsured, true)}</strong></div>
              <div className="confirm-row"><span>Base Premium</span><strong>{formatINR(finalPremium)}</strong></div>
              <div className="confirm-row"><span>GST (18%)</span><strong>{formatINR(Math.round(finalPremium * 0.18))}</strong></div>
              <div className="confirm-row confirm-row--total">
                <span>Total Payable</span>
                <strong className="text-accent">{formatINR(Math.round(finalPremium * 1.18))}</strong>
              </div>
            </div>
            <div className="payment-methods">
              {['UPI', 'Net Banking', 'Credit Card', 'Debit Card'].map(m => (
                <button key={m} className="payment-method-btn">{m}</button>
              ))}
            </div>
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
        >
          {step === 3 ? `Pay ${formatINR(Math.round(finalPremium * 1.18))}` : 'Continue'}
          <FontAwesomeIcon icon={step === 3 ? 'lock' : 'arrow-right'} />
        </button>
      </div>
    </div>
  );
};

export default ProposalStepper;
