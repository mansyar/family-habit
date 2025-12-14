import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 child-mode">
      {/* Hero */}
      <div className="text-center max-w-2xl">
        <div className="text-8xl mb-6 animate-float">🌟</div>
        <h1 className="text-5xl font-bold mb-4">Family Habit</h1>
        <p className="text-xl text-foreground-muted mb-8">
          Build healthy habits for your children with fun rewards and stickers!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login" className="btn-primary text-lg px-8 py-4">
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-8 py-4 bg-white border-2 border-primary text-primary rounded-lg font-semibold hover:bg-amber-50 transition"
          >
            Create Account
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl">
        <div className="card text-center">
          <div className="text-4xl mb-4">📋</div>
          <h3 className="font-bold mb-2">Track Daily Tasks</h3>
          <p className="text-foreground-muted text-sm">
            Create habits like brushing teeth, reading, and more
          </p>
        </div>
        <div className="card text-center">
          <div className="text-4xl mb-4">⭐</div>
          <h3 className="font-bold mb-2">Earn Stars</h3>
          <p className="text-foreground-muted text-sm">
            Complete tasks to collect stars and unlock rewards
          </p>
        </div>
        <div className="card text-center">
          <div className="text-4xl mb-4">🎨</div>
          <h3 className="font-bold mb-2">Collect Stickers</h3>
          <p className="text-foreground-muted text-sm">
            Unlock 15 fun stickers as you reach milestones
          </p>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-16 text-foreground-muted">Made with ❤️ for families</p>
    </div>
  );
}
