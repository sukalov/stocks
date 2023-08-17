import { IndiciesNav } from '@/components/indicies-nav';

export const metadata = {
  title: 'JaKoTa',
  description: 'Stock data for some Japan, Taiwan and South Korea companies',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <IndiciesNav />
      <section className="pt-8">{children}</section>
    </>
  );
}