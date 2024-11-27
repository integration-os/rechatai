import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ColorfulLoadingAnimation } from '../colorful-loading-animation';
import { IconSpinner } from './icons';

interface LoadingProps {
  text?: string;
}

const Loading: React.FC<LoadingProps> = ({ text = '' }) => {
  return (
    <div className="flex flex-col space-y-3 p-8 w-full h-full items-center justify-center bg-background">
      {/* <ColorfulLoadingAnimation scale={1} /> */}
      <IconSpinner className="" />
      {text && (
        <p className="text-sm text-muted-foreground animate-text-light-sweep">
          {text}
        </p>
      )}
    </div>
  );
};

export default Loading;