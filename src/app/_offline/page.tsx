export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 child-mode">
      <div className="card text-center max-w-md">
        <div className="icon-xl mb-4">📡</div>
        <h1 className="text-2xl font-bold mb-2">You&apos;re Offline</h1>
        <p className="text-foreground-muted mb-6">
          Don&apos;t worry! Your data is safe. Connect to the internet to sync
          your progress.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
