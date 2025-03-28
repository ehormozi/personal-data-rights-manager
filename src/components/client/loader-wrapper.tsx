'use client';

import { Suspense } from 'react';

import LoadingSpinner from '@/components/server/loading-spinner';

type LoaderWrapperProps = {
  children: React.ReactNode;
};

export default function LoaderWrapper({ children }: LoaderWrapperProps) {
  return <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>;
}
