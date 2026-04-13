import { Component, ReactNode } from 'react';

interface Props { children: ReactNode; }
interface State { error: Error | null; }

export class ErrorBoundary extends Component<Props, State> {
    state: State = { error: null };

    static getDerivedStateFromError(error: Error): State {
        return { error };
    }

    render() {
        if (this.state.error) {
            return (
                <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'center', height: '100vh', fontFamily: 'system-ui, sans-serif',
                    padding: 24, textAlign: 'center',
                }}>
                    <div style={{ fontSize: 40, marginBottom: 16 }}>⚠️</div>
                    <h2 style={{ margin: '0 0 8px', color: '#dc2626' }}>Something went wrong</h2>
                    <p style={{ color: '#6b7280', marginBottom: 16, maxWidth: 500 }}>
                        {this.state.error.message}
                    </p>
                    <pre style={{
                        background: '#f3f4f6', padding: 16, borderRadius: 8,
                        fontSize: 12, textAlign: 'left', maxWidth: 600, overflow: 'auto',
                        color: '#374151',
                    }}>
                        {this.state.error.stack}
                    </pre>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            marginTop: 20, padding: '10px 24px', background: '#3b82f6',
                            color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer',
                        }}
                    >
                        Reload
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}
