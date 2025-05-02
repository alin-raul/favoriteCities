// src/components/ErrorBoundary.tsx
"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode; // Optional fallback UI prop
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  // static getDerivedStateFromError(_: Error): State {
  //   // Update state so the next render will show the fallback UI.
  //   return { hasError: true };
  // }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error caught by Error Boundary:", error, errorInfo);
    this.setState({ hasError: true, error });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="p-4 border border-red-400 bg-red-100 text-red-700 rounded-md">
          <h2>Something went wrong.</h2>
          {this.state.error && (
            <p className="text-sm mt-2">{this.state.error.message}</p>
          )}
          {/* Optionally show more details in development */}
          {/* {process.env.NODE_ENV === 'development' && <pre>{this.state.error?.stack}</pre>} */}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
