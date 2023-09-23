'use client';

import type { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cva } from "class-variance-authority";
import { GripVertical } from "lucide-react";
import { ColumnId } from "./board";

export interface Task {
  id: UniqueIdentifier;
  columnId: ColumnId;
  symbol: string;
  market_cap: string;
}

interface TaskCardProps {
  task: Task;
  isOverlay?: boolean;
  index: number;
  bg: boolean;
}

export type TaskType = "Task";

export interface TaskDragData {
  type: TaskType;
  task: Task;
}

export function TaskCard({ task, isOverlay, index, bg }: TaskCardProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    } satisfies TaskDragData,
    attributes: {
      roleDescription: "Task",
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva("", {
    variants: {
      dragging: {
        over: "ring-2 opacity-30",
        overlay: "ring-2 ring-primary",
      },
      changing_state: {
        changed: "bg-blue-800/50",
        notChanged: ""
      }
    },
  });

  return (
    <Card
      {...attributes}
      {...listeners}
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
        changing_state: (bg || isOverlay) ? "notChanged" : "changed"
      })}
    >
      <CardContent className="px-3 pt-3 pb-3 text-left whitespace-pre-wrap flex justify-start w-full items-baseline">
          <span className="sr-only">Move task</span>
          <span className=" text-sm pr-2 text-primary/50 w-4">
            {index + 1}.
          </span>
          <span className="font-bold ml-4 mr-2 w-28 bg-blu">
            {task.symbol}
          </span>
          <span className="">
            {task.market_cap}
          </span>

      </CardContent>
    </Card>
  );
}
