"use client"

import { Component, type ReactNode } from "react"
import { Button } from "@/components/ui/button"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center px-4 py-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-destructive"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
            Something went wrong
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
          </p>
          <div className="flex gap-3">
            <Button onClick={this.handleReset} variant="default">
              Try Again
            </Button>
            <Button onClick={() => window.location.reload()} variant="outline">
              Refresh Page
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 text-center">
      <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
        Something went wrong!
      </h2>
      <p className="text-muted-foreground mb-6">
        An unexpected error occurred.
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  )
}
