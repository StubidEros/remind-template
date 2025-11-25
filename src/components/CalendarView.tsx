
import { Assignment } from "../types/assignment";
import Badge from "./Badge";
import { isSameDay, format } from "date-fns";
import { useState } from "react";
import { X } from "lucide-react";

interface CalendarViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignments: Assignment[];
}

const CalendarView = ({ open, onOpenChange, assignments }: CalendarViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const assignmentsForDate = assignments.filter((a) => isSameDay(a.deadline, selectedDate));

  if (!open) return null;

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const days = getDaysInMonth(selectedDate);
  const monthYear = format(selectedDate, "MMMM yyyy");

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setSelectedDate(newDate);
  };

  const hasAssignment = (date: Date) => {
    return assignments.some(a => isSameDay(a.deadline, date));
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={() => onOpenChange(false)}
    >
      <div 
        className="bg-white dark:bg-gray-900 sm:max-w-[600px] w-full rounded-lg border border-gray-200 dark:border-gray-700 shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Assignment Calendar</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              View your assignments organized by date.
            </p>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="h-6 w-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  ←
                </button>
                <h3 className="font-semibold text-gray-900 dark:text-white">{monthYear}</h3>
                <button
                  onClick={() => navigateMonth('next')}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  →
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-2">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {days.map((date, index) => (
                  <button
                    key={index}
                    onClick={() => date && setSelectedDate(date)}
                    className={`h-10 rounded-lg text-sm transition-colors ${
                      date
                        ? selectedDate && date.toDateString() === selectedDate.toDateString()
                          ? 'bg-blue-500 text-white'
                          : hasAssignment(date)
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800/50'
                          : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                        : ''
                    }`}
                    disabled={!date}
                  >
                    {date ? date.getDate() : ''}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 space-y-3 min-h-[300px]">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm text-gray-700 dark:text-gray-300">
                  Assignments for {format(selectedDate, "MMMM d, yyyy")}
                </h3>
                {assignmentsForDate.length > 0 && (
                  <Badge variant="secondary">
                    {assignmentsForDate.length} assignment{assignmentsForDate.length !== 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
              
              {assignmentsForDate.length > 0 ? (
                <div className="space-y-2 max-h-[250px] overflow-y-auto">
                  {assignmentsForDate.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-all duration-200"
                    >
                      <div className="font-medium text-sm text-gray-900 dark:text-white mb-1">
                        {assignment.name}
                      </div>
                      {assignment.description && (
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                          {assignment.description}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {assignment.subject}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            assignment.priority === "high" 
                              ? "border-red-200 text-red-700 dark:border-red-800 dark:text-red-300"
                              : assignment.priority === "medium"
                              ? "border-yellow-200 text-yellow-700 dark:border-yellow-800 dark:text-yellow-300"
                              : "border-green-200 text-green-700 dark:border-green-800 dark:text-green-300"
                          }`}
                        >
                          {assignment.priority}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        Due: {format(assignment.deadline, "h:mm a")}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No assignments due on this day.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
