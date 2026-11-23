import { useState } from 'react';
import { checkRoom } from './booking';
import { filterRooms } from './filter';
import { ROOMS } from './rooms';

const NOW = 9 * 60;
const equipmentOptions = [...new Set(ROOMS.flatMap(room => room.equipment))].sort();

function toMinutes(clock: string) {
  const [hours, minutes] = clock.split(':').map(Number);
  return hours * 60 + minutes;
}

function formatTime(minutes: number) {
  const hour = Math.floor(minutes / 60).toString().padStart(2, '0');
  return hour + ':' + (minutes % 60).toString().padStart(2, '0');
}

export default function App() {
  const [attendees, setAttendees] = useState('1');
  const [equipment, setEquipment] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState(ROOMS[0]?.id ?? '');
  const [start, setStart] = useState('11:00');
  const [end, setEnd] = useState('12:00');
  const [midnight, setMidnight] = useState(false);
  const count = Number(attendees);
  const validCount = Number.isSafeInteger(count) && count >= 1;
  const matches = validCount ? filterRooms(ROOMS, { attendees: count, equipment }) : [];
  const room = matches.find(candidate => candidate.id === selectedId) ?? matches[0];
  const inputError = !start ? 'Enter a start time.' : !midnight && !end ? 'Enter an end time.' : '';
  const request = { start: toMinutes(start), end: midnight ? 1440 : toMinutes(end), now: NOW };
  const available = Boolean(room && !inputError && checkRoom(ROOMS, room.id, request));

  return (
    <main>
      <header><span className="campus">Smart Campus</span><h1>Room availability</h1></header>
      <div className="columns">
        <section className="panel filters" aria-labelledby="criteria-heading">
          <h2 id="criteria-heading">Room requirements</h2>
          <label className="field">Attendees
            <input type="number" min="1" step="1" value={attendees}
              aria-invalid={!validCount} onChange={event => setAttendees(event.target.value)} />
          </label>
          <fieldset><legend>Required equipment</legend>
            {equipmentOptions.map(item => (
              <label className="choice" key={item}>
                <input type="checkbox" checked={equipment.includes(item)} onChange={event =>
                  setEquipment(event.target.checked ? [...equipment, item] : equipment.filter(value => value !== item))} />
                {item}
              </label>
            ))}
          </fieldset>
        </section>
        <section className="panel rooms" aria-labelledby="rooms-heading">
          <h2 id="rooms-heading">Matching rooms {validCount && <span className="count">{matches.length}</span>}</h2>
          {!room ? <p className="empty" role="status">{validCount
            ? 'No rooms match your requirements. Try fewer attendees or remove an equipment requirement.'
            : 'Enter a whole number of attendees, at least 1.'}</p> : <>
            <label className="field">Room
              <select value={room.id} onChange={event => setSelectedId(event.target.value)}>
                {matches.map(match => <option key={match.id} value={match.id}>{match.name}{match.blocked ? ' (blocked)' : ''}</option>)}
              </select>
            </label>
            <p className="details">{room.capacity} seats · {room.equipment.join(', ')}{room.blocked && ' · Blocked'}</p>
            <h3>Existing bookings</h3>
            <p className="schedule">{room.bookings.length
              ? room.bookings.map(slot => formatTime(slot.start) + '–' + formatTime(slot.end)).join(', ')
              : 'No existing bookings.'}</p>
            <div className="times">
              <label className="field">Start<input type="time" value={start} onChange={e => setStart(e.target.value)} /></label>
              <label className="field">End<input type="time" value={end} disabled={midnight} onChange={e => setEnd(e.target.value)} /></label>
            </div>
            <label className="choice"><input type="checkbox" checked={midnight} onChange={e => setMidnight(e.target.checked)} />Ends at 24:00</label>
            <p className="guide">Current time is fixed at 09:00. Choose a later start and an end within 120 minutes.</p>
            <div className={'decision ' + (available ? 'yes' : 'no')} role="status">
              <strong>{available ? 'Available' : 'Unavailable'}</strong>
              <span>{inputError || (available ? room.name + ' is free for this interval.'
                : room.blocked ? room.name + ' is blocked.' : 'Check the time range and existing bookings above.')}</span>
            </div>
          </>}
        </section>
      </div>
    </main>
  );
}
