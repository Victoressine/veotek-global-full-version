import { Component } from "react";

class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error("VeoTek application error:", error);
    console.error("Component stack:", errorInfo.componentStack);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          background: "#030311",
          color: "#f5f7ff",
          fontFamily:
            "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <section
          style={{
            width: "100%",
            maxWidth: "560px",
            padding: "32px",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: "24px",
            background: "rgba(255, 255, 255, 0.05)",
          }}
        >
          <p
            style={{
              margin: "0 0 12px",
              color: "#22d3ee",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}
          >
            VeoTek Global
          </p>

          <h1
            style={{
              margin: "0 0 16px",
              fontSize: "28px",
              lineHeight: 1.2,
            }}
          >
            The website could not be displayed
          </h1>

          <p
            style={{
              margin: "0 0 20px",
              color: "#cbd5e1",
              lineHeight: 1.7,
            }}
          >
            A browser compatibility or application error occurred while loading
            this page.
          </p>

          {this.state.error?.message && (
            <pre
              style={{
                overflowX: "auto",
                margin: "0 0 24px",
                padding: "16px",
                borderRadius: "12px",
                background: "rgba(0, 0, 0, 0.35)",
                color: "#fca5a5",
                fontSize: "12px",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {this.state.error.message}
            </pre>
          )}

          <button
            type="button"
            onClick={this.handleReload}
            style={{
              border: 0,
              borderRadius: "999px",
              padding: "12px 22px",
              background: "linear-gradient(90deg, #00cfff, #8b5cff)",
              color: "#ffffff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Reload website
          </button>
        </section>
      </main>
    );
  }
}

export default AppErrorBoundary;