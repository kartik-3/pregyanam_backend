const router = require("express").Router();

const Schedule = require('../models/schedule');


router.post('/', (req, res) => {
    const  schedule = new Schedule({
        name : req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        date: req.body.date,
        type: req.body.type,
        service : req.body.service,
        time: req.body.time
    })
    schedule.save()
            .then((result) => {
                res.json({success: true, messaage: 'Schedule has been updated'})
            })
            .catch((err) => {
                res.json({success: false, error: err})
            })
});

router.get('/', (req, res)=> {
    Schedule.find()
            .sort('-_id')
            .exec()
            .then((result) => {
                res.json({success: true, result: result})
            })
            .catch((err) => {
                res.json({success: false, error: err})
            })
})
router.patch('/:id', (req, res) => {
    const id =  req.params.id;

    Schedule.updateOne({_id: id}, {$set : req.body})
           .then((result) => {
               res.json({success : true, message: "schedule has been updated"})
           })
           .catch((err) => {
            res.json({success : false, message: "server error"})
           })

})
router.delete('/:id', (req, res) => {
    const id =  req.params.id;

    Schedule.deleteOne({_id: id})
           .then((result) => {
               res.json({success : true, message: "schedule has been deleled"})
           })
           .catch((err) => {
            res.json({success : false, message: "schedule has been updated"})
           })

})

module.exports = router;