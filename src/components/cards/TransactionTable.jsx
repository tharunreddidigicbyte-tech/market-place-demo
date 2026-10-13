import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatINR, formatDate, timeAgo } from '../../lib/format';
import Pagination from '../ui/Pagination';
import { usePagination } from '../../hooks/usePagination';

const categoryColors = {
  Shopping: '#6366f1', Food: '#f59e0b', Transport: '#10b981',
  Entertainment: '#ec4899', Grocery: '#8b5cf6', Fuel: '#f97316',
  Health: '#06b6d4', Reward: '#22c55e', Credit: '#22c55e', Others: '#64748b',
};

const TransactionTable = ({ transactions, title = 'Recent Transactions', compact = false }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const filtered = transactions
    .filter(t => {
      const matchSearch = t.merchant.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === 'all' || t.type === filter || t.status === filter;
      return matchSearch && matchFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'amount') return b.amount - a.amount;
      return a.merchant.localeCompare(b.merchant);
    });

  const { paginatedItems, ...pagination } = usePagination(filtered, compact ? 5 : 10);

  return (
    <div className="txn-table-wrapper">
      <div className="txn-table-header">
        <h3 className="section-sub-title">{title}</h3>
        {!compact && (
          <div className="txn-controls">
            <div className="search-box">
              <FontAwesomeIcon icon="search" className="search-icon" />
              <input
                type="text"
                placeholder="Search transactions…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="search-input"
                id="txn-search"
              />
            </div>
            <select
              className="filter-select"
              value={filter}
              onChange={e => setFilter(e.target.value)}
              id="txn-filter"
            >
              <option value="all">All</option>
              <option value="debit">Debits</option>
              <option value="credit">Credits</option>
              <option value="pending">Pending</option>
              <option value="settled">Settled</option>
            </select>
            <select
              className="filter-select"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              id="txn-sort"
            >
              <option value="date">By Date</option>
              <option value="amount">By Amount</option>
              <option value="merchant">By Merchant</option>
            </select>
          </div>
        )}
      </div>

      <div className="txn-list">
        {paginatedItems.length === 0 ? (
          <div className="txn-empty">
            <FontAwesomeIcon icon="receipt" />
            <p>No transactions found</p>
          </div>
        ) : paginatedItems.map(txn => (
          <div key={txn.id} className={`txn-row ${txn.status === 'pending' ? 'txn-row--pending' : ''}`}>
            <div className="txn-icon-wrap" style={{ background: `${categoryColors[txn.category] || '#64748b'}22` }}>
              <span className="txn-icon">{txn.icon}</span>
            </div>
            <div className="txn-details">
              <span className="txn-merchant">{txn.merchant}</span>
              <span className="txn-meta">
                {txn.category}
                {txn.status === 'pending' && <span className="txn-pending-badge">Pending</span>}
                {' · '}{timeAgo(txn.date)}
              </span>
            </div>
            <div className="txn-right">
              <span className={`txn-amount ${txn.type === 'credit' ? 'txn-amount--credit' : 'txn-amount--debit'}`}>
                {txn.type === 'credit' ? '+' : '−'}{formatINR(txn.amount)}
              </span>
              {txn.rewards > 0 && (
                <span className="txn-rewards">
                  <FontAwesomeIcon icon="star" /> +{txn.rewards} pts
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {!compact && (
        <Pagination {...pagination} />
      )}
    </div>
  );
};

export default TransactionTable;
