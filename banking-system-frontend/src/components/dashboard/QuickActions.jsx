import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Plus, FileText, Download } from 'lucide-react';
import Card, { CardHeader } from '../ui/Card';

const actions = [
  { label: 'Send Money',     icon: Send,     color: 'bg-primary/10 text-primary',  path: '/transfer' },
  { label: 'Add Money',      icon: Plus,     color: 'bg-success/10 text-success',  path: '/accounts' },
  { label: 'Pay Bills',      icon: FileText, color: 'bg-warning/10 text-warning',  path: '/transfer' },
  { label: 'Request Money',  icon: Download, color: 'bg-danger/10 text-danger',    path: '/transfer' },
];

export default function QuickActions() {
  const navigate = useNavigate();
  return (
    <Card className="p-6">
      <CardHeader title="Quick Actions" />
      <div className="grid grid-cols-4 gap-3">
        {actions.map(({ label, icon: Icon, color, path }) => (
          <button
            key={label}
            onClick={() => navigate(path)}
            className="flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-gray-50 transition-colors group"
          >
            <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center transition-transform group-hover:scale-110 duration-150`}>
              <Icon size={20} strokeWidth={1.75} />
            </div>
            <span className="text-xs font-medium text-text-muted text-center leading-tight">{label}</span>
          </button>
        ))}
      </div>
    </Card>
  );
}
