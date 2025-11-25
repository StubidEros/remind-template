
import { Assignment } from "../types/assignment";
import { Check, Trash2, Clock, Bell } from "lucide-react";
import { format } from "date-fns";

interface AssignmentCardProps {
  assignment: Assignment;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const AssignmentCard = ({ assignment, onToggle, onDelete }: AssignmentCardProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600 dark:text-red-400";
      case "medium": return "text-yellow-600 dark:text-yellow-400";
      case "low": return "text-green-600 dark:text-green-400";
      default: return "text-gray-600 dark:text-gray-400";
    }
  };

  return (
    <div className={`p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-200 ${
      assignment.completed ? "opacity-60" : "hover:shadow-md"
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <button
            onClick={() => onToggle(assignment.id)}
            className={`h-6 w-6 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
              assignment.completed 
                ? "bg-blue-500 border-blue-500 text-white" 
                : "border-gray-300 dark:border-gray-600 hover:border-blue-500"
            }`}
          >
            {assignment.completed && <Check className="h-3 w-3" />}
          </button>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`font-medium text-sm ${
                assignment.completed ? "line-through text-gray-500" : "text-gray-900 dark:text-white"
              }`}>
                {assignment.name}
              </h3>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-2">
              <span>{assignment.subject}</span>
              <span>•</span>
              <span className={`capitalize ${getPriorityColor(assignment.priority)}`}>
                {assignment.priority} priority
              </span>
            </div>
            
            {assignment.description && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                {assignment.description}
              </p>
            )}
            
            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Due {format(assignment.deadline, "MMM d, yyyy 'at' h:mm a")}</span>
              </div>
              {assignment.reminderTime && (
                <div className="flex items-center gap-1">
                  <Bell className="h-3 w-3" />
                  <span>Reminder at {assignment.reminderTime}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <button
          onClick={() => onDelete(assignment.id)}
          className="h-8 w-8 text-gray-400 hover:text-red-500 flex-shrink-0 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default AssignmentCard;
