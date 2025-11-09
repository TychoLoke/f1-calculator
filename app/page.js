"use client";

import { useMemo, useState } from "react";
import seasonData from "@/data/season-data.json";
import { formatDate, formatPoints, formatRound } from "@/lib/format";

const scoringScale = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

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

  const focusDrivers = useMemo(() => standings.drivers.slice(0, 8), [standings.drivers]);
  const pointsRemaining = calendar.upcoming.length * scoringScale[0];

  const [projections, setProjections] = useState(() =>
    Object.fromEntries(focusDrivers.map((driver) => [driver.name, 0]))
  );

  const projectionRows = useMemo(() => {
    const baseRows = focusDrivers.map((driver) => {
      const projectionValue = clamp(Number(projections[driver.name]) || 0, 0, pointsRemaining);
      return {
        ...driver,
        projectedGain: projectionValue,
        finalPoints: driver.points + projectionValue
      };
    });

    const sortedRows = [...baseRows].sort((a, b) => {
      if (b.finalPoints === a.finalPoints) {
        return a.position - b.position;
      }
      return b.finalPoints - a.finalPoints;
    });

    const projectedLeaderTotal = sortedRows[0]?.finalPoints ?? 0;

    return sortedRows.map((row, index) => {
      const projectedPosition = index + 1;
      const change = row.position - projectedPosition;
      const gapToLeader = projectedPosition === 1 ? 0 : projectedLeaderTotal - row.finalPoints;

      return {
        ...row,
        projectedPosition,
        positionChange: change,
        gapToLeader
      };
    });
  }, [focusDrivers, pointsRemaining, projections]);

  const handleProjectionChange = (driverName, value) => {
    const nextValue = clamp(Number(value) || 0, 0, pointsRemaining);
    setProjections((previous) => ({ ...previous, [driverName]: nextValue }));
  };

  const resetProjections = () => {
    setProjections(Object.fromEntries(focusDrivers.map((driver) => [driver.name, 0])));
  };

  return (
    <div className="page" id="top">
      <nav className="site-nav" aria-label="Primary">
        <div className="wrap site-nav__inner">
          <a href="#top" className="site-nav__logo" aria-label="Return to top">
            F1 // 2025
          </a>
          <ul className="site-nav__links">
            <li>
              <a href="#story">Story</a>
            </li>
            <li>
              <a href="#standings">Standings</a>
            </li>
            <li>
              <a href="#teams">Teams</a>
            </li>
            <li>
              <a href="#schedule">Schedule</a>
            </li>
            <li>
              <a href="#regulations">Regulations</a>
            </li>
            <li>
              <a href="#driver-market">Driver market</a>
            </li>
            <li className="site-nav__highlight">
              <a href="#scenario-lab">Scenario lab</a>
            </li>
          </ul>
        </div>
      </nav>

      <header className="hero" id="overview">
        <div className="hero__background" aria-hidden="true" />
        <div className="wrap hero__grid">
          <div className="hero__text">
            <p className="eyebrow">2025 Formula One World Championship</p>
            <h1>Season command centre</h1>
            <p className="hero__lede">
              Tap into a rebuilt intelligence surface that condenses the 75th anniversary campaign into one modern briefing: live
              form, regulation shifts and the path to the crown.
            </p>
            <div className="hero__meta">
              <span>Season {season}</span>
              <span>Data refreshed {formatDate(lastUpdated)}</span>
            </div>
            <a className="hero__cta" href="#scenario-lab">
              Explore the championship calculator
            </a>
          </div>
          <div className="hero__stats">
            <article className="stat-tile">
              <p className="stat-tile__label">Drivers&apos; leader</p>
              <p className="stat-tile__value">{metadata.driverLeader.name}</p>
              <p className="stat-tile__meta">
                {metadata.driverLeader.team} · {formatPoints(metadata.driverLeader.points)} pts
              </p>
            </article>
            <article className="stat-tile">
              <p className="stat-tile__label">Constructors&apos; status</p>
              <p className="stat-tile__value">{metadata.constructorChampion.team}</p>
              <p className="stat-tile__meta">
                Clinched at {metadata.constructorChampion.clinchedAt.grandPrix}
              </p>
            </article>
            <article className="stat-tile">
              <p className="stat-tile__label">Grand Prix programme</p>
              <p className="stat-tile__value">24 rounds</p>
              <p className="stat-tile__meta">{calendar.completed.length} complete · {calendar.upcoming.length} to run</p>
            </article>
          </div>
        </div>
      </header>

      <main>
        <section className="section" id="story">
          <div className="wrap section__layout">
            <div className="section__intro">
              <p className="eyebrow">Season storyline</p>
              <h2>What defined 2025 so far</h2>
              <p className="section__lede">{metadata.anniversary}</p>
            </div>
            <ul className="season-bullets">
              {seasonSummary.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section section--panels" id="standings">
          <div className="wrap section__layout section__layout--stacked">
            <div className="section__intro">
              <p className="eyebrow">Championship standings</p>
              <h2>The table after round {calendar.completed.length}</h2>
              <p className="section__lede">
                São Paulo reset the tone heading into the desert triple-header. Use the scenario lab below to see how the final
                {" "}
                {calendar.upcoming.length} races could swing the title fight.
              </p>
            </div>
            <div className="standings-panels">
              <article className="panel">
                <header className="panel__header">
                  <h3>Drivers&apos; championship</h3>
                  <span>Season {season}</span>
                </header>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th scope="col">Pos</th>
                      <th scope="col">Driver</th>
                      <th scope="col">Team</th>
                      <th scope="col" className="align-right">
                        Pts
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {standings.drivers.map((driver) => (
                      <tr key={driver.position}>
                        <td>{driver.position}</td>
                        <td>{driver.name}</td>
                        <td>{driver.team}</td>
                        <td className="align-right">{formatPoints(driver.points)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </article>
              <article className="panel">
                <header className="panel__header">
                  <h3>Constructors&apos; championship</h3>
                  <span>Season {season}</span>
                </header>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th scope="col">Pos</th>
                      <th scope="col">Team</th>
                      <th scope="col" className="align-right">
                        Pts
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {standings.constructors.map((team) => (
                      <tr key={team.position}>
                        <td>{team.position}</td>
                        <td>{team.name}</td>
                        <td className="align-right">{formatPoints(team.points)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </article>
            </div>
          </div>
        </section>

        <section className="section section--accent" id="scenario-lab">
          <div className="wrap section__layout section__layout--stacked">
            <div className="section__intro">
              <p className="eyebrow">Championship calculator</p>
              <h2>Scenario lab for the remaining run-in</h2>
              <p className="section__lede">
                Drag the sliders to project how the front-runners could score across the final {calendar.upcoming.length} rounds.
                We use the standard grand prix scale ({scoringScale.join(" / ")} pts) for quick forecasting.
              </p>
            </div>
            <div className="scenario">
              <div className="scenario__controls">
                <div className="panel panel--subtle">
                  <h3>Points runway</h3>
                  <p className="scenario__meta">
                    Maximum haul remaining: <strong>{pointsRemaining} points</strong> per driver assuming grand prix wins only.
                  </p>
                  <ul className="projection-list">
                    {focusDrivers.map((driver) => (
                      <li key={driver.name} className="projection-row">
                        <div className="projection-row__label">
                          <p>{driver.name}</p>
                          <span>{formatPoints(driver.points)} pts currently</span>
                        </div>
                        <div className="projection-row__inputs">
                          <input
                            type="range"
                            min="0"
                            max={pointsRemaining}
                            step="1"
                            value={projections[driver.name] ?? 0}
                            onChange={(event) => handleProjectionChange(driver.name, event.target.value)}
                            aria-label={`Projected points for ${driver.name}`}
                          />
                          <input
                            type="number"
                            min="0"
                            max={pointsRemaining}
                            value={projections[driver.name] ?? 0}
                            onChange={(event) => handleProjectionChange(driver.name, event.target.value)}
                            aria-label={`Numeric projected points for ${driver.name}`}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                  <button type="button" className="button button--ghost" onClick={resetProjections}>
                    Reset projections
                  </button>
                </div>
              </div>
              <div className="scenario__results panel">
                <header className="panel__header">
                  <h3>Projected leaderboard</h3>
                  <span>Based on your inputs</span>
                </header>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th scope="col">Pos</th>
                      <th scope="col">Driver</th>
                      <th scope="col" className="align-right">
                        Total pts
                      </th>
                      <th scope="col" className="align-right">
                        Gain
                      </th>
                      <th scope="col" className="align-right">
                        vs leader
                      </th>
                      <th scope="col" className="align-right">
                        Change
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectionRows.map((row) => {
                      const changeDisplay =
                        row.positionChange === 0
                          ? "—"
                          : row.positionChange > 0
                          ? `▲${row.positionChange}`
                          : `▼${Math.abs(row.positionChange)}`;

                      return (
                        <tr key={row.name}>
                          <td>{row.projectedPosition}</td>
                          <td>{row.name}</td>
                          <td className="align-right">{formatPoints(row.finalPoints)}</td>
                          <td className="align-right">+{formatPoints(row.projectedGain)}</td>
                          <td className="align-right">{row.gapToLeader === 0 ? "Leader" : `+${formatPoints(row.gapToLeader)}`}</td>
                          <td className={`align-right change-indicator change-indicator--${row.positionChange === 0 ? "neutral" : row.positionChange > 0 ? "up" : "down"}`}>
                            {changeDisplay}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <p className="scenario__footnote">
                  Scenario lab focuses on the current top eight drivers. Reset to start fresh or mix projections to test unlikely
                  swings.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="teams">
          <div className="wrap section__layout section__layout--stacked">
            <div className="section__intro">
              <p className="eyebrow">Entrants &amp; machinery</p>
              <h2>Team architecture of the 2025 grid</h2>
              <p className="section__lede">
                Glassy new profiles showcase who builds what and which drivers share the cockpits.
              </p>
            </div>
            <div className="team-grid">
              {teams.map((team) => (
                <article key={team.entrant} className="panel team-card">
                  <header className="team-card__header">
                    <div>
                      <p className="team-card__constructor">{team.constructor}</p>
                      <p className="team-card__entrant">{team.entrant}</p>
                    </div>
                    <div className="team-card__meta">
                      <span>{team.chassis}</span>
                      <span>{team.powerUnit}</span>
                    </div>
                  </header>
                  <ul className="team-card__drivers">
                    {team.drivers.map((driver) => (
                      <li key={`${team.constructor}-${driver.number}-${driver.rounds}`}>
                        <span className="team-card__number">{driver.number}</span>
                        <div>
                          <p className="team-card__name">{driver.name}</p>
                          <p className="team-card__rounds">Rounds {driver.rounds}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section--panels" id="schedule">
          <div className="wrap section__layout section__layout--stacked">
            <div className="section__intro">
              <p className="eyebrow">Global tour</p>
              <h2>Race atlas</h2>
              <p className="section__lede">Relive the completed 21 rounds and track the three-stop finale.</p>
            </div>
            <div className="calendar-grid">
              <article className="panel calendar-card">
                <header className="panel__header">
                  <h3>Completed rounds</h3>
                  <span>{calendar.completed.length} events</span>
                </header>
                <ul className="race-list">
                  {calendar.completed.map((race) => (
                    <li key={race.round}>
                      <div className="race-list__round">Round {formatRound(race.round)}</div>
                      <div className="race-list__details">
                        <p className="race-list__title">{race.grandPrix}</p>
                        <p className="race-list__meta">{formatDate(race.date)} · {race.circuit}</p>
                        <div className="race-list__results">
                          <span>
                            <strong>Pole:</strong> {race.pole}
                          </span>
                          <span>
                            <strong>Fastest lap:</strong> {race.fastestLap}
                          </span>
                          <span>
                            <strong>Winner:</strong> {race.winner} ({race.winningConstructor})
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </article>
              <article className="panel panel--accent calendar-card">
                <header className="panel__header">
                  <h3>Remaining itinerary</h3>
                  <span>{calendar.upcoming.length} rounds to go</span>
                </header>
                <ul className="race-list race-list--upcoming">
                  {calendar.upcoming.map((race) => (
                    <li key={race.round}>
                      <div className="race-list__round">Round {formatRound(race.round)}</div>
                      <div className="race-list__details">
                        <p className="race-list__title">{race.grandPrix}</p>
                        <p className="race-list__meta">{formatDate(race.date)} · {race.circuit}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section className="section" id="regulations">
          <div className="wrap section__layout section__layout--stacked">
            <div className="section__intro">
              <p className="eyebrow">Rulebook intelligence</p>
              <h2>Key regulation pivots</h2>
              <p className="section__lede">Technical, sporting and conduct directives that redefined the season.</p>
            </div>
            <div className="regulation-grid">
              <article className="panel regulation-card">
                <h3>Technical focus</h3>
                <ul>
                  {regulationHighlights.technical.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
              <article className="panel regulation-card">
                <h3>Sporting framework</h3>
                <ul>
                  {regulationHighlights.sporting.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
              <article className="panel regulation-card">
                <h3>Conduct &amp; operations</h3>
                <ul>
                  {regulationHighlights.conduct.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section className="section section--panels" id="driver-market">
          <div className="wrap section__layout section__layout--stacked">
            <div className="section__intro">
              <p className="eyebrow">Driver market rewind</p>
              <h2>Movements that shook the grid</h2>
              <p className="section__lede">From Hamilton&apos;s Ferrari leap to Alpine&apos;s revolving rookies.</p>
            </div>
            <ul className="movement-list">
              {driverMovements.map((item) => (
                <li key={item} className="panel movement-card">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="wrap site-footer__inner">
          <p>Built for quick situational awareness of the 2025 Formula One World Championship.</p>
          <a href="#top">Back to overview</a>
        </div>
      </footer>
    </div>
  );
}
