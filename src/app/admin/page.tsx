import AdminDashboard from '@/components/admin-dashboard/admin-dashboard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { db } from '@/lib/db';
import { adjustments } from '@/lib/db/schema';
import { gt } from 'drizzle-orm';
import { FormEvent } from 'react';

export default async function Admin() {
  const date: any = new Date();
  const adjustmentsData = (await db.select().from(adjustments).where(gt(date, adjustments.date))) as DataAdjustments[];

  const handleSubmit = async (e: FormData) => {
    'use server';
    const date = new Date(String(e.get('date')));
    date.setDate(date.getDate() + 1);
    const postInfo = {
      stock: e.get('stock'),
      adjId: e.get('adjustmentId'),
      date,
    };

    const response = await fetch('http://localhost:3000/api/remove-from-adjustment', {
      method: 'POST',
      body: JSON.stringify(postInfo),
    });
  };

  return (
    <div className="pt-8">
      <AdminDashboard adjustments={adjustmentsData} handleSubmit={handleSubmit} />
      {/* {JSON.stringify(adjustmentsData[1], null, 2)} */}
    </div>
  );
}
