import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';

export default function WardenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout role="WARDEN">{children}</AppLayout>;
}
