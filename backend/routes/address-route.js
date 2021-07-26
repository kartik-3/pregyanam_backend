const router = require("express").Router();
const authCheck = require("../middleware/check-auth");
const Address = require('../models/Address');

router.get('/', authCheck, (req, res) => {
    const userId = req.userData.userId;
    Address.findOne({ userId: userId })
        .exec()
        .then((result) => {
            if (result) {
                return res.json({ success: true, result })
            }
            res.json({ success: false, message: "No addrees found" })
        })
        .catch((err) => {
            res.json({ success: false, message: "server error" })
        })

})

router.post('/', authCheck, (req, res) => {
    const userId = req.userData.userId;
    const address = new Address({
        address: req.body.address,
        city: req.body.city,
        postalcode: req.body.postalcode,
        state: req.body.state,
        userId: userId,
    })
    address.save()
        .then((result) => {
            res.json({ success: true, message: "Address has been saved" })
        })
        .catch((err) => {
            res.json({ success: false, message: "server error" })
        })


})
router.patch('/', authCheck, (req, res) => {
    const userId = req.userData.userId;
    Address.update({ userId: userId }, { $set: req.body })
        .exec()
        .then((result) => {
            res.json({ success: true, message: "Address has been updated" })
        })
        .catch((err) => {
            res.json({ success: false, message: "server error" })
        })
})



module.exports = router;
// "60b4d3de3517880913c97941"