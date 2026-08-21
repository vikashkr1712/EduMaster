import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const PAYMENT_METHODS = [
  {
    id: 'card',
    label: 'Credit / Debit Card',
    sub: 'Visa, MasterCard, Rupay & more',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <rect x="1" y="4" width="22" height="16" rx="3"/><path d="M1 10h22"/>
      </svg>
    ),
    logos: ['VISA', 'MC', 'RUPAY'],
  },
  {
    id: 'upi',
    label: 'UPI',
    sub: 'Pay using UPI ID / QR Code',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
      </svg>
    ),
    logos: ['UPI'],
  },
  {
    id: 'netbanking',
    label: 'Net Banking',
    sub: 'All major banks supported',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M2 10h20M12 3v4"/>
      </svg>
    ),
    logos: [],
  },
  {
    id: 'wallet',
    label: 'Wallets',
    sub: 'Pay using Paytm, PhonePe, Amazon Pay & more',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2"/><circle cx="16" cy="12" r="2"/>
      </svg>
    ),
    logos: ['PAYTM', 'PHONEPE', 'AMAZONPAY'],
  },
]

const BANKS = ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Punjab National Bank', 'Bank of Baroda', 'Canara Bank']

const QR_CELLS = [[8,2],[10,2],[12,2],[16,2],[8,4],[14,4],[18,4],[8,6],[10,6],[12,6],[16,6],[18,6],[2,8],[4,8],[6,8],[10,8],[14,8],[18,8],[4,10],[8,10],[12,10],[16,10],[2,12],[6,12],[10,12],[14,12],[18,12],[8,14],[12,14],[16,14],[8,16],[10,16],[14,16],[18,16],[12,18],[16,18],[18,18]]

function FinderPattern({ x, y }) {
  return <><rect x={x} y={y} width="6" height="6" rx=".6"/><rect x={x + 1.4} y={y + 1.4} width="3.2" height="3.2" rx=".35" fill="#fff"/><rect x={x + 2.2} y={y + 2.2} width="1.6" height="1.6" rx=".2"/></>
}

function DemoQr({ label }) {
  return (
    <div className="chk-demo-qr">
      <svg viewBox="0 0 22 22" role="img" aria-label={`${label} demo QR code`}>
        <rect width="22" height="22" rx="1.5" fill="#fff"/>
        <g fill="#102552">
          <FinderPattern x={1} y={1}/><FinderPattern x={15} y={1}/><FinderPattern x={1} y={15}/>
          {QR_CELLS.map(([x, y]) => <rect key={`${x}-${y}`} x={x} y={y} width="1.35" height="1.35" rx=".15"/>)}
        </g>
      </svg>
      <small>Demo QR</small>
    </div>
  )
}

function CardDetailsForm({ data, onChange, errors }) {
  return (
    <motion.div className="chk-card-details" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22 }}>
      <div className="chk-form-grid-2">
        <div className="chk-field">
          <label htmlFor="card-number">Card Number</label>
          <input id="card-number" type="text" placeholder="1234 5678 9012 3456" maxLength={19}
            value={data.cardNumber}
            onChange={e => onChange('cardNumber', e.target.value.replace(/\D/g,'').replace(/(.{4})/g,'$1 ').trim())}
          />
          {errors.cardNumber && <span className="chk-error">{errors.cardNumber}</span>}
        </div>
        <div className="chk-field">
          <label htmlFor="card-holder">Card Holder Name</label>
          <input id="card-holder" type="text" placeholder="Full name on card" value={data.cardHolder} onChange={e => onChange('cardHolder', e.target.value)} />
          {errors.cardHolder && <span className="chk-error">{errors.cardHolder}</span>}
        </div>
        <div className="chk-field">
          <label htmlFor="card-expiry">Expiry Date</label>
          <input id="card-expiry" type="text" placeholder="MM / YY" maxLength={7}
            value={data.expiry}
            onChange={e => { let v = e.target.value.replace(/\D/g,''); if(v.length>2) v=v.slice(0,2)+' / '+v.slice(2,4); onChange('expiry', v) }}
          />
          {errors.expiry && <span className="chk-error">{errors.expiry}</span>}
        </div>
        <div className="chk-field">
          <label htmlFor="card-cvv">CVV</label>
          <input id="card-cvv" type="password" placeholder="•••" maxLength={4} value={data.cvv} onChange={e => onChange('cvv', e.target.value.replace(/\D/g,''))} />
          {errors.cvv && <span className="chk-error">{errors.cvv}</span>}
        </div>
      </div>
    </motion.div>
  )
}

function UpiForm({ value, onChange, error }) {
  return (
    <motion.div className="chk-upi-form" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22 }}>
      <div className="chk-payment-visual">
        <DemoQr label="UPI" />
        <div className="chk-payment-visual-copy">
          <strong>Scan with any UPI app</strong>
          <span>Use the demo QR for preview, or enter your UPI ID below.</span>
          <div className="chk-field">
            <label htmlFor="checkout-upi-id">UPI ID</label>
            <input id="checkout-upi-id" type="text" placeholder="yourname@upi" value={value} onChange={e => onChange(e.target.value)} />
            {error && <span className="chk-error">{error}</span>}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function NetBankingForm({ value, onChange, error }) {
  return (
    <motion.div className="chk-nb-form" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22 }}>
      <div className="chk-field">
        <label>Select Your Bank</label>
        <select value={value} onChange={e => onChange(e.target.value)} className="chk-select">
          <option value="">-- Choose a bank --</option>
          {BANKS.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        {error && <span className="chk-error">{error}</span>}
      </div>
    </motion.div>
  )
}

const WALLETS = [
  { id: 'paytm', label: 'Paytm' },
  { id: 'phonepe', label: 'PhonePe' },
  { id: 'amazonpay', label: 'Amazon Pay' },
  { id: 'mobikwik', label: 'Mobikwik' },
]

function WalletForm({ value, onChange, error }) {
  const selectedWallet = WALLETS.find((wallet) => wallet.id === value)
  return (
    <motion.div className="chk-wallet-form" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22 }}>
      <div className="chk-wallet-grid">
        {WALLETS.map(w => (
          <button key={w.id} type="button"
            className={`chk-wallet-btn${value === w.id ? ' selected' : ''}`}
            onClick={() => onChange(w.id)}
          ><span aria-hidden="true">{w.label.slice(0, 1)}</span><strong>{w.label}</strong></button>
        ))}
      </div>
      {selectedWallet && (
        <div className="chk-wallet-visual">
          <DemoQr label={selectedWallet.label} />
          <div><strong>Pay with {selectedWallet.label}</strong><span>Scan this demo QR or continue to open the selected wallet during payment.</span></div>
        </div>
      )}
      {error && <span className="chk-error">{error}</span>}
    </motion.div>
  )
}

export default function PaymentSelector({ method, onMethodChange, cardData, onCardChange, cardErrors, upiValue, onUpiChange, upiError, bankValue, onBankChange, bankError, walletValue, onWalletChange, walletError }) {
  return (
    <div className="chk-payment-selector">
      <h3 className="chk-section-title">1. Select a Payment Method</h3>
      <div className="chk-methods">
        {PAYMENT_METHODS.map(pm => (
          <div key={pm.id} className={`chk-method${method === pm.id ? ' selected' : ''}`} onClick={() => onMethodChange(pm.id)} role="radio" aria-checked={method === pm.id} tabIndex={0} onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onMethodChange(pm.id)}>
            <div className="chk-method-left">
              <span className={`chk-radio${method === pm.id ? ' checked' : ''}`} />
              <span className="chk-method-icon">{pm.icon}</span>
              <div>
                <span className="chk-method-label">{pm.label}</span>
                <span className="chk-method-sub">{pm.sub}</span>
              </div>
            </div>
            {pm.logos.length > 0 && (
              <div className="chk-method-logos">
                {pm.logos.includes('VISA') && <span className="chk-logo chk-logo-visa">VISA</span>}
                {pm.logos.includes('MC') && <span className="chk-logo chk-logo-mc">MC</span>}
                {pm.logos.includes('RUPAY') && <span className="chk-logo chk-logo-rupay">RuPay</span>}
                {pm.logos.includes('UPI') && <span className="chk-logo chk-logo-upi">UPI</span>}
                {pm.logos.includes('PAYTM') && <span className="chk-logo">Paytm</span>}
                {pm.logos.includes('PHONEPE') && <span className="chk-logo">PhonePe</span>}
                {pm.logos.includes('AMAZONPAY') && <span className="chk-logo">Amazon Pay</span>}
              </div>
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {method === 'card' && <CardDetailsForm key="card" data={cardData} onChange={onCardChange} errors={cardErrors} />}
        {method === 'upi' && <UpiForm key="upi" value={upiValue} onChange={onUpiChange} error={upiError} />}
        {method === 'netbanking' && <NetBankingForm key="nb" value={bankValue} onChange={onBankChange} error={bankError} />}
        {method === 'wallet' && <WalletForm key="wallet" value={walletValue} onChange={onWalletChange} error={walletError} />}
      </AnimatePresence>
    </div>
  )
}
