import React from "react";

// HOC for adding error boundary to a component
function withErrorBoundary(WrappedComponent) {
  return class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { error: null, errorInfo: null };
    }

    componentDidCatch(error, errorInfo) {
      // Log error to server, console, or error reporting tool
      console.error(error);
      console.error(errorInfo);
      this.setState({ error, errorInfo });
    }

    render() {
      const { error, errorInfo } = this.state;

      // If there's an error, display error message or fallback UI
      if (error) {
        return (
          <div>
            <h1>Something went wrong.</h1>
            <details style={{ whiteSpace: "pre-wrap" }}>
              {error && error.toString()}
              <br />
              {errorInfo && errorInfo.componentStack}
            </details>
          </div>
        );
      }

      // Otherwise, render the wrapped component
      return <WrappedComponent {...this.props} />;
    }
  };
}

export default withErrorBoundary;
