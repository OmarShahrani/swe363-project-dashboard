import PouchDB from 'pouchdb-browser'
import PouchFIND from 'pouchdb-find'
PouchDB.plugin(PouchFIND)

const usersDB = new PouchDB('users-db')
const URL =
  'https://8826bdfb-1474-41c5-bdd6-b325854e8a39-bluemix:7ab6adb7ed7f3ed06d7ca060537ed684d78ae592cb188315077fb1efbf72744b@8826bdfb-1474-41c5-bdd6-b325854e8a39-bluemix.cloudantnosqldb.appdomain.cloud/swe363-usersdb'
usersDB.sync(URL, { live: true })
const createIndex = () => {
  return usersDB.createIndex({
    index: {
      fields: ['username', 'role', 'user', 'active_user']
    }
  })
}

export const db = async () => {
  try {
    await createIndex()

    return usersDB
  } catch (error) {
    console.log('pouchdb.js.db', error)
  }
}

export const sync = database => {
  return database.sync(URL, { live: true })
}
