import { Component, ErrorInfo, ReactNode } from "react";

type Props = {
    children: ReactNode;
};

type State = {
    hasError: boolean;
    isReactError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
};

export default class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, isReactError: false, error: null, errorInfo: null };
    }

    componentDidMount() {
        window.addEventListener("error", this.handleWindowError);
        window.addEventListener("unhandledrejection", this.handlePromiseRejection);
    }

    componentWillUnmount() {
        window.removeEventListener("error", this.handleWindowError);
        window.removeEventListener("unhandledrejection", this.handlePromiseRejection);
    }

    handleWindowError = (event: ErrorEvent) => {
        this.setState({
            hasError: true,
            isReactError: false,
            error: event.error || new Error(event.message),
            errorInfo: { componentStack: "\n    at (Global Window Error)" } as ErrorInfo,
        });
    };

    handlePromiseRejection = (event: PromiseRejectionEvent) => {
        this.setState({
            hasError: true,
            isReactError: false,
            error: event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
            errorInfo: { componentStack: "\n    at (Unhandled Promise Rejection)" } as ErrorInfo,
        });
    };

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, isReactError: true, error, errorInfo: null };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    generateReport() {
        return `
**Error:** \`${this.state.error?.toString()}\`

**Stack Trace:**
\`\`\`
${this.state.errorInfo?.componentStack}
\`\`\`

**User Agent:** ${navigator.userAgent}
**Time:** ${new Date().toISOString()}
`.trim();
    }

    handleCopy = () => {
        navigator.clipboard.writeText(this.generateReport());
        alert("Error report copied to clipboard!");
    };

    handleGithubIssue = () => {
        const title = `Crash: ${this.state.error?.message}`;
        const body = encodeURIComponent(
            `I encountered an error while using Shutter Tester.\n\n${this.generateReport()}`
        );
        const url = `https://github.com/MichalTorma/shutter-tester/issues/new?title=${encodeURIComponent(
            title
        )}&body=${body}`;
        window.open(url, "_blank");
    };

    render() {
        return (
            <>
                {(!this.state.hasError || !this.state.isReactError) && this.props.children}
                {this.state.hasError && (
                    <div
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: "rgba(0,0,0,0.7)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 9999,
                        }}
                    >
                        <div
                            style={{
                                background: "#222",
                                color: "#fff",
                                padding: "2rem",
                                borderRadius: "8px",
                                maxWidth: "600px",
                                width: "90%",
                                maxHeight: "90vh",
                                overflowY: "auto",
                                boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                                border: "1px solid #444",
                            }}
                        >
                            <h2 style={{ marginTop: 0, color: "#ff6b6b" }}>
                                Something went wrong
                            </h2>
                            <p style={{ color: "#ccc" }}>
                                An unexpected error occurred. Please report this issue to help us
                                fix it.
                            </p>
                            <div
                                style={{
                                    background: "#111",
                                    color: "#f8f8f2",
                                    padding: "1rem",
                                    borderRadius: "4px",
                                    overflow: "auto",
                                    maxHeight: "300px",
                                    marginBottom: "1.5rem",
                                    whiteSpace: "pre-wrap",
                                    fontFamily: "monospace",
                                    fontSize: "0.9rem",
                                    border: "1px solid #333",
                                }}
                            >
                                <strong style={{ color: "#ff6b6b" }}>
                                    {this.state.error?.toString()}
                                </strong>
                                <br />
                                {this.state.errorInfo?.componentStack}
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    gap: "1rem",
                                    justifyContent: "flex-end",
                                }}
                            >
                                <button
                                    onClick={this.handleCopy}
                                    style={{
                                        background: "#007bff",
                                        color: "white",
                                    }}
                                >
                                    Copy Report
                                </button>
                                <button
                                    onClick={this.handleGithubIssue}
                                    style={{
                                        background: "#28a745",
                                        color: "white",
                                    }}
                                >
                                    Open GitHub Issue
                                </button>
                                <button
                                    onClick={() => window.location.reload()}
                                    style={{
                                        background: "#6c757d",
                                        color: "white",
                                    }}
                                >
                                    Reload Page
                                </button>
                                <button
                                    onClick={() => this.setState({ hasError: false })}
                                    style={{
                                        background: "transparent",
                                        border: "1px solid #6c757d",
                                        color: "#ccc",
                                    }}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    }
}
