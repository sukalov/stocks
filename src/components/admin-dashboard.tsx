'use client';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from './ui/button';
import { useState } from 'react';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import AdminNav from './admin-dashboard/admin-nav';
import { KanbanBoard } from './admin-dashboard/board';

interface AdminDashboardProps {
  data: DataAdjustments[];
}

export default function AdminDashboard({ data }: AdminDashboardProps) {
  const [parent, setParent] = useState(null);
  const [selectedAdjustmentId, setSelectedAdjustmentId] = useState<number>();
  const indexNames = data.reduce((prev: string[], current: DataAdjustments) => {
    const i = prev.find((el) => el === current.index);
    if (!i) prev.push(current.index);
    return prev;
  }, []);

  const selectAdj = (el: DataAdjustments) => {
    setSelectedAdjustmentId(el.id);
  };

  const createAdjustment = (index: string) => {
    console.log(index)
  }
  function handleDragEnd({over}: any) {
    setParent(over ? over.id : null);
  }

  const functions = {selectAdj, createAdjustment, setSelectedAdjustmentId}

  const selectedAdjustment = data.find((adj) => adj.id === selectedAdjustmentId);

  return (
    <div>
        <AdminNav data={data} indexNames={indexNames} functions={functions}/>
      <h1 className="font-bold text-4xl pl-8 pt-4">{selectedAdjustment?.index}</h1>
      <h2 className="pl-8 text-xl">{selectedAdjustment?.date.toISOString().slice(0, 10)}</h2>
     {/* {!parent ? draggable : null}
      <ul className="characters">
      {selectedAdjustment &&
        Object.keys(selectedAdjustment!.capitalizations).map(symbol => {
            return (<div key={symbol}></div>
                // <Button key={symbol} variant='ghost'>{symbol}</Button>
                // <DraggableSymbol id={symbol} key={symbol}>{<div>symbol</div>}</DraggableSymbol>
            )
        })
      } */}
      {selectedAdjustment && <KanbanBoard adjustment={selectedAdjustment}/>}
    </div>
  );
}
