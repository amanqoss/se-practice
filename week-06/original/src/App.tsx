import { Building2 } from "lucide-react";
import RoomChecker from "./components/RoomChecker";
import { SAMPLE_ROOMS } from "./data";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-5 sm:px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600 text-white shadow-sm">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold leading-tight sm:text-xl">
              Smart Campus Room Availability Checker
            </h1>
            <p className="text-xs text-slate-500 sm:text-sm">
              Check whether a campus room can be booked for a requested time interval.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <RoomChecker rooms={SAMPLE_ROOMS} />
      </main>

      <footer className="mx-auto max-w-5xl px-4 pb-10 text-center text-xs text-slate-400 sm:px-6">
        Fictional sample data only. This tool checks availability without changing any booking.
      </footer>
    </div>
  );
}
