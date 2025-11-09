"use client";

import { useMemo, useState } from "react";
import seasonData from "@/data/season-data.json";
import {
  POINTS_TABLE,
  buildSeasonIndexes,
  computeChampionshipStandings,
  projectSimulation,
  formatDate,
  formatPoints
} from "@/lib/championship";

const DUPLICATE_ERROR = "Drivers must be unique across the top ten positions.";
const MISSING_ERROR = "Please complete the full top ten finishing order.";
export default function HomePage() {
  const { indexes, driverStandings: baseDriverStandings, constructorStandings: baseConstructorStandings } = useMemo(() => {
    const indexes = buildSeasonIndexes(seasonData);
    const standings = computeChampionshipStandings(seasonData, indexes);
    return { indexes, ...standings };
  }, []);

  const latestRace = seasonData.races.length ? seasonData.races[seasonData.races.length - 1] : null;
  const upcomingRaces = seasonData.upcomingRaces ?? [];

  const [activeRound, setActiveRound] = useState(latestRace?.round ?? null);
  const [selectedRaceRound, setSelectedRaceRound] = useState(
    upcomingRaces[0] ? String(upcomingRaces[0].round) : ""
  );
  const [finishingOrder, setFinishingOrder] = useState(() => Array(POINTS_TABLE.length).fill(""));
  const [duplicateIds, setDuplicateIds] = useState([]);
  const [formError, setFormError] = useState("");
  const [result, setResult] = useState(null);

  const activeRace = seasonData.races.length
    ? seasonData.races.find((race) => race.round === activeRound) ?? latestRace
    : null;

  const driversForSelect = baseDriverStandings.slice();

  const resolveDriverName = (id) => indexes.driversById.get(id)?.name ?? id;

  const handleTimelineClick = (round) => {
    setActiveRound(round);
  };

  const handlePositionChange = (index, value) => {
    setFinishingOrder((prev) => {
      const next = [...prev];
      next[index] = value;
      const duplicates = findDuplicates(next);
      setDuplicateIds(duplicates);
      setFormError((current) => {
        if (duplicates.length) {
          return DUPLICATE_ERROR;
        }
        return current === DUPLICATE_ERROR ? "" : current;
      });
      return next;
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!upcomingRaces.length) {
      return;
    }

    if (finishingOrder.some((value) => !value)) {
      setFormError(MISSING_ERROR);
      return;
    }

    const duplicates = findDuplicates(finishingOrder);
    if (duplicates.length) {
      setDuplicateIds(duplicates);
      setFormError(DUPLICATE_ERROR);
      return;
    }

    const simulation = projectSimulation(baseDriverStandings, baseConstructorStandings, finishingOrder);

    const race = upcomingRaces.find((item) => item.round === Number(selectedRaceRound));

    setResult({ ...simulation, race });
    setFormError("");
  };

  const handleReset = () => {
    setFinishingOrder(Array(POINTS_TABLE.length).fill(""));
    setDuplicateIds([]);
    setFormError("");
    setResult(null);
    setSelectedRaceRound(upcomingRaces[0] ? String(upcomingRaces[0].round) : "");
  };

  const simulationBaseline = result
    ? {
        driver: result.driverBaseline,
        constructor: result.constructorBaseline
      }
    : null;

  return (
    <>
      <header className="hero">
        <div className="hero__overlay" />
        <div className="hero__content">
          <h1>Formula 1 2025 Championship Control Center</h1>
          <p className="hero__subtitle">
            Track every point, podium and possibility as the Sao Paulo Grand Prix shakes up the title fight.
          </p>
          <div className="hero__meta">
            <span>{`Season ${seasonData.season}`}</span>
            <span>{`After Round ${seasonData.currentRound}: ${seasonData.currentRace}`}</span>
            <span>{`Data updated ${formatDate(seasonData.lastUpdated)}`}</span>
          </div>
          {upcomingRaces.length > 0 && (
            <a href="#simulation" className="hero__cta">
              Run Your Own Race Simulation
            </a>
          )}
        </div>
      </header>

      <main>
        <section className="panel" id="championship-status">
          <div className="panel__header">
            <h2>Championship Pulse</h2>
            <p>Live standings after the Sao Paulo showdown.</p>
          </div>
          <div className="panel__grid">
            <article className="panel__card">
              <h3>Drivers&apos; Standings</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Driver</th>
                    <th>Team</th>
                    <th>Pts</th>
                    <th>Wins</th>
                    <th>Podiums</th>
                  </tr>
                </thead>
                <tbody>
                  {baseDriverStandings.map((driver, index) => (
                    <tr key={driver.id}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="table__driver">
                          <strong>{driver.name}</strong>
                          <span className="table__code">{driver.code}</span>
                        </div>
                      </td>
                      <td>{driver.team ?? "-"}</td>
                      <td>{formatPoints(driver.points)}</td>
                      <td>{driver.wins ?? 0}</td>
                      <td>{driver.podiums ?? 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>
            <article className="panel__card">
              <h3>Constructors&apos; Standings</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Team</th>
                    <th>Pts</th>
                    <th>Wins</th>
                    <th>Podiums</th>
                  </tr>
                </thead>
                <tbody>
                  {baseConstructorStandings.map((team, index) => (
                    <tr key={team.id}>
                      <td>{index + 1}</td>
                      <td>{team.name}</td>
                      <td>{formatPoints(team.points)}</td>
                      <td>{team.wins ?? 0}</td>
                      <td>{team.podiums ?? 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="panel__note">
                {upcomingRaces.length ? (
                  <>
                    <strong>Next up</strong>
                    <br />
                    {upcomingRaces.map((race, index) => (
                      <span key={race.round}>
                        {race.round}. {race.name} — {formatDate(race.date)}
                        {index < upcomingRaces.length - 1 && <br />}
                      </span>
                    ))}
                  </>
                ) : (
                  "Season complete — no future rounds remaining."
                )}
              </div>
            </article>
          </div>
        </section>

        <section className="panel" id="race-journey">
          <div className="panel__header">
            <h2>Grand Prix Journey</h2>
            <p>Select a round to relive the action and inspect how the points were scored.</p>
          </div>
          <div className="timeline">
            {seasonData.races.map((race) => (
              <button
                key={race.round}
                type="button"
                className={`timeline__item${activeRace?.round === race.round ? " is-active" : ""}`}
                onClick={() => handleTimelineClick(race.round)}
              >
                <span className="timeline__round">Round {race.round}</span>
                <p className="timeline__title">{race.name}</p>
                <span className="timeline__winner">{`${resolveDriverName(race.winner)} victory`}</span>
                <span className="timeline__date">{formatDate(race.date)}</span>
              </button>
            ))}
          </div>
          {activeRace && (
            <article className="panel__card panel__card--wide" id="race-details">
              <div className="race-details__header">
                <div>
                  <h3>{activeRace.name}</h3>
                  <p>{`${activeRace.circuit} • ${formatDate(activeRace.date)}`}</p>
                </div>
                <div className="race-details__winner">
                  <span className="label">Winner</span>
                  <span>{resolveDriverName(activeRace.winner)}</span>
                </div>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th>Pos</th>
                    <th>Driver</th>
                    <th>Team</th>
                    <th>Pts</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {activeRace.results.map((resultRow) => {
                    const driver = indexes.driversById.get(resultRow.driverId);
                    return (
                      <tr key={resultRow.driverId}>
                        <td>{resultRow.position}</td>
                        <td>{driver ? driver.name : resultRow.driverId}</td>
                        <td>{driver ? driver.team : ""}</td>
                        <td>{formatPoints(resultRow.points)}</td>
                        <td>{resultRow.status}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {activeRace.summary && (
                <div className="race-details__footer">{activeRace.summary}</div>
              )}
            </article>
          )}
        </section>

        <section className="panel" id="simulation">
          <div className="panel__header">
            <h2>Scenario Studio</h2>
            <p>Build a custom finishing order for an upcoming race and instantly view the revised standings.</p>
          </div>
          <form className="simulation" onSubmit={handleSubmit} onReset={handleReset}>
            <div className="simulation__controls">
              <label className="field">
                <span className="field__label">Select race to simulate</span>
                <select
                  value={selectedRaceRound}
                  onChange={(event) => setSelectedRaceRound(event.target.value)}
                  disabled={!upcomingRaces.length}
                  required
                >
                  {upcomingRaces.length ? (
                    upcomingRaces.map((race) => (
                      <option key={race.round} value={String(race.round)}>
                        {race.round}. {race.name}
                      </option>
                    ))
                  ) : (
                    <option value="">Season complete</option>
                  )}
                </select>
              </label>
            </div>

            <div className="simulation__grid">
              {POINTS_TABLE.map((_, index) => (
                <div className="simulation__position" key={index}>
                  <span>{`P${index + 1}`}</span>
                  <select
                    value={finishingOrder[index]}
                    onChange={(event) => handlePositionChange(index, event.target.value)}
                    disabled={!upcomingRaces.length}
                    className={duplicateIds.includes(finishingOrder[index]) ? "is-duplicate" : undefined}
                    required
                  >
                    <option value="">Select driver</option>
                    {driversForSelect.map((driver) => (
                      <option key={driver.id} value={driver.id}>
                        {driver.name} ({driver.code})
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div className="simulation__actions">
              <button type="submit" className="btn btn--primary" disabled={!upcomingRaces.length}>
                Simulate Championship Impact
              </button>
              <button type="reset" className="btn btn--ghost">
                Reset selections
              </button>
            </div>
            {formError && (
              <p className="simulation__error" role="alert">
                {formError}
              </p>
            )}
          </form>

          <div className="panel__grid simulation__results" hidden={!result}>
            <article className="panel__card">
              <h3>Projected Drivers&apos; Standings</h3>
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
                  {result?.driverStandings.map((driver, index) => (
                    <tr key={driver.id}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="table__driver">
                          <strong>{driver.name}</strong>
                          <span className="table__code">{driver.code}</span>
                        </div>
                      </td>
                      <td>{driver.team ?? "-"}</td>
                      <td>
                        {formatPoints(driver.points)}
                        {renderDelta(simulationBaseline?.driver, driver.id, driver.points)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>
            <article className="panel__card">
              <h3>Projected Constructors&apos; Standings</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Team</th>
                    <th>Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {result?.constructorStandings.map((team, index) => (
                    <tr key={team.id}>
                      <td>{index + 1}</td>
                      <td>{team.name}</td>
                      <td>
                        {formatPoints(team.points)}
                        {renderDelta(simulationBaseline?.constructor, team.id, team.points)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="panel__note">
                {result?.summary && result.race ? (
                  <>
                    After a simulated <strong>{result.race.name}</strong>, <strong>{result.summary.leader}</strong> would lead by
                    <strong> {formatPoints(result.summary.gap)} pts</strong> over {result.summary.chaser}.
                  </>
                ) : result?.summary ? (
                  <>Simulation complete.</>
                ) : (
                  "Run a simulation to see updated standings."
                )}
              </p>
            </article>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>
          Built for Formula 1 fans — data locked to the 2025 season through the Sao Paulo Grand Prix. Refresh the data file to keep the story
          rolling.
        </p>
      </footer>
    </>
  );
}

function findDuplicates(values) {
  const filtered = values.filter(Boolean);
  return filtered.filter((value, index, array) => array.indexOf(value) !== index);
}

function renderDelta(comparison, id, points) {
  if (!comparison) return null;
  const baseline = comparison.get(id) ?? 0;
  const delta = points - baseline;
  if (delta === 0) return null;
  const direction = delta > 0 ? "pos" : "neg";
  const symbol = delta > 0 ? "▲" : "▼";
  return <span className={`delta delta--${direction}`}>{`${symbol}${Math.abs(delta)}`}</span>;
}
