import React from 'react';

interface SkeletonProps {
  className?: string;
  height?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', height }) => (
  <div className={`bg-slate-200 dark:bg-slate-700 rounded animate-pulse ${className}`} style={height ? { height } : undefined} />
);

interface SkeletonLoaderProps {
  count?: number;
  height?: string;
  lines?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  count = 1,
  height = '20px',
  lines = 3,
}) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-2">
          {Array.from({ length: lines }).map((_, j) => (
            <Skeleton
              key={j}
              className={`${j === lines - 1 ? 'w-3/4' : 'w-full'}`}
              height={height}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export const CardSkeleton: React.FC = () => (
  <div className="card animate-pulse">
    <div className="card-header">
      <Skeleton className="h-6 w-1/3" />
    </div>
    <div className="card-body space-y-4">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/6" />
    </div>
  </div>
);

export const FormSkeleton: React.FC = () => (
  <div className="card animate-pulse">
    <div className="card-header">
      <Skeleton className="h-6 w-1/2" />
    </div>
    <div className="card-body space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-24 w-full" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-10 w-1/2" />
      </div>
    </div>
  </div>
);
