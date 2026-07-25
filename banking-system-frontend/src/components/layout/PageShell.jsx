import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function PageShell({ children, pageTitle, pageSubtitle }) {
  return (
    <div className="flex min-h-screen bg-light-bg">
      <Sidebar />
      <div className="flex-1 ml-[260px] flex flex-col min-h-screen">
        <Topbar pageTitle={pageTitle} pageSubtitle={pageSubtitle} />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
