import { createContext, useContext, useState, useCallback } from 'react';

interface RefreshContextValue {
    tick: number;
    refresh: () => void;
}

const RefreshContext = createContext<RefreshContextValue>({ tick: 0, refresh: () => { } });

export function RefreshProvider({ children }: { children: React.ReactNode }) {
    const [tick, setTick] = useState(0);
    const refresh = useCallback(() => setTick(t => t + 1), []);
    return <RefreshContext.Provider value={{ tick, refresh }}>{children}</RefreshContext.Provider>;
}

export function useRefresh() {
    return useContext(RefreshContext);
}
