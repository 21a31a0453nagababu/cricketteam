const express=require("express");
const path=require("path");
const {open}=require("sqlite");
const sqlite3=require("sqlite3");
const app=express();
app.use(express.json());
const dbPath=path.join(__dirname,"cricketTeam.db");
let db=null;
const intializeDBAndServer=async()=>{
    try{
        db=await open({
        filename:dbPath,        
        driver:sqlite3.Database,        });
        app.listen(3009,()=>{
            console.log("Server Runnning at http://localhost:3009/");
        });

    }catch(e){
        console.log(`DB Error:${e.message}`);
        process.exit(1);
        

    

    }
    
};
intializeDBAndServer();
const convertDbObjectToResponseObject=(dbObjct)=>{
return {
    playerId:dbObject.player_id,
    playerName:dbObject.player_name,
    jerseyNumber:dbObject.jersey_number,
    role:dbObject.role,
};
};
app.get("/players/",async(request,response)=>{
    const getCricketQuery=`SELECT
    * FROM cricket_team;`
    const cricketArray=await db.all(getCricketQuery);
    response.send(
        cricketArray.map((eachplayer)=>
        convertDbObjectToResponseObject(eachplayer))
    );
});
app.post("/players/",async(request,response)=>{
    const playerDetails=request.body;
    const {playerName,jerseyNumber,role}=playerDetails;
    const addPlayerQuery=`
    INSERT INTO
    cricket_team(player_name,jersey_number,role)
    VALUES(
        "${playerName}",
        "${jerseyNumber}"
        "${role}"
    )`;
    const dbResponse=await db.run(addPlayerQuery);
    response.send("Player Added to team");    
});

app.put("/players/:playerId/",async(request,response)=>{
    const {playerId}=request.params;
    const playerDetails=request.body;
    const {playerName,jerseyNumber,role}=playerDetails;
    const updatePlayerQuery=`
    UPDATE cricket_team SET 
    player_name="${playerName}",
    jersey_number="${jerseyNumber}",
    role="${role}"
WHERE
player_id=${playerId};`;
  await db.run(updatePlayerQuery);
  response.send("Players Details Updated");
  });

  app.delete("/players/:playerId/",async(request,response)=>{
const {playerId}=request.params;
const deleteplayerQuery=`
DELETE FROM cricket_team WHERE player_id=${playerId};`;
  await db.run(deleteplayerQuery);
  response.send("player Removed");
  });
  module.exports=app;

