
import { Calendar, Bot } from "lucide-react";

interface HeaderProps {
  onCalendarClick: () => void;
  onAIClick: () => void;
}

const Header = ({ onCalendarClick, onAIClick }: HeaderProps) => {
  return (
    <header className="border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Remind</h1>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={onCalendarClick}
              className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <Calendar className="h-4 w-4" />
              Calendar
            </button>
            <button
              onClick={onAIClick}
              className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <Bot className="h-4 w-4" />
              AI Help
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
