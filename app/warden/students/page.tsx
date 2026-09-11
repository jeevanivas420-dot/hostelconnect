import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Users } from 'lucide-react';

export default function WardenStudentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
          <Users className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Hostel Student Directory
          </h1>
          <p className="text-sm text-slate-500">Search residents, verify room allocations, and parent contacts</p>
        </div>
      </div>

      <Card className="border-dashed border-2 border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle>Student Directory Scaffolding</CardTitle>
          <CardDescription>Stubbed out for the dedicated warden pass.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500">
            Database schema ready: <code>public.students</code> and <code>public.users</code>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
