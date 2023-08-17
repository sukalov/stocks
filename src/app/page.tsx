import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { indicies } from '@/lib/indicies';

export default function Home() {
  return (
    <div className="py-8 flex flex-1 gap-4 justify-center items-start flex-wrap">
      {indicies.map((indexName) => (
        <Card key={indexName} className="md:w-80 sm:w-[28rem] sm:mx-2 mx-2 w-[28rem] flex-grow">
          <CardHeader>
            <CardTitle className=" text-muted-foreground capitalize">{indexName.split('-').join(' ')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div key={indexName} className="pb-6">
              <Link href={`/api/stocks-info/${indexName}`}>
                <Button variant={'link'}>info</Button>
              </Link>
              <br />
              <Link href={`/api/adjustments/${indexName}`}>
                <Button variant={'link'}>adjustments</Button>
              </Link>
              <br />
              <Link href={`/api/index/${indexName}`}>
                <Button variant={'link'}>index</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
