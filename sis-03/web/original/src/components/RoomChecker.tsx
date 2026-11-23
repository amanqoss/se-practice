import { useMemo, useState } from "react";
import { CheckCircle2, Clock, DoorClosed, XCircle } from "lucide-react";
import type { CheckResult, Room } from "../types";
import { checkAvailability, hhmmToMinutes, minutesToHHMM } from "../lib/availability";

interface RoomCheckerProps {
  rooms: Room[];
}

function nowToHHMM(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function RoomChecker({ rooms }: RoomCheckerProps) {
  const [roomId, setRoomId] = useState<string>(rooms[0]?.id ?? "");
  const [current, setCurrent] = useState<string>(nowToHHMM());
  const [start, setStart] = useState<string>("09:00");
  const [end, setEnd] = useState<string>("10:00");

  const result: CheckResult | null = useMemo(() => {
    const currentMin = hhmmToMinutes(current);
    const startMin = hhmmToMinutes(start);
    const endMin = hhmmToMinutes(end);
    if (currentMin === null || startMin === null || endMin === null) {
      return null;
    }
    return checkAvailability(rooms, {
      roomId,
      start: startMin,
      end: endMin,
      currentTime: currentMin,
    });
  }, [rooms, roomId, current, start, end]);

  const selectedRoom = rooms.find((r) => r.id === roomId);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Check a room</h2>
        <p className="mt-1 text-sm text-slate-500">
          Times use a 24-hour clock. Bookings max 120 minutes. Touching intervals are allowed.
        </p>

        <div className="mt-5 flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-slate-700">Room</span>
            <select
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
            >
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} - {r.building} {r.blocked ? "(blocked)" : ""}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-slate-700">Current time</span>
            <input
              type="time"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
            />
            <span className="text-xs text-slate-500">
              The requested start must be after this time.
            </span>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-slate-700">Start</span>
              <input
                type="time"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-slate-700">End</span>
              <input
                type="time"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
              />
            </label>
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Clock className="h-4 w-4" />
            <span>
              Requested: <strong className="text-slate-900">{start}</strong> to{" "}
              <strong className="text-slate-900">{end}</strong>
              {end && start && hhmmToMinutes(end) !== null && hhmmToMinutes(start) !== null && (
                <> ({Math.max(0, (hhmmToMinutes(end)! - hhmmToMinutes(start)!))} min)</>
              )}
            </span>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <ResultCard result={result} roomName={selectedRoom?.name} />

        {selectedRoom && <RoomCard room={selectedRoom} />}
      </section>
    </div>
  );
}

function ResultCard({
  result,
  roomName,
}: {
  result: CheckResult | null;
  roomName?: string;
}) {
  if (!result) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <p className="text-sm font-medium text-amber-800">
          Enter valid times to see a decision.
        </p>
      </div>
    );
  }

  if (result.decision === "available") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-7 w-7 text-emerald-600" />
          <div>
            <p className="text-base font-semibold text-emerald-900">
              Available
            </p>
            <p className="text-sm text-emerald-700">
              {roomName ? `${roomName} can be booked for this interval.` : "This room can be booked."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <XCircle className="h-7 w-7 text-rose-600" />
        <div>
          <p className="text-base font-semibold text-rose-900">Unavailable</p>
          <p className="text-sm text-rose-700">
            This request cannot be booked. See reasons below.
          </p>
        </div>
      </div>
      <ul className="mt-3 space-y-1 text-sm text-rose-800">
        {result.reasons.map((r, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-rose-500" />
            <span>{r}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RoomCard({ room }: { room: Room }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{room.name}</h3>
          <p className="text-sm text-slate-500">
            {room.building} · seats {room.capacity}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            room.blocked
              ? "bg-rose-100 text-rose-700"
              : "bg-emerald-100 text-emerald-700"
          }`}
        >
          {room.blocked ? "Blocked" : "Open"}
        </span>
      </div>

      <div className="mt-4">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <DoorClosed className="h-4 w-4" />
          Existing bookings today
        </div>
        {room.bookings.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">No bookings on file.</p>
        ) : (
          <ul className="mt-2 divide-y divide-slate-100 rounded-lg border border-slate-100">
            {room.bookings
              .slice()
              .sort((a, b) => a.start - b.start)
              .map((b, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between px-3 py-2 text-sm"
                >
                  <span className="text-slate-700">{b.reservedBy}</span>
                  <span className="font-mono text-slate-600">
                    {minutesToHHMM(b.start)}-{minutesToHHMM(b.end)}
                  </span>
                </li>
              ))}
          </ul>
        )}
        <p className="mt-3 text-xs text-slate-400">
          Existing bookings are read-only and are not modified by this checker.
        </p>
      </div>
    </div>
  );
}
