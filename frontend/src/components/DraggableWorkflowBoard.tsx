import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Task, User } from '@/types/user';
import { cn } from '@/lib/utils';
import { apiService } from '@/services/api';
import { toast } from 'sonner';

interface DraggableWorkflowBoardProps {
  tasks: Task[];
  users: User[];
  currentUserId: string;
  isEmployee: boolean;
  onTaskUpdate: (taskId: string, newStatus: Task['status']) => void;
}

export function DraggableWorkflowBoard({ 
  tasks, 
  users, 
  currentUserId, 
  isEmployee,
  onTaskUpdate 
}: DraggableWorkflowBoardProps) {
  const [localTasks, setLocalTasks] = useState(tasks);

  const columns: { id: Task['status']; title: string; color: string }[] = [
    { id: 'todo', title: 'To Do', color: 'bg-secondary' },
    { id: 'in_progress', title: 'In Progress', color: 'bg-primary/10' },
    { id: 'done', title: 'Done', color: 'bg-success/10' }
  ];

  const getUserById = (id: string) => users.find(u => u.id === id);

  const getTasksByStatus = (status: Task['status']) => {
    return localTasks.filter(task => task.status === status);
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    // Dropped outside any droppable
    if (!destination) return;

    // No change in position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const task = localTasks.find(t => t.id === draggableId);
    if (!task) return;

    // For employees, only allow reordering within same column (To Do)
    if (isEmployee && source.droppableId !== destination.droppableId) {
      return;
    }

    // For non-employees or moving between columns, update status
    const newStatus = destination.droppableId as Task['status'];
    
    // Optimistically update local state
    const updatedTasks = localTasks.map(t => 
      t.id === draggableId ? { ...t, status: newStatus } : t
    );
    setLocalTasks(updatedTasks);

    try {
      // Update task status via API
      await apiService.updateTaskStatus(draggableId, newStatus);
      onTaskUpdate(draggableId, newStatus);
      toast.success('Task updated successfully');
    } catch (error) {
      // Revert local state on error
      setLocalTasks(localTasks);
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {columns.map(column => {
          const columnTasks = getTasksByStatus(column.id);
          
          // For employees, only allow drag in To Do column
          const isDragDisabled = isEmployee && column.id !== 'todo';

          return (
            <div key={column.id} className="flex flex-col min-h-[500px]">
              {/* Column Header - Improved styling and spacing */}
              <div className={cn(
                "rounded-t-lg p-4 font-semibold flex items-center justify-between shadow-sm",
                column.color
              )}>
                <span className="text-sm font-medium">{column.title}</span>
                <Badge variant="secondary" className="ml-2 text-xs">
                  {columnTasks.length}
                </Badge>
              </div>
              
              {/* Column Content - Better responsive design */}
              <Droppable droppableId={column.id} isDropDisabled={isDragDisabled && column.id !== 'todo'}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      "flex-1 p-4 border border-t-0 rounded-b-lg min-h-[400px] transition-all duration-200",
                      snapshot.isDraggingOver && "bg-accent/20 border-accent/30",
                      "bg-muted/20"
                    )}
                  >
                    <div className="space-y-3 h-full">
                      {columnTasks.map((task, index) => {
                        const assignedUser = getUserById(task.assignedTo);
                        
                        // For employees, only allow dragging their own tasks in To Do
                        const canDrag = !isEmployee || 
                          (task.assignedTo === currentUserId && column.id === 'todo');

                        return (
                          <Draggable 
                            key={task.id} 
                            draggableId={task.id} 
                            index={index}
                            isDragDisabled={!canDrag}
                          >
                            {(provided, snapshot) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={cn(
                                  "p-4 cursor-move hover:shadow-md transition-all duration-200 border-l-4",
                                  snapshot.isDragging && "shadow-lg rotate-1 scale-105",
                                  !canDrag && "cursor-not-allowed opacity-60",
                                  task.priority === 'high' && "border-l-destructive",
                                  task.priority === 'medium' && "border-l-warning", 
                                  task.priority === 'low' && "border-l-success"
                                )}
                              >
                                {/* Task Header - Better layout */}
                                <div className="flex items-start justify-between mb-3">
                                  <h4 className="font-medium text-sm line-clamp-2 flex-1 min-w-0">
                                    {task.title}
                                  </h4>
                                  <Badge 
                                    variant={getPriorityColor(task.priority)} 
                                    className="ml-2 text-xs flex-shrink-0"
                                  >
                                    {task.priority}
                                  </Badge>
                                </div>
                                
                                {/* Task Description - Improved spacing */}
                                <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
                                  {task.description}
                                </p>
                                
                                {/* Task Footer - Better alignment */}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <Avatar className="h-6 w-6 flex-shrink-0">
                                      <AvatarImage src={assignedUser?.avatar} />
                                      <AvatarFallback className="text-xs">
                                        {assignedUser?.name.split(' ').map(n => n[0]).join('')}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="text-xs text-muted-foreground truncate">
                                      {assignedUser?.name.split(' ')[0]}
                                    </span>
                                  </div>
                                  
                                  <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                                    {new Date(task.deadline).toLocaleDateString()}
                                  </span>
                                </div>
                                
                                {/* Project Info - Better styling */}
                                {task.project && (
                                  <div className="mt-3 pt-3 border-t border-border">
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                      📁 {task.project}
                                    </span>
                                  </div>
                                )}
                              </Card>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
