import React, { createContext, PropsWithChildren, useContext, useMemo } from 'react';
import { useStore } from '@deriv/stores';
import { DBot } from '@deriv/bot-skeleton';
import RootStore from './root-store';
import type { TWebSocket } from 'Types';

const DBotStoreContext = createContext<RootStore | null>(null);

const DBotStoreProvider = ({ children, ws }: PropsWithChildren<{ ws: TWebSocket }>) => {
    const stores = useStore();
    const memoizedValue = useMemo(() => new RootStore(stores, ws, DBot), []);

    return <DBotStoreContext.Provider value={memoizedValue}>{children}</DBotStoreContext.Provider>;
};

// TODO: remove Omit<RootStore, ...> when RootStore is completely refactored [Task#93859]
const useDBotStore = (): Omit<RootStore, 'core' | 'ws' | 'ui' | 'common' | 'notifications' | 'server_time'> => {
    const store = useContext(DBotStoreContext);

    if (!store) {
        throw new Error('useDBotStore must be used within DBotStoreProvider');
    }

    return store;
};

export { DBotStoreProvider, useDBotStore };
