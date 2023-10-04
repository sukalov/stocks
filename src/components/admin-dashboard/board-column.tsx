'use client';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { useDndContext, type UniqueIdentifier } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useMemo } from 'react';
import { Task, TaskCard } from './symbol-card';
import { cva } from 'class-variance-authority';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { GripVertical } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

export interface Column {
  id: UniqueIdentifier;
  title: string;
}

export type ColumnType = 'Column';

export interface ColumnDragData {
  type: ColumnType;
  column: Column;
}

interface BoardColumnProps {
  column: Column;
  tasks: Task[];
  initialTasks: Task[];
  isOverlay?: boolean;
}

export function BoardColumn({ column, tasks, isOverlay, initialTasks }: BoardColumnProps) {
  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    } satisfies ColumnDragData,
    attributes: {
      roleDescription: `Column: ${column.title}`,
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva('w-[340px] h-[650px] bg-secondary flex flex-col gap-0 flex-shrink pb-4', {
    variants: {
      dragging: {
        default: 'border-2 border-transparent',
        over: 'ring-2 opacity-30',
        overlay: 'ring-2 ring-primary',
      },
    },
  });

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? 'overlay' : isDragging ? 'over' : undefined,
      })}
    >
      <CardHeader className="p-4 font-semibold border-b-2 text-left flex flex-row space-between items-center">
        <span className="ml-auto"> {column.title}</span>
      </CardHeader>
      <CardContent className="flex flex-grow flex-col gap-2 px-2">
        <SortableContext items={tasksIds}>
          <ScrollArea className="h-[550px] w-full">
            {tasks.map((task, i) => {
              const initialTaskState = initialTasks.find((el) => task.id === el.id);
              const bg = initialTaskState?.columnId === task.columnId;
              return (
                <div className="py-1 w-full" key={task.id}>
                  <TaskCard task={task} index={i} bg={bg} />
                </div>
              );
            })}
            {tasks.length === 0 && <div className="w-full py-8 text-center text-primary/50">No stocks in the list</div>}
          </ScrollArea>
        </SortableContext>
      </CardContent>
    </Card>
  );
}

export function BoardContainer({ children }: { children: React.ReactNode }) {
  const dndContext = useDndContext();

  const variations = cva('overflow-x-auto px-2 md:px-0 flex justify-center', {
    variants: {
      dragging: {
        default: 'snap-x snap-mandatory',
        active: 'snap-none',
      },
    },
  });

  return (
    <div
      className={variations({
        dragging: dndContext.active ? 'active' : 'default',
      })}
    >
      <div className="flex gap-4 items-center flex-row justify-center">{children}</div>
    </div>
  );
}
