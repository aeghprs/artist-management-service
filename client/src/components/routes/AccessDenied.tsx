const AccessDenied = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "5rem" }}>
      <h1>403 - Access Denied</h1>
      <p>You don’t have permission to access this page.</p>
      <a href="/dashboard" className="text-primary underline hover:text-primary/90">
        Return to dashboard
      </a>
    </div>
  );
};

export default AccessDenied;
