
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Assignment } from "./types/assignment";
import Header from "./components/Header";
import AssignmentCard from "./components/AssignmentCard";
import AddAssignmentDialog from "./components/AddAssignmentDialog";
import CalendarView from "./components/CalendarView";
import AIHelpDialog from "./components/AIHelpDialog";
import { useNotifications } from "./hooks/useNotifications";

function App() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [aiDialogOpen, setAIDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Enable notifications
  useNotifications(assignments);

  // Load assignments from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("remind-assignments");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Convert date strings back to Date objects
        const assignmentsWithDates = parsed.map((a: any) => ({
          ...a,
          deadline: new Date(a.deadline),
          createdAt: new Date(a.createdAt),
        }));
        setAssignments(assignmentsWithDates);
      } catch (error) {
        console.error("Error loading assignments:", error);
      }
    }
  }, []);

  // Save assignments to localStorage
  useEffect(() => {
    if (assignments.length > 0) {
      localStorage.setItem("remind-assignments", JSON.stringify(assignments));
    }
  }, [assignments]);

  const handleAddAssignment = (newAssignment: Omit<Assignment, "id" | "completed" | "createdAt">) => {
    const assignment: Assignment = {
      ...newAssignment,
      id: crypto.randomUUID(),
      completed: false,
      createdAt: new Date(),
    };
    
    setAssignments((prev) => [...prev, assignment]);
  };

  const handleToggleComplete = (id: string) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, completed: !a.completed } : a))
    );
  };

  const handleDeleteAssignment = (id: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  };

  // Filter assignments based on search
  const filteredAssignments = assignments.filter(assignment =>
    assignment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort assignments: incomplete first, then by deadline
  const sortedAssignments = [...filteredAssignments].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return a.deadline.getTime() - b.deadline.getTime();
  });

  const incompleteCount = assignments.filter(a => !a.completed).length;
  const completedCount = assignments.filter(a => a.completed).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header
        onCalendarClick={() => setCalendarOpen(true)}
        onAIClick={() => setAIDialogOpen(true)}
      />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Stats Bar */}
        {assignments.length > 0 && (
          <div className="flex items-center justify-between mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-6 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{incompleteCount}</div>
                <div className="text-gray-500 dark:text-gray-400">To Do</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{completedCount}</div>
                <div className="text-gray-500 dark:text-gray-400">Done</div>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {assignments.length === 0 ? (
          <div className="text-center py-20">
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-xl">
                <Plus className="h-12 w-12 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              No tasks yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
              Start organizing your day by adding your first task
            </p>
            <button 
              onClick={() => setAddDialogOpen(true)}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 mx-auto"
            >
              <Plus className="h-5 w-5" />
              Add Task
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedAssignments.map((assignment) => (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                onToggle={handleToggleComplete}
                onDelete={handleDeleteAssignment}
              />
            ))}
            
            {filteredAssignments.length === 0 && searchTerm && (
              <div className="text-center py-12">
                <div className="text-gray-500 dark:text-gray-400 text-lg">
                  No assignments found for "{searchTerm}"
                </div>
                <button 
                  onClick={() => setSearchTerm("")}
                  className="mt-2 text-blue-500 hover:text-blue-600 transition-colors"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      {assignments.length > 0 && (
        <button
          onClick={() => setAddDialogOpen(true)}
          className="fixed bottom-6 right-6 h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-2xl hover:shadow-blue-500/50 transition-all duration-200 flex items-center justify-center"
        >
          <Plus className="h-7 w-7" />
        </button>
      )}

      {/* Dialogs */}
      <AddAssignmentDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAdd={handleAddAssignment}
      />

      <CalendarView
        open={calendarOpen}
        onOpenChange={setCalendarOpen}
        assignments={assignments}
      />

      <AIHelpDialog 
        open={aiDialogOpen} 
        onOpenChange={setAIDialogOpen} 
      />

      {/* Demo notification permission button */}
      {assignments.length > 0 && (
        <div className="fixed bottom-6 left-6">
          <button
            onClick={() => {
              if ("Notification" in window && Notification.permission === "default") {
                Notification.requestPermission();
              }
            }}
            className="px-3 py-2 text-xs bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Enable Reminders
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
