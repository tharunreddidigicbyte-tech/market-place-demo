import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatINR, formatDate } from '../../lib/format';
import Pagination from '../ui/Pagination';
import { usePagination } from '../../hooks/usePagination';

const EmiTable = ({ schedule, title = 'EMI Schedule' }) => {
  const { paginatedItems, ...pagination } = usePagination(schedule, 12);

  const totalInterest = schedule.reduce((s, r) => s + r.interest, 0);
  const totalPrincipal = schedule.reduce((s, r) => s + r.principal, 0);

  return (
    <div className="emi-table-wrapper">
      <div className="emi-table-header">
        <h3 className="section-sub-title">{title}</h3>
        <div className="emi-summary-chips">
          <span className="emi-chip">
            <FontAwesomeIcon icon="coins" />
            Principal: {formatINR(totalPrincipal)}
          </span>
          <span className="emi-chip emi-chip--interest">
            <FontAwesomeIcon icon="percent" />
            Interest: {formatINR(totalInterest)}
          </span>
        </div>
      </div>

      <div className="emi-table-scroll">
        <table className="emi-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Due Date</th>
              <th>EMI</th>
              <th>Principal</th>
              <th>Interest</th>
              <th>Balance</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.map(row => (
              <tr key={row.month} className={row.paid ? 'emi-row--paid' : ''}>
                <td className="emi-month">{row.month}</td>
                <td>{formatDate(row.dueDate, { day: '2-digit', month: 'short', year: '2-digit' })}</td>
                <td><strong>{formatINR(row.emi)}</strong></td>
                <td className="text-success">{formatINR(row.principal)}</td>
                <td className="text-warn">{formatINR(row.interest)}</td>
                <td>{formatINR(row.balance)}</td>
                <td>
                  {row.paid ? (
                    <span className="status-pill status-pill--paid">
                      <FontAwesomeIcon icon="check-double" /> Paid
                    </span>
                  ) : (
                    <span className="status-pill status-pill--upcoming">Upcoming</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination {...pagination} />
    </div>
  );
};

export default EmiTable;
