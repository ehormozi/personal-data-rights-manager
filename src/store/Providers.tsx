// src/store/Providers.tsx
'use client'; // Important to make this component client-side

import { Provider } from 'react-redux';
import store from './index';

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider store={store}>{children}</Provider>;
}
