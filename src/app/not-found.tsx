export default function NotFoundPage() {
  return (
    <main className="auth-shell">
      <div className="panel auth-form">
        <span className="eyebrow">Missing Route</span>
        <h1>We could not find that workspace.</h1>
        <p>
          Check the company slug or return to the platform entrypoint to sign in again.
        </p>
      </div>
    </main>
  );
}
