import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Stepper = ({ steps, currentStep, onStepClick }) => {
  return (
    <div className="stepper">
      {steps.map((step, i) => {
        const status = i < currentStep ? 'done' : i === currentStep ? 'active' : 'pending';
        return (
          <React.Fragment key={step.id || i}>
            <button
              className={`stepper-step stepper-step--${status}`}
              onClick={() => onStepClick && status === 'done' && onStepClick(i)}
              aria-current={status === 'active' ? 'step' : undefined}
              disabled={status === 'pending'}
            >
              <div className="stepper-circle">
                {status === 'done'
                  ? <FontAwesomeIcon icon="check" />
                  : <span>{i + 1}</span>
                }
              </div>
              <div className="stepper-label">
                <span className="stepper-title">{step.title}</span>
                {step.subtitle && <span className="stepper-subtitle">{step.subtitle}</span>}
              </div>
            </button>
            {i < steps.length - 1 && (
              <div className={`stepper-connector ${i < currentStep ? 'done' : ''}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Stepper;
