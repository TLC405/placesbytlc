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
          <Card className="max-w-md w-full p-8 text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">Oops! Something went wrong</h1>
              <p className="text-muted-foreground">
                The app encountered an unexpected error. Don't worry, your data is safe.
              </p>
            </div>

            {this.state.error && (
              <details className="text-left text-xs bg-muted p-3 rounded-lg">
                <summary className="cursor-pointer font-medium mb-2">
                  Error Details
                </summary>
                <pre className="overflow-auto text-destructive">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}

            <div className="space-y-3">
              <Button
                onClick={() => window.location.reload()}
                className="w-full"
                size="lg"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reload App
              </Button>
              
              <Button
                variant="outline"
                onClick={() => {
                  this.setState({ hasError: false, error: undefined });
                }}
                className="w-full"
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
