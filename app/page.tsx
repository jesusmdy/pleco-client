import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-md-background font-sans">
      <main className="flex flex-1 w-full max-w-4xl flex-col items-center justify-center py-32 px-16 bg-md-background sm:items-start text-md-on-surface">
        <div className="flex flex-col items-center gap-8 text-center sm:items-start sm:text-left">
          <h1 className="max-w-2xl text-5xl font-semibold leading-[1.1] tracking-tight text-md-on-surface">
            Secure cloud storage for the modern professional.
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-md-on-surface-variant font-normal">
            Experience a new standard of digital privacy and organization. Built on the 
            Material Design Expressive philosophy for a fluid, natural, and secure experience.
          </p>
        </div>

        <div className="flex flex-col gap-5 mt-12 sm:flex-row w-full sm:w-auto">
          <a
            className="flex h-14 items-center justify-center gap-3 rounded-2xl bg-md-primary px-8 text-md-on-primary font-bold uppercase tracking-[0.1em] transition-all hover:bg-md-primary/90 shadow-lg shadow-md-primary/20 active:scale-95"
            href="/fm/drive"
          >
            Go to Drive
          </a>
          <a
            className="flex h-14 items-center justify-center rounded-2xl border border-md-outline-variant/30 px-8 text-md-on-surface transition-all hover:bg-md-surface-variant/20 active:scale-95 font-semibold"
            href="/auth/sign-in"
          >
            Sign In
          </a>
        </div>
      </main>
    </div>
  );
}
