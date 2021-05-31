const express =require('express');
const router = express.Router();
const learnProcess = require('../models/learnProcess');
const verifyToken = require('../middlewares/verifyToken');
const schedule = require('node-schedule');

const dailyUpdate = schedule.scheduleJob('0 * * * *', async function(){
    await learnProcess.updateMany({}, { $pop : {lastStreak : -1}})
    await learnProcess.updateMany({}, { $push : {lastStreak : 0}})
    console.log('daily')
})

router.post('/getDashboard', verifyToken, async(req,res) =>{
    const userProcess = await learnProcess.findOne({username : req.body.username});
    res.json({
        currentLesson : userProcess.currentLesson,
        totalScore : userProcess.totalScore,
        lastStreak : userProcess.lastStreak
    })
})

router.post('/getLearnProcess', verifyToken, async(req,res) =>{
    const userProcess = await learnProcess.findOne({username : req.body.username});
    res.send(userProcess.learnProcess)
})

router.post('/getScoreboard', verifyToken, async(req,res) =>{
    const userProcess = await learnProcess.find().sort({totalScore : -1}).limit(5);
    var scoreboard = [];
    userProcess.map(each => (
        scoreboard.push({name: each.username, score : each.totalScore})
    ))
    console.log(scoreboard)
    res.send(scoreboard)
})

exports.dailyUpdate = dailyUpdate
module.exports = router;