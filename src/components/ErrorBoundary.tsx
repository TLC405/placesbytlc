import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
  if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
          <Card className="max-w-md w-full p-6 sm:p-8 text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-destructive" aria-hidden="true" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-bold">Oops! Something went wrong</h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                The app encountered an unexpected error. Don't worry, your data is safe.
              </p>
            </div>

            {this.state.error && (
              <details className="text-left text-xs bg-muted p-3 rounded-lg">
                <summary className="cursor-pointer font-medium mb-2">
                  Error Details
                </summary>
                <pre className="overflow-auto text-destructive whitespace-pre-wrap break-words">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}

            <div className="space-y-3">
              <Button
                onClick={() => window.location.reload()}
                className="w-full"
                size="lg"
                aria-label="Reload application"
              >
                <RefreshCw className="w-4 h-4 mr-2" aria-hidden="true" />
                Reload App
              </Button>
              
              <Button
                variant="outline"
                onClick={() => {
                  this.setState({ hasError: false, error: undefined });
                }}
                className="w-full"
                aria-label="Try again"
              >
                Try Again
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              If this problem persists, try clearing your browser cache or contact support.
            </p>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
