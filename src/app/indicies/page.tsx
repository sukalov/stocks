import { indexNames } from '@/lib/index-names';
import { redirect } from 'next/navigation';

export default function Indicies() {
  redirect(`/indicies/${indexNames[0]}`);
}
