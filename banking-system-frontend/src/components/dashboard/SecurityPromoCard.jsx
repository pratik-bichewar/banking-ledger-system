import React from 'react';
import { Shield, ArrowRight } from 'lucide-react';
import securityImg from '../../assets/security-shield-illustration.svg';
import Button from '../ui/Button';

export default function SecurityPromoCard() {
  return (
    <div
      className="rounded-2xl p-6 flex items-center gap-4 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(136,92,246,0.12) 100%)',
        border: '1px solid rgba(99,102,241,0.15)',
      }}
    >
      {/* Illustration */}
      <img src={securityImg} alt="Security" className="w-24 h-24 flex-shrink-0 object-contain" />

      {/* Text + CTA */}
      <div className="flex-1">
        <h4 className="font-bold text-gray-800 text-base mb-1">Your Security,<br />Our Priority</h4>
        <p className="text-text-muted text-xs mb-4 leading-relaxed">
          Enable two-factor authentication and keep your account safe.
        </p>
        <Button variant="primary" size="sm" iconRight={ArrowRight} className="text-xs">
          Enable 2FA
        </Button>
      </div>
    </div>
  );
}
