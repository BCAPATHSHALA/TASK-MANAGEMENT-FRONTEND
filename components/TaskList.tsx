'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { taskApi } from '@/lib/api';
import type { CreateTaskInput, UpdateTaskInput } from '@/lib/schemas';
import { TaskItem } from './TaskItem';
import { TaskForm } from './TaskForm';
import { useTaskStore } from '@/store/taskStore';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export const TaskList: React.FC = () => {
  const [skip, setSkip] = useState(0);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const { notification, setNotification, resetNotification } = useTaskStore();

  const { data, error, isLoading, mutate } = useSWR(
    ['tasks', skip],
    () => taskApi.getTasks(skip, 10),
    {
      revalidateOnFocus: false,
      dedupingInterval: 1000,
    }
  );

  useEffect(() => {
    if (notification.type) {
      const timer = setTimeout(resetNotification, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification.type, resetNotification]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification(type, message);
  };

  const handleCreateTask = async (taskData: CreateTaskInput) => {
    setIsActionLoading(true);
    try {
      await taskApi.createTask(taskData);
      showNotification('success', 'Task created successfully!');
      mutate();
    } catch (error) {
      showNotification('error', error instanceof Error ? error.message : 'Failed to create task');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleUpdateTask = async (id: string, updateData: UpdateTaskInput) => {
    setIsActionLoading(true);
    try {
      await taskApi.updateTask(id, updateData);
      showNotification('success', 'Task updated successfully!');
      mutate();
    } catch (error) {
      showNotification('error', error instanceof Error ? error.message : 'Failed to update task');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteTask = async (id: string) => {
    setIsActionLoading(true);
    try {
      await taskApi.deleteTask(id);
      showNotification('success', 'Task deleted successfully!');
      mutate();
    } catch (error) {
      showNotification('error', error instanceof Error ? error.message : 'Failed to delete task');
    } finally {
      setIsActionLoading(false);
    }
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading Tasks</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {notification.type && (
        <Alert variant={notification.type === 'error' ? 'destructive' : 'default'}>
          {notification.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertTitle>{notification.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
          <AlertDescription>{notification.message}</AlertDescription>
        </Alert>
      )}

      <TaskForm onSubmit={handleCreateTask} isLoading={isActionLoading} />

      <Card>
        <CardHeader>
          <CardTitle>Tasks {data && `(${data.pagination.total})`}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
              <p className="text-muted-foreground mt-2">Loading tasks...</p>
            </div>
          ) : data?.data && data.data.length > 0 ? (
            <div className="space-y-3">
              {data.data.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onUpdate={handleUpdateTask}
                  onDelete={handleDeleteTask}
                  isLoading={isActionLoading}
                />
              ))}

              {data.pagination.total > data.pagination.take && (
                <div className="mt-6 flex gap-2 justify-center items-center">
                  <Button
                    onClick={() => setSkip(Math.max(0, skip - 10))}
                    disabled={skip === 0}
                    variant="outline"
                  >
                    Previous
                  </Button>
                  <span className="text-muted-foreground text-sm">
                    Page {Math.floor(skip / 10) + 1} of {Math.ceil(data.pagination.total / 10)}
                  </span>
                  <Button
                    onClick={() => setSkip(skip + 10)}
                    disabled={skip + 10 >= data.pagination.total}
                    variant="outline"
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No tasks yet. Create one to get started!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
