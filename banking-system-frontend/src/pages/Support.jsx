import React, { useState } from 'react';
import PageShell from '../components/layout/PageShell';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import {
  HelpCircle, PhoneCall, MessageSquare, Mail, Search,
  ChevronDown, ChevronUp, CheckCircle2, ShieldCheck,
  CreditCard, ArrowLeftRight, FileText, Send, AlertCircle
} from 'lucide-react';

const faqList = [
  {
    category: 'Accounts & Banking',
    q: 'How do I open a new bank account?',
    a: 'You can open a new bank account instantly from the Dashboard or Accounts section by clicking "Open New Account". Your account will be generated immediately on our secure cloud ledger.'
  },
  {
    category: 'Accounts & Banking',
    q: 'What currencies are supported?',
    a: 'Credo Bank currently defaults to INR (Indian Rupee) for all transaction ledgers, balances, and transfer tracking.'
  },
  {
    category: 'Transfers & Payments',
    q: 'How long do money transfers take to complete?',
    a: 'Transfers execute instantly! Credo Bank utilizes atomic double-entry ledger transactions to credit recipient accounts and debit source accounts in real-time.'
  },
  {
    category: 'Transfers & Payments',
    q: 'What is the daily transfer limit?',
    a: 'Standard accounts have a daily transfer limit of ₹200,000.00. You can view your real-time used limit and remaining limit in the Transfer section.'
  },
  {
    category: 'Transfers & Payments',
    q: 'What is Idempotency Key protection?',
    a: 'Idempotency keys are unique cryptographic reference strings attached to every payment. If your internet disconnects or you accidentally double-click submit, our backend blocks duplicate withdrawals.'
  },
  {
    category: 'Security & Cards',
    q: 'Is my banking data secure?',
    a: 'Yes! Credo Bank uses HTTP-only JWT cookies, bcrypt password hashing, CORS protection, and encrypted MongoDB Atlas clusters to protect your data.'
  },
  {
    category: 'Security & Cards',
    q: 'How do I deposit test funds for development?',
    a: 'On the Dashboard or Accounts page, click "Deposit Test Money" on any active account card to launch the faucet modal and credit ₹5,000 to ₹100,000 test funds.'
  }
];

export default function Support() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openFaq, setOpenFaq] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Support ticket form state
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Accounts & Banking');
  const [ticketPriority, setTicketPriority] = useState('Medium');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [ticketError, setTicketError] = useState('');

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const filteredFaqs = faqList.filter(faq => {
    const matchesCategory = categoryFilter === 'All' || faq.category === categoryFilter;
    const matchesSearch = faq.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          faq.a.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    setTicketError('');

    if (!ticketSubject.trim() || !ticketMessage.trim()) {
      setTicketError('Please provide a subject and message for your ticket.');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setTicketSubmitted({
        id: `TKT-${Math.floor(100000 + Math.random() * 900000)}`,
        subject: ticketSubject,
        category: ticketCategory,
        date: new Date().toLocaleString()
      });
      setSubmitting(false);
      setTicketSubject('');
      setTicketMessage('');
    }, 800);
  };

  return (
    <PageShell pageSubtitle="We are here to help you 24 hours a day, 7 days a week">
      <div className="max-w-[1100px] space-y-8 pb-10">

        {/* Hero Search Card */}
        <div className="rounded-2xl bg-primary-gradient text-white p-8 relative overflow-hidden shadow-card-hover">
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white opacity-10 pointer-events-none" />
          <div className="relative z-10 max-w-xl">
            <h1 className="text-2xl font-bold mb-2">How can we help you today?</h1>
            <p className="text-white/80 text-sm mb-6">Search our knowledge base or browse frequently asked questions below.</p>

            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search FAQs, topics, transfers, security..."
                className="w-full pl-11 pr-4 py-3 bg-white text-gray-800 text-sm rounded-xl focus:outline-none focus:ring-4 focus:ring-white/30 shadow-lg placeholder:text-gray-400 font-medium"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Contact Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card className="p-5 flex items-center gap-4 border border-slate-100">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <PhoneCall size={22} />
            </div>
            <div>
              <p className="text-xs font-semibold text-text-muted uppercase">24x7 Toll Free</p>
              <p className="text-base font-bold text-gray-800">1800-123-CREDO</p>
              <p className="text-[11px] text-emerald-600 font-medium">Instant Phone Support</p>
            </div>
          </Card>

          <Card className="p-5 flex items-center gap-4 border border-slate-100">
            <div className="w-12 h-12 rounded-xl bg-success/10 text-success flex items-center justify-center flex-shrink-0">
              <MessageSquare size={22} />
            </div>
            <div>
              <p className="text-xs font-semibold text-text-muted uppercase">Live Chat</p>
              <p className="text-base font-bold text-gray-800">Chat with Agent</p>
              <p className="text-[11px] text-emerald-600 font-medium">Avg response &lt; 2 mins</p>
            </div>
          </Card>

          <Card className="p-5 flex items-center gap-4 border border-slate-100">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center flex-shrink-0">
              <Mail size={22} />
            </div>
            <div>
              <p className="text-xs font-semibold text-text-muted uppercase">Email Support</p>
              <p className="text-base font-bold text-gray-800">support@credobank.com</p>
              <p className="text-[11px] text-text-muted">Response within 24 hours</p>
            </div>
          </Card>
        </div>

        {/* FAQs Section */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-gray-800">Frequently Asked Questions</h2>
            
            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {['All', 'Accounts & Banking', 'Transfers & Payments', 'Security & Cards'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    categoryFilter === cat
                      ? 'bg-primary text-white shadow-btn'
                      : 'bg-white text-text-muted border border-slate-200 hover:bg-gray-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {filteredFaqs.length === 0 ? (
            <Card className="p-8 text-center text-text-muted text-sm">
              No matching FAQs found. Try searching for another topic or submit a support ticket below.
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredFaqs.map((faq, idx) => (
                <Card key={idx} className="overflow-hidden border border-slate-100 transition-all">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <HelpCircle size={18} className="text-primary flex-shrink-0" />
                      <span className="font-semibold text-gray-800 text-sm">{faq.q}</span>
                    </div>
                    {openFaq === idx ? (
                      <ChevronUp size={18} className="text-text-muted flex-shrink-0" />
                    ) : (
                      <ChevronDown size={18} className="text-text-muted flex-shrink-0" />
                    )}
                  </button>

                  {openFaq === idx && (
                    <div className="px-5 pb-5 pt-1 text-xs text-gray-600 leading-relaxed border-t border-slate-50 bg-slate-50/30">
                      {faq.a}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Submit Support Ticket Section */}
        <Card className="p-6 border border-slate-100">
          <h2 className="text-lg font-bold text-gray-800 mb-1">Submit a Support Ticket</h2>
          <p className="text-text-muted text-xs mb-6">Need help with a specific transaction or account issue? Fill out the form below.</p>

          {ticketSubmitted ? (
            <div className="p-6 bg-success/10 border border-success/20 rounded-2xl text-center">
              <div className="w-12 h-12 bg-success text-white rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-base font-bold text-gray-800 mb-1">Ticket Submitted Successfully!</h3>
              <p className="text-xs text-text-muted mb-2">Ticket Ref: <strong className="font-mono text-gray-800">{ticketSubmitted.id}</strong></p>
              <p className="text-xs text-gray-600 mb-4">Our support engineering team will review your query and reply to your registered email shortly.</p>
              <Button variant="secondary" size="sm" onClick={() => setTicketSubmitted(null)}>
                Submit Another Ticket
              </Button>
            </div>
          ) : (
            <form onSubmit={handleTicketSubmit} className="space-y-4 max-w-2xl">
              {ticketError && (
                <div className="p-3 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span>{ticketError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase">Category</label>
                  <select
                    className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-primary bg-white"
                    value={ticketCategory}
                    onChange={e => setTicketCategory(e.target.value)}
                  >
                    <option value="Accounts & Banking">Accounts & Banking</option>
                    <option value="Transfers & Payments">Transfers & Payments</option>
                    <option value="Security & Cards">Security & Cards</option>
                    <option value="Technical Support">Technical Support</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase">Priority</label>
                  <select
                    className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-primary bg-white"
                    value={ticketPriority}
                    onChange={e => setTicketPriority(e.target.value)}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High (Urgent)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase">Subject</label>
                <input
                  type="text"
                  placeholder="e.g. Issue with transaction status"
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-primary"
                  value={ticketSubject}
                  onChange={e => setTicketSubject(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase">Detailed Description</label>
                <textarea
                  rows={4}
                  placeholder="Please describe your issue or question in detail..."
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-primary"
                  value={ticketMessage}
                  onChange={e => setTicketMessage(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                icon={Send}
                disabled={submitting}
              >
                {submitting ? 'Submitting Ticket...' : 'Submit Ticket'}
              </Button>
            </form>
          )}
        </Card>

      </div>
    </PageShell>
  );
}
