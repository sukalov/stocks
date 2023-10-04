'use client';

import { DetailedHTMLProps, FormHTMLAttributes, useEffect, useRef, useState } from 'react';
import AdminNav from './admin-nav';
import { KanbanBoard } from './board';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { ServerActionAction } from 'next/dist/client/components/router-reducer/router-reducer-types';
import { DatePicker } from '../ui/date-picker';

interface AdminDashboardProps {
  adjustments: DataAdjustments[];
  handleSubmit: (formData: FormData) => void;
}

export default function AdminDashboard({ adjustments, handleSubmit }: AdminDashboardProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [parent, setParent] = useState(null);
  const [formStock, setFormStock] = useState('');
  const ref = useRef<HTMLHeadingElement | null>(null);
  const [selectedAdjustmentId, setSelectedAdjustmentId] = useState<number>(0);
  const [selectedAdjustment, setSelectedAdjustment] = useState<DataAdjustments | undefined>(undefined);
  const indexNames = adjustments.reduce((prev: string[], current: DataAdjustments) => {
    const i = prev.find((el) => el === current.index);
    if (!i) prev.push(current.index);
    return prev;
  }, []);

  const selectAdj = (el: DataAdjustments, event: Event) => {
    event.stopPropagation();
    setSelectedAdjustmentId(el.id);
    setSelectedAdjustment(adjustments.find((adj) => adj.id === el.id));
    ref.current?.focus();
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const createAdjustment = (index: string) => {
    console.log(index);
  };
  function handleDragEnd({ over }: any) {
    setParent(over ? over.id : null);
  }

  useEffect(() => {
    if (ref.current) {
      const element = document.activeElement as HTMLInputElement;
      element.blur();
      const element2 = document.activeElement as HTMLInputElement;
      element2.blur();
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedAdjustment]);

  const functions = { selectAdj, createAdjustment, setSelectedAdjustmentId };

  return (
    <div className="">
      <AdminNav data={adjustments} indexNames={indexNames} functions={functions} />
      {selectedAdjustment ? (
        <div>
          <h1 ref={ref} className="font-bold text-4xl pl-8 pt-24 capitalize">
            {selectedAdjustment?.index.split('-').join(' ')}
          </h1>
          <h2 className="pl-8 text-xl">{selectedAdjustment?.date.toISOString().slice(0, 10)}</h2>
          <div className=" py-8 w-full">
            <KanbanBoard adjustment={selectedAdjustment} />
            <div>
              <form action={handleSubmit} className="flex gap-2 justify-center py-4 md:p-4 max-w-[720px] mx-auto">
                <Input
                  name="stock"
                  value={formStock}
                  onChange={(e) => setFormStock(e.target.value)}
                  placeholder="remove stock from this adjustment"
                ></Input>
                <input name="adjustmentId" value={selectedAdjustmentId} className="hidden" readOnly></input>
                <input name="date" value={date?.toISOString().slice(0, 10)} className="hidden" readOnly></input>
                <DatePicker date={date} setDate={setDate} />
                <Button>submit</Button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h1 ref={ref} className='font-bold text-4xl pl-8 pt-24 capitalize"'></h1>
        </div>
      )}
    </div>
  );
}
