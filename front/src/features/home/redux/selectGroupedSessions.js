/** @typedef {import("@types").SessionGroup} SessionGroup*/
/** @typedef {{[k: string]: SessionGroup | undefined }} Grouped */

import { createSelector } from 'reselect';
import selectSessions from './selectSessions';

/**
 * @param {string} start
 * @param {string} [ end ]
 * @return {number}
 */
function diffDateStrings(start, end) {
  if (!end) return 0;
  const a = new Date(start);
  const b = new Date(end);
  return b.getTime() - a.getTime();
}
function getTodayISO() {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  return today.toISOString();
}

/**
 *
 * @param {import("@types").Session[]} sessions
 * @returns {SessionGroup[]}
 */
function selectGroupedSessions(sessions) {
  const today = getTodayISO();
  const grouped = sessions.reduce(
    /**
     * @param {Grouped} result
     */
    (result, session) => {
      const { name, startDate, endDate } = session;
      const group = result[name] || { name, sessions: [], total: 0, lastRun: startDate };
      group.sessions.push(session);
      group.total =
        today <= startDate ? group.total + diffDateStrings(startDate, endDate) : group.total;
      result[name] = group;
      return result;
    },
    {},
  );
  return Object.values(grouped);
}

export default createSelector(selectSessions, selectGroupedSessions);
