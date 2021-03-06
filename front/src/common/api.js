// @ts-check

import firebase from '../fb';

const provider = new firebase.auth.GoogleAuthProvider();

export function isUserLoggedIn() {
  return new Promise(resolve => {
    firebase.auth().onAuthStateChanged(
      user => {
        resolve(user);
      },
      error => {
        console.error('Failed cheking logged user', error);
        return resolve(null);
      },
    );
  });
}
export const login = ({ email, password }) => {};

export const googleLogin = () =>
  firebase
    .auth()
    .signInWithPopup(provider)
    .then(({ credential, user }) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = credential.toJSON();
      // The signed-in user info.
      return {
        error: null,
        response: {
          token,
          user,
        },
      };
    })
    .catch(error => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      return {
        response: null,
        error: {
          data: errorMessage,
          status: errorCode,
          email,
          credential,
        },
      };
    });

export const signUp = ({ email, password, name }) => {};

/**
 * @typedef { {response: any, error?: {status: number}} } apiResponse
 */
/**
 * @typedef { { response: null, error: {status: number}} } errorResponse
 */

/**
 * Injects the user namespace on database Reference to the provided handler
 * @template T
 * @template K
 * @param {(db: firebase.database.Reference, args: T) => K} handler
 * @returns { (args:T) => Promise<K|errorResponse> }
 */
const withDb = handler => async args => {
  const userId = firebase.auth()?.currentUser?.uid;
  if (!userId) return { error: { status: 401 }, response: null };
  const db = firebase
    .database()
    .ref('/tasks')
    .child(userId);
  return handler(db, args);
};

export const listSessions = withDb(db => {
  return db
    .child('all')
    .orderByKey()
    .get()
    .then(snapshot => {
      if (snapshot.exists()) return { response: Object.values(snapshot.val()).reverse() };
      return { response: [] };
    });
});
/** @typedef { (args: import('../types').Session) => any } sessionCb*/
/** @typedef { (args: import('../types').Session|null) => any } sessionCbNull*/
/** @type { (args:{ onSessionAdded: sessionCb,
 *                  onRunningUpdate: sessionCbNull,
 *                  onSessionUpdate: sessionCb }) => void }
 * */
export const syncData = withDb(async (db, { onSessionAdded, onRunningUpdate, onSessionUpdate }) => {
  const all = db.child('all');
  const last = await all
    .orderByKey()
    .limitToLast(1)
    .once('child_added');
  all
    .orderByKey()
    .startAfter(last.key)
    .on('child_added', snapshot => {
      if (snapshot.exists()) return onSessionAdded(snapshot.val());
    });
  all.on('child_changed', snap => {
    if (snap.exists() && snap.val().id) onSessionUpdate(snap.val());
  });
  db.child('runningSession').on('value', snapshot => {
    return onRunningUpdate(snapshot.val());
  });
});

/**
 * @type { (args: {name: string}) => Promise<apiResponse> }
 */
export const startSession = withDb((db, { name }) => {
  const session = { name, startDate: new Date().toISOString() };
  return db
    .child('runningSession')
    .set(session)
    .then(() => ({ response: session, error: null }));
});

/** @type { (args: {id: string, name: string}) => Promise<apiResponse> }*/
export const stopSession = withDb(async db => {
  const running = db.child('runningSession');
  const runningSnap = await running.get();
  if (!runningSnap.exists()) {
    throw new Error('Stopping not existing session');
  }
  const push = await db.child('all').push();
  const session = { ...runningSnap.val(), id: (push).key, endDate: new Date().toISOString() };
  await running.set(null);
  await push.set(session);
  return { response: session };
});

/** @type { (args: {id: string, name: string, startDate: Date, endDate: Date}) => Promise<apiResponse> }*/
export const updateSession = withDb((db, { id, name, startDate, endDate }) => {
  return db
    .child('all')
    .child(id)
    .update({ name, startDate, endDate })
    .then(() => ({ response: { id, name, startDate, endDate } }));
});

export const deleteSession = withDb((db, { id }) => {
  return db
    .child('all')
    .child(id)
    .set(null)
    .then(() => ({ response: { id }, error: null }))
    .catch(error => ({ error, response: null }));
});
