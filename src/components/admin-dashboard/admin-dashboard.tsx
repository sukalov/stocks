'use client';

import { useEffect, useRef, useState } from 'react';
import AdminNav from './admin-nav';
import { KanbanBoard } from './board';

interface AdminDashboardProps {
  adjustments: DataAdjustments[];
}

export default function AdminDashboard({ adjustments,  }: AdminDashboardProps) {
  const [parent, setParent] = useState(null);
  const ref = useRef<HTMLHeadingElement | null>(null);
  const [selectedAdjustmentId, setSelectedAdjustmentId] = useState<number>();
  const [selectedAdjustment, setSelectedAdjustment] = useState<DataAdjustments | undefined>(undefined)
  const indexNames = adjustments.reduce((prev: string[], current: DataAdjustments) => {
    const i = prev.find((el) => el === current.index);
    if (!i) prev.push(current.index);
    return prev;
  }, []);



  const selectAdj = (el: DataAdjustments, event: Event) => {
    event.stopPropagation();
    setSelectedAdjustmentId(el.id);
    setSelectedAdjustment(adjustments.find((adj) => adj.id === el.id))
    ref.current?.focus()
    ref.current?.scrollIntoView({behavior: 'smooth'});
  };

  const createAdjustment = (index: string) => {
    console.log(index)
  }
  function handleDragEnd({over}: any) {
    setParent(over ? over.id : null);
  }

  useEffect(() => {
    if (ref.current) {
      const element = document.activeElement as HTMLInputElement;
      console.log('active:::' + element.innerText)
    element.blur();
    const element2 = document.activeElement as HTMLInputElement;
      console.log('active22222:::' + element2.innerText)
    element2.blur();
      ref.current.scrollIntoView({ behavior: 'smooth'});
    }
  }, [selectedAdjustment]);

  const functions = {selectAdj, createAdjustment, setSelectedAdjustmentId}

  return (
    <div className=''>
        <AdminNav data={adjustments} indexNames={indexNames} functions={functions} />
        {selectedAdjustment ?
          <div>
            <h1 ref={ref} className="font-bold text-4xl pl-8 pt-24 capitalize">{selectedAdjustment?.index.split('-').join(' ')}</h1>
            <h2 className="pl-8 text-xl">{selectedAdjustment?.date.toISOString().slice(0, 10)}</h2>
            <div className=' py-8 w-full'>
              <KanbanBoard adjustment={selectedAdjustment} />
            </div>
          </div>
          :
          <div>
            <h1 ref={ref} className='font-bold text-4xl pl-8 pt-24 capitalize"'></h1>
          </div>
        }
    </div>
  );
}
