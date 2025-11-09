"use client";

import seasonData from "@/data/season-data.json";
import { formatDate, formatRound, formatPoints } from "@/lib/format";

export default function HomePage() {
  const {
    season,
    lastUpdated,
    metadata,
    seasonSummary,
    regulationHighlights,
    driverMovements,
    teams,
    standings,
    calendar
  } = seasonData;

  return (
    <div className="page">
      <header className="hero">
        <div className="hero__overlay" />
        <div className="hero__content">
          <p className="hero__tag">2025 Formula One World Championship</p>
          <h1>Championship Intelligence Briefing</h1>
          <p className="hero__subtitle">
            A data-driven snapshot of the 75th anniversary season – standings, race history and regulation shifts all drawn from the
            latest FIA documentation.
          </p>
          <div className="hero__facts">
            <div className="fact">
              <span className="fact__label">Drivers&apos; leader</span>
              <span className="fact__value">{`${metadata.driverLeader.name} · ${formatPoints(metadata.driverLeader.points)} pts`}</span>
              <span className="fact__meta">{metadata.driverLeader.team}</span>
            </div>
            <div className="fact">
              <span className="fact__label">Constructors&apos; champion</span>
              <span className="fact__value">{metadata.constructorChampion.team}</span>
              <span className="fact__meta">Clinched at {metadata.constructorChampion.clinchedAt.grandPrix}</span>
            </div>
            <div className="fact">
              <span className="fact__label">Season scope</span>
              <span className="fact__value">24 Grands Prix</span>
              <span className="fact__meta">Data refreshed {formatDate(lastUpdated)}</span>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="section" id="season-story">
          <div className="section__header">
            <h2>Season storyline</h2>
            <p>{metadata.anniversary}</p>
          </div>
          <ul className="bullet-list">
            {seasonSummary.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="section" id="standings">
          <div className="section__header">
            <h2>Championship standings after round {calendar.completed.length}</h2>
            <p>Standings compiled immediately following the São Paulo Grand Prix.</p>
          </div>
          <div className="standings-grid">
            <article className="card">
              <header className="card__header">
                <h3>Drivers</h3>
                <span>{`Season ${season}`}</span>
              </header>
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Driver</th>
                    <th>Team</th>
                    <th>Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.drivers.map((driver) => (
                    <tr key={driver.position}>
                      <td>{driver.position}</td>
                      <td>{driver.name}</td>
                      <td>{driver.team}</td>
                      <td>{formatPoints(driver.points)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>
            <article className="card">
              <header className="card__header">
                <h3>Constructors</h3>
                <span>{`Season ${season}`}</span>
              </header>
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Team</th>
                    <th>Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.constructors.map((team) => (
                    <tr key={team.position}>
                      <td>{team.position}</td>
                      <td>{team.name}</td>
                      <td>{formatPoints(team.points)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>
          </div>
        </section>

        <section className="section" id="teams">
          <div className="section__header">
            <h2>Entrants & driver line-ups</h2>
            <p>Chassis and power-unit packages paired with race seat allocations.</p>
          </div>
          <div className="team-grid">
            {teams.map((team) => (
              <article key={team.entrant} className="team-card">
                <header className="team-card__header">
                  <h3>{team.constructor}</h3>
                  <span>{team.entrant}</span>
                </header>
                <dl className="team-meta">
                  <div>
                    <dt>Chassis</dt>
                    <dd>{team.chassis}</dd>
                  </div>
                  <div>
                    <dt>Power unit</dt>
                    <dd>{team.powerUnit}</dd>
                  </div>
                </dl>
                <ul className="driver-list">
                  {team.drivers.map((driver) => (
                    <li key={`${team.constructor}-${driver.number}-${driver.rounds}`}>
                      <span className="driver-number">{driver.number}</span>
                      <div>
                        <p className="driver-name">{driver.name}</p>
                        <p className="driver-rounds">Rounds {driver.rounds}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="calendar">
          <div className="section__header">
            <h2>Race calendar</h2>
            <p>Complete chronology of the 24-race tour with competitive milestones.</p>
          </div>
          <div className="calendar-grid">
            <article className="card card--tall">
              <header className="card__header">
                <h3>Completed rounds</h3>
                <span>{`${calendar.completed.length} events`}</span>
              </header>
              <ul className="race-list">
                {calendar.completed.map((race) => (
                  <li key={race.round}>
                    <div className="race-round">{formatRound(race.round)}</div>
                    <div className="race-details">
                      <p className="race-title">{race.grandPrix}</p>
                      <p className="race-meta">{formatDate(race.date)} · {race.circuit}</p>
                      <div className="race-results">
                        <span><strong>Pole:</strong> {race.pole}</span>
                        <span><strong>Fastest lap:</strong> {race.fastestLap}</span>
                        <span><strong>Winner:</strong> {race.winner} ({race.winningConstructor})</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </article>
            <article className="card card--compact">
              <header className="card__header">
                <h3>Remaining itinerary</h3>
                <span>{`${calendar.upcoming.length} to go`}</span>
              </header>
              <ul className="race-list race-list--upcoming">
                {calendar.upcoming.map((race) => (
                  <li key={race.round}>
                    <div className="race-round">{formatRound(race.round)}</div>
                    <div className="race-details">
                      <p className="race-title">{race.grandPrix}</p>
                      <p className="race-meta">{formatDate(race.date)} · {race.circuit}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section className="section" id="regulations">
          <div className="section__header">
            <h2>Regulation intelligence</h2>
            <p>Key directives shaping competition across the 2025 season.</p>
          </div>
          <div className="regulation-grid">
            <article className="card">
              <header className="card__header">
                <h3>Technical</h3>
              </header>
              <ul className="bullet-list bullet-list--dense">
                {regulationHighlights.technical.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
            <article className="card">
              <header className="card__header">
                <h3>Sporting</h3>
              </header>
              <ul className="bullet-list bullet-list--dense">
                {regulationHighlights.sporting.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
            <article className="card">
              <header className="card__header">
                <h3>Conduct & operations</h3>
              </header>
              <ul className="bullet-list bullet-list--dense">
                {regulationHighlights.conduct.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section className="section" id="driver-moves">
          <div className="section__header">
            <h2>Driver market rewind</h2>
            <p>How the 2025 grid reshuffled across the winter and early rounds.</p>
          </div>
          <ul className="card-list">
            {driverMovements.map((item) => (
              <li key={item} className="card card--inline">{item}</li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
