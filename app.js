const express = require('express')
const {open} = require('sqlite')
const app = express()
const sqlite3 = require('sqlite3')
const path = require('path')
const dbpath = path.join(__dirname, 'cricketTeam.db')
app.use(express.json())
let db = null
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server is Running at http://localhost:/3000/')
    })
  } catch (e) {
    console.log(`DB Error:$(e.message)`)
    process.exit(1)
  }
}
initializeDBAndServer()
const convertDbObjectToResponseObject = dbObject => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  }
}

//GET PLAYER API

app.get('/players/', async (_request, response) => {
  const a = `
        SELECT 
        *
        FROM
        cricket_team;`
  const b = await db.all(a)
  response.send(b.map(i => convertDbObjectToResponseObject(i)))
})

//POST API
app.post('/players/', async (request, response) => {
  const details = request.body


  const {playerName, jerseyNumber, role} = details


  const api2 = `


  INSERT INTO


  cricket_team (player_name,jersey_number,role)


  VALUES


  (


   '${playerName}',


   ${jerseyNumber},


   '${role}');`


  const db3 = await db.run(api2)


  response.send('Player Added to Team')
})
//GET API-3
app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const api3 = `
      SELECT * FROM
      cricket_team
      WHERE player_id = ${playerId};`
  const db2 = await db.get(api3)
  response.send(convertDbObjectToResponseObject(db2))
})
//PUT API
app.put('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const details = request.body
  const {playerName, jerseyNumber, role} = details
  const api4 = `
    UPDATE 
      cricket_team 
    SET
      playername= '${playerName}',
      jersey_number= '${jerseyNumber}',
      role= '${role}'
  WHERE
      player_id=${playerId};`
  await db.run(api4)
  response.send('Player Details Updated')
})

app.delete('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const api5 = `
    DELETE 
    FROM 
      cricket_team 
    WHERE 
      player_id=${playerId};`
  await db.run(api5)
  response.send('Player Removed')
})

module.exports = app
