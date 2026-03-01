export default function MeetingNotes() {
  return (
    <>
      <div className="header">
        <h1>📝 Meeting Notes</h1>
        <p className="subtitle">Template for documenting meetings</p>
      </div>

      <div>
        <div className="container">
          <div className="section">
            <h2>Meeting Details</h2>
            <div className="field">
              <label htmlFor="meeting-date">Date</label>
              <input type="date" id="meeting-date" />
            </div>
            <div className="field">
              <label htmlFor="meeting-time">Time</label>
              <input type="time" id="meeting-time" />
            </div>
            <div className="field">
              <label htmlFor="meeting-attendees">Attendees</label>
              <textarea id="meeting-attendees" rows={3} />
            </div>
          </div>

          <div className="section">
            <h2>Discussion Points</h2>
            <textarea rows={4} />
          </div>

          <div className="section">
            <h2>Key Takeaways</h2>
            <textarea id="takeaways" rows={4} />
          </div>
        </div>
      </div>
    </>
  )
}
