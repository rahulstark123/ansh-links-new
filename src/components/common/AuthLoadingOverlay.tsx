"use client";

interface AuthLoadingOverlayProps {
  message?: string;
  submessage?: string;
}

export default function AuthLoadingOverlay({
  message = "Authenticating",
  submessage = "Preparing your sanctuary",
}: AuthLoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/95 backdrop-blur-2xl">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-72 h-72 rounded-full bg-indigo-600/15 blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 rounded-full bg-violet-600/10 blur-[90px] animate-pulse [animation-delay:600ms]" />
      </div>

      <div className="relative flex flex-col items-center text-center px-6">
        <div className="relative mb-8">
          <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-xl scale-150 animate-pulse" />
          <div className="relative w-20 h-20 rounded-2xl bg-white border border-white/10 shadow-2xl shadow-indigo-500/20 flex items-center justify-center p-2.5">
            <img src="/logoAnshapps.png" alt="ANSH Apps" className="w-full h-full object-contain" />
          </div>
          <div className="absolute -inset-3 rounded-[1.75rem] border-2 border-indigo-500/30 border-t-indigo-400 animate-spin [animation-duration:1.2s]" />
        </div>

        <p className="text-lg font-black tracking-tight text-white mb-2">
          {message}
          <span className="inline-flex w-6 justify-start">
            <span className="animate-[pulse_1.4s_ease-in-out_infinite]">.</span>
            <span className="animate-[pulse_1.4s_ease-in-out_infinite_200ms]">.</span>
            <span className="animate-[pulse_1.4s_ease-in-out_infinite_400ms]">.</span>
          </span>
        </p>
        <p className="text-xs font-semibold text-slate-400 tracking-wide">{submessage}</p>
      </div>
    </div>
  );
}
