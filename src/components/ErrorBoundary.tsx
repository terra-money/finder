import { Component, ReactNode } from "react";

const OOPS = "Oops! Something went wrong.";

type Props = { fallback?: ReactNode };
class ErrorBoundary extends Component<Props> {
  state = { hasError: null };
  static getDerivedStateFromError = () => ({ hasError: true });

  render() {
    const { fallback = OOPS, children } = this.props;
    const { hasError } = this.state;
    return hasError ? fallback : children;
  }
}

export default ErrorBoundary;
