export default function AsyncContent({ loading, error, children }) {
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  if (error) {
    return <div className="error">Error: {error}</div>;
  }
  return children;
}
