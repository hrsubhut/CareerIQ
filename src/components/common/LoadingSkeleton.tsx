import React from 'react';
import { AlertCircle, RefreshCw, SearchX } from 'lucide-react';

export const LoadingSkeleton: React.FC<{ rows?: number; heightClass?: string }> = ({
  rows = 3,
  heightClass = 'h-24',
}) => {
  return (
    <div className="space-y-4 w-full animate-pulse" aria-label="Loading content...">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className={`w-full bg-slate-900/70 border border-slate-800/80 rounded-xl ${heightClass} p-4 flex flex-col justify-between`}
        >
          <div className="flex items-center space-x-3">
            <div className="h-6 w-1/3 bg-slate-800 rounded"></div>
            <div className="h-4 w-16 bg-slate-800/60 rounded"></div>
          </div>
          <div className="space-y-2">
            <div className="h-3 w-3/4 bg-slate-800/40 rounded"></div>
            <div className="h-3 w-1/2 bg-slate-800/40 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const EmptyState: React.FC<{
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}> = ({ title, description, actionText, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-900/40 border border-slate-800/80 rounded-2xl">
      <div className="p-4 bg-slate-800/50 rounded-2xl text-slate-400 mb-4">
        <SearchX className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-slate-200">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm mt-1 mb-5">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-lg shadow-indigo-600/20"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export const ErrorState: React.FC<{
  title?: string;
  message?: string;
  onRetry?: () => void;
}> = ({
  title = 'Unable to load analytical intelligence',
  message = 'Failed to connect to dataset pipeline. Check network connection or retry.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-rose-950/20 border border-rose-900/30 rounded-2xl my-4">
      <div className="p-3 bg-rose-900/30 text-rose-400 rounded-xl mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h4 className="text-base font-semibold text-rose-200">{title}</h4>
      <p className="text-sm text-rose-300/80 max-w-md mt-1 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-rose-100 bg-rose-900/40 hover:bg-rose-900/60 border border-rose-800/50 rounded-lg transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry Connection
        </button>
      )}
    </div>
  );
};
