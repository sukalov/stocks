import AdminDashboard from '@/components/admin-dashboard';
import { db } from '@/lib/db';
import { adjustments } from '@/lib/db/schema';

export default async function Admin() {
  let data = (await db.select().from(adjustments)) as DataAdjustments[];
  return (
    <div className="pt-8">
      {/* {JSON.stringify(data, null, 2)} */}
      <AdminDashboard data={data} />
    </div>
  );
}
