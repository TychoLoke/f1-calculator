export const POINTS_TABLE = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];

export function buildSeasonIndexes(data) {
  const driversById = new Map();
  const teamsById = new Map();
  const teamIdByName = new Map();
  const driverTeamId = new Map();

  data.constructors.forEach((team) => {
    teamsById.set(team.id, team);
    teamIdByName.set(team.name, team.id);
  });

  data.drivers.forEach((driver) => {
    driversById.set(driver.id, driver);
    const teamId = teamIdByName.get(driver.team) ?? null;
    driverTeamId.set(driver.id, teamId);
  });

  return { driversById, teamsById, teamIdByName, driverTeamId };
}

export function computeChampionshipStandings(data, indexes) {
  if (data.standings?.drivers?.length && data.standings?.constructors?.length) {
    const driverStandings = data.standings.drivers
      .map((entry) => {
        const driver = indexes.driversById.get(entry.id) ?? {};
        const teamId = indexes.driverTeamId.get(entry.id) ?? null;
        return {
          id: entry.id,
          name: driver.name ?? entry.name ?? entry.id,
          code: driver.code ?? entry.code ?? "",
          team: driver.team ?? entry.team ?? null,
          teamId,
          points: entry.points ?? 0,
          wins: entry.wins ?? 0,
          podiums: entry.podiums ?? 0
        };
      })
      .sort(sortStandings);

    const constructorStandings = data.standings.constructors
      .map((entry) => {
        const team = indexes.teamsById.get(entry.id) ?? {};
        return {
          id: entry.id,
          name: team.name ?? entry.name ?? entry.id,
          points: entry.points ?? 0,
          wins: entry.wins ?? 0,
          podiums: entry.podiums ?? 0
        };
      })
      .sort(sortStandings);

    return { driverStandings, constructorStandings };
  }

  const driverStats = new Map();
  const constructorStats = new Map();

  data.drivers.forEach((driver) => {
    const teamId = indexes.driverTeamId.get(driver.id) ?? null;
    driverStats.set(driver.id, {
      id: driver.id,
      name: driver.name,
      code: driver.code,
      team: driver.team,
      teamId,
      points: 0,
      wins: 0,
      podiums: 0
    });
  });

  data.constructors.forEach((team) => {
    constructorStats.set(team.id, {
      id: team.id,
      name: team.name,
      points: 0,
      wins: 0,
      podiums: 0
    });
  });

  data.races.forEach((race) => {
    race.results.forEach((result) => {
      const driver = driverStats.get(result.driverId);
      if (!driver) return;

      driver.points += result.points;
      if (result.position === 1) {
        driver.wins += 1;
      }
      if (result.position <= 3) {
        driver.podiums += 1;
      }

      const teamId = driver.teamId;
      if (teamId && constructorStats.has(teamId)) {
        const team = constructorStats.get(teamId);
        team.points += result.points;
        if (result.position === 1) {
          team.wins += 1;
        }
        if (result.position <= 3) {
          team.podiums += 1;
        }
      }
    });
  });

  const driverStandings = Array.from(driverStats.values()).sort(sortStandings);
  const constructorStandings = Array.from(constructorStats.values()).sort(sortStandings);

  return { driverStandings, constructorStandings };
}

export function projectSimulation(baseDriverStandings, baseConstructorStandings, order) {
  const driverBaseline = new Map(baseDriverStandings.map((driver) => [driver.id, driver.points]));
  const constructorBaseline = new Map(baseConstructorStandings.map((team) => [team.id, team.points]));

  const projectedDrivers = baseDriverStandings.map((driver) => ({ ...driver }));
  const projectedConstructors = baseConstructorStandings.map((team) => ({ ...team }));
  const driverLookup = new Map(projectedDrivers.map((driver) => [driver.id, driver]));
  const constructorLookup = new Map(projectedConstructors.map((team) => [team.id, team]));

  order.forEach((driverId, index) => {
    const points = POINTS_TABLE[index] ?? 0;
    const driver = driverLookup.get(driverId);
    if (!driver) return;
    driver.points += points;

    const teamId = driver.teamId;
    if (teamId && constructorLookup.has(teamId)) {
      constructorLookup.get(teamId).points += points;
    }
  });

  const driverStandings = Array.from(driverLookup.values()).sort(sortStandings);
  const constructorStandings = Array.from(constructorLookup.values()).sort(sortStandings);

  const topTwo = driverStandings.slice(0, 2);
  let summary = null;
  if (topTwo.length === 2) {
    const gap = topTwo[0].points - topTwo[1].points;
    summary = {
      leader: topTwo[0].name,
      chaser: topTwo[1].name,
      gap
    };
  }

  return {
    driverStandings,
    constructorStandings,
    driverBaseline,
    constructorBaseline,
    summary
  };
}

export function sortStandings(a, b) {
  if (b.points !== a.points) return b.points - a.points;
  if ((b.wins ?? 0) !== (a.wins ?? 0)) return (b.wins ?? 0) - (a.wins ?? 0);
  if ((b.podiums ?? 0) !== (a.podiums ?? 0)) return (b.podiums ?? 0) - (a.podiums ?? 0);
  return a.name.localeCompare(b.name);
}

export function formatPoints(value) {
  return Number(value ?? 0).toFixed(0);
}

export function formatDate(date) {
  if (!date) return "TBC";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return date;
  }
  return parsed.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
