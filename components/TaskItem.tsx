'use client';

import type React from 'react';
import { useState } from 'react';
import type { Task } from '@/lib/api';
import { updateTaskSchema, type UpdateTaskInput } from '@/lib/schemas';
import { ZodError } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface TaskItemProps {
  task: Task;
  onUpdate: (id: string, data: UpdateTaskInput) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isLoading?: boolean;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onUpdate, onDelete, isLoading }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleStatusChange = async (newStatus: Task['status']) => {
    try {
      await onUpdate(task.id, { status: newStatus });
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleSaveEdit = async () => {
    setIsSubmitting(true);
    setErrors({});

    try {
      const validatedData = updateTaskSchema.parse({
        title: editTitle,
        description: editDescription,
      });
      await onUpdate(task.id, validatedData);
      setIsEditing(false);
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          const path = err.path.join('.');
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await onDelete(task.id);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const formattedDate = new Date(task.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className={`text-lg font-semibold ${errors.title ? 'border-destructive' : ''}`}
                  />
                  {errors.title && <p className="text-destructive text-sm">{errors.title}</p>}

                  <Textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows={2}
                    className={errors.description ? 'border-destructive' : ''}
                  />
                  {errors.description && (
                    <p className="text-destructive text-sm">{errors.description}</p>
                  )}
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-semibold">{task.title}</h3>
                  {task.description && (
                    <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                      {task.description}
                    </p>
                  )}
                  <p className="text-muted-foreground text-xs mt-2">Created: {formattedDate}</p>
                </div>
              )}
            </div>

            <div className="flex gap-2 flex-wrap justify-end">
              <Select value={task.status} onValueChange={handleStatusChange} disabled={isLoading}>
                <SelectTrigger className="w-32">
                  <SelectValue defaultValue={task.status} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>

              {isEditing ? (
                <div className="flex gap-2">
                  <Button onClick={handleSaveEdit} disabled={isSubmitting || isLoading} size="sm">
                    Save
                  </Button>
                  <Button
                    onClick={() => {
                      setIsEditing(false);
                      setEditTitle(task.title);
                      setEditDescription(task.description || '');
                      setErrors({});
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button
                    onClick={() => setIsEditing(true)}
                    disabled={isLoading}
                    variant="outline"
                    size="sm"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => setShowDeleteDialog(true)}
                    disabled={isLoading}
                    variant="destructive"
                    size="sm"
                  >
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
