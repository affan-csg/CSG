import React, { ReactNode } from "react";
import { reportLovableError } from "@/lib/lovable-error-reporting";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
  onError?: (error: Error, info: React.ErrorInfo) => void;
  boundary?: string;
  level?: "page" | "section" | "component";
}

/**
 * Main error boundary for catching React rendering errors
 * Provides different UI based on error severity level
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });

    // Report to error tracking
    reportLovableError(error, {
      boundary: this.props.boundary ?? "unknown",
      level: this.props.level ?? "component",
      componentStack: errorInfo.componentStack,
    });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    // Log to console in development
    if (process.env["NODE_ENV"] === "development") {
      console.error("Error Boundary caught:", error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  override render() {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleReset);
      }

      // Default fallback based on level
      return (
        <ErrorBoundaryFallback
          error={this.state.error}
          level={this.props.level ?? "component"}
          onReset={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

interface ErrorBoundaryFallbackProps {
  error: Error;
  level: "page" | "section" | "component";
  onReset: () => void;
}

/**
 * Default error fallback UI with severity-based styling
 */
function ErrorBoundaryFallback({ error, level, onReset }: ErrorBoundaryFallbackProps) {
  const isDev = process.env["NODE_ENV"] === "development";

  if (level === "page") {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <div className="max-w-md text-center">
          <div className="mb-6 text-5xl">⚠️</div>
          <h1 className="mb-2 text-2xl font-bold text-navy">Something went wrong</h1>
          <p className="mb-6 text-sm text-muted-foreground">
            We encountered an unexpected error. Please try refreshing the page.
          </p>
          {isDev && (
            <details className="mb-6 rounded-md border border-red-200 bg-red-50 p-4 text-left">
              <summary className="cursor-pointer font-mono text-sm text-red-900">
                Error details (dev only)
              </summary>
              <pre className="mt-2 overflow-auto text-xs text-red-800">
                {error.message}
                {"\n"}
                {error.stack}
              </pre>
            </details>
          )}
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="rounded-md bg-navy px-6 py-2 font-semibold text-cream hover:bg-navy/90"
            >
              Refresh page
            </button>
            <a
              href="/"
              className="rounded-md border border-border px-6 py-2 font-semibold hover:border-gold hover:text-gold"
            >
              Go home
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (level === "section") {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6">
        <h2 className="mb-2 font-semibold text-yellow-900">Section unavailable</h2>
        <p className="mb-4 text-sm text-yellow-800">
          This section couldn't load. Try refreshing or come back later.
        </p>
        {isDev && <p className="font-mono text-xs text-yellow-700">{error.message}</p>}
        <button
          onClick={onReset}
          className="mt-4 rounded-md bg-yellow-900 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-800"
        >
          Try again
        </button>
      </div>
    );
  }

  // component level
  return (
    <div className="rounded-md border border-orange-200 bg-orange-50 p-4">
      <p className="text-sm text-orange-800">Component failed to load</p>
      {isDev && <p className="mt-2 font-mono text-xs text-orange-700">{error.message}</p>}
      <button
        onClick={onReset}
        className="mt-3 text-sm font-medium text-orange-900 hover:text-orange-700"
      >
        Retry
      </button>
    </div>
  );
}
