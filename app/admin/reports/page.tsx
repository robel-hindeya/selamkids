import { requireAdmin } from '@/backend/auth/guards';
import { PageHeader } from '@/components/dashboard/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { ShieldCheck, ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react';
import { revalidatePath } from 'next/cache';

interface FlaggedSubmission {
  id: string;
  storyTitle: string;
  authorNickname: string;
  flagReason: string;
  excerpt: string;
  timestamp: string;
  status: 'PENDING' | 'RESOLVED';
}

const globalForReports = global as unknown as { flaggedQueue?: FlaggedSubmission[] };
const initialQueue: FlaggedSubmission[] = [
  {
    id: 'flag-1',
    storyTitle: 'The Secret Clubhouse Behind the Old Tree',
    authorNickname: 'Leo Starlight',
    flagReason: 'Potential home address disclosure (PII Shield)',
    excerpt: '"...we built our secret fort near 42 Elm Street behind the garage..."',
    timestamp: '15 mins ago',
    status: 'PENDING',
  },
  {
    id: 'flag-2',
    storyTitle: 'Battle of the Shadow Beasts',
    authorNickname: 'Maya Spark',
    flagReason: 'Combat intensity threshold review',
    excerpt: '"...the beast roared fiercely and blasted dark lightning across the sky..."',
    timestamp: '1 hour ago',
    status: 'PENDING',
  },
];

if (!globalForReports.flaggedQueue) {
  globalForReports.flaggedQueue = [...initialQueue];
}

export default async function AdminReportsPage() {
  await requireAdmin();
  const queue = globalForReports.flaggedQueue || initialQueue;
  const pendingCount = queue.filter((q) => q.status === 'PENDING').length;

  async function resolveReportAction(formData: FormData) {
    'use server';
    await requireAdmin();
    const reportId = formData.get('reportId') as string;
    const store = globalForReports.flaggedQueue || [];
    const item = store.find((q) => q.id === reportId);
    if (item) {
      item.status = 'RESOLVED';
    }
    revalidatePath('/admin/reports');
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <PageHeader
        title="Safety & Content Moderation Reports"
        description="Inspect COPPA compliance metrics, review flagged stories, and monitor automated filter logs."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Reports' },
        ]}
        actions={
          <Badge variant={pendingCount === 0 ? 'success' : 'warning'} className="gap-1.5 py-1 px-3">
            {pendingCount === 0 ? (
              <>
                <ShieldCheck className="h-3.5 w-3.5" />
                Queue Clear
              </>
            ) : (
              <>
                <ShieldAlert className="h-3.5 w-3.5" />
                {pendingCount} Pending Review
              </>
            )}
          </Badge>
        }
      />

      {/* Safety Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-emerald-200/80 bg-emerald-50/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase font-extrabold text-emerald-800 tracking-wider">
              Automated Language Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-900">100% Active</div>
            <p className="text-xs text-slate-500 mt-1">Screening 100% of student stories in real-time</p>
          </CardContent>
        </Card>

        <Card className="border-indigo-200/80 bg-indigo-50/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase font-extrabold text-indigo-800 tracking-wider">
              PII & Address Shield
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-900">Strict Protection</div>
            <p className="text-xs text-slate-500 mt-1">Phone numbers and addresses automatically scrubbed</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200/80 bg-purple-50/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase font-extrabold text-purple-800 tracking-wider">
              COPPA Compliance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-900">Compliant Tier 1</div>
            <p className="text-xs text-slate-500 mt-1">Zero third-party tracking, fully isolated data</p>
          </CardContent>
        </Card>
      </div>

      {/* Flagged Submissions Review Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            Safety Review Queue
          </h3>
          <span className="text-xs text-slate-500">{pendingCount} items requiring staff action</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Story / Author</TableHead>
                <TableHead>Trigger Reason</TableHead>
                <TableHead>Flagged Excerpt</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {queue.length === 0 || pendingCount === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-slate-500 text-xs">
                    <CheckCircle className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
                    All flagged items have been resolved! Queue is clear.
                  </TableCell>
                </TableRow>
              ) : (
                queue
                  .filter((item) => item.status === 'PENDING')
                  .map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="font-bold text-slate-900 text-xs">{item.storyTitle}</div>
                        <div className="text-[11px] text-slate-500">Author: {item.authorNickname}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="warning" className="text-[10px]">
                          {item.flagReason}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-slate-600 font-mono italic max-w-xs truncate">
                        {item.excerpt}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-[10px]">
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <form action={resolveReportAction} className="inline-block">
                          <input type="hidden" name="reportId" value={item.id} />
                          <Button type="submit" variant="magic" size="sm" className="text-xs h-8">
                            Approve & Clear Flag
                          </Button>
                        </form>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
