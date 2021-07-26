const Slot = require("../models/Slot");
const Service = require("../models/Service");
const SlotBooking = require("../models/Slot_Booking");
const mongoose = require("mongoose");
const UserPlan = require("../models/User_Plan");
const User = require("../models/User");
const moment = require("moment");

exports.createSlot = async (req, res) => {
  try {
    let { slotDays, service, servicename } = req.body;
    if (!slotDays || slotDays.length == 0) {
      return res.status(400).json({
        success: true,
        message: "Please enter atleast one day to book slot",
      });
    }

    let slots = [];
    for (let i = 0; i <= slotDays.length - 1; i++) {
      for (let j = 0; j <= slotDays[i].slots.length - 1; j++) {
        for (let k = 0; k <= slotDays[i].slots[j].admins.length - 1; k++) {
          slots.push({
            date: slotDays[i].date,
            startTime: slotDays[i].slots[j].startTime,
            endTime: slotDays[i].slots[j].endTime,
            service: service,
            admin: slotDays[i].slots[j].admins[k],
          });
        }
      }
    }

    await Slot.insertMany(slots);

    res.status(201).json({
      success: true,
      message: `Slots for ${servicename} has been created Successfully`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server error" });
  }
};

exports.editSlot = async (req, res) => {
  const id = mongoose.Types.ObjectId(req.params.id);
  try {
    let { slotDays } = req.body;
    if (!slotDays || slotDays.length == 0) {
      return res.status(400).json({
        success: true,
        message: "Please enter atleast one day to book slot",
      });
    }

    let slots = [];
    for (let i = 0; i <= slotDays.length - 1; i++) {
      for (let j = 0; j <= slotDays[i].slots.length - 1; j++) {
        for (let k = 0; k <= slotDays[i].slots[j].admins.length - 1; k++) {
          slots.push({
            date: slotDays[i].date,
            startTime: slotDays[i].slots[j].startTime,
            endTime: slotDays[i].slots[j].endTime,
            service: id,
            admin: slotDays[i].slots[j].admins[k],
          });
        }
      }
    }
    // await Slot.updateMany({service: id}, {$set:  slots}, { upsert: true, multi:true });
    try {
      const bulkOps = slots.map((doc) => ({
        updateOne: {
          filter: { service: id },
          update: doc,
          upsert: true,
        },
      }));
      let inserted = await Slot.bulkWrite(bulkOps);
      res.status(200).json({
        success: true,
        data: inserted,
        message: "Items Inserted Successfully",
      });
    }catch(e){
      res.status(400).json({
        success: false,
        message: "Please enter right entry",
      });
    }

  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server error" });
  }
};

exports.getAllSlots = async (req, res) => {
  try {
    let page = parseInt(req.params.page);
    let limit = parseInt(req.params.limit);

    let slots = await Slot.find()
      .sort({ createdAt: -1 })
      .skip(page * limit)
      .limit(limit);
    res.status(200).json({ success: true, data: slots });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server error" });
  }
};

exports.getTimeSlotsForDate = async (req, res) => {
  try {
    let page = parseInt(req.params.page);
    let limit = parseInt(req.params.limit);
    let date = new Date(req.params.date);
    // start today
    var start = moment(date).startOf("day");
    // end today
    var end = moment(date).endOf("day");

    let timeSlots = await Slot.find({ date: { $gte: start, $lte: end } })
      .sort({ createdAt: -1 })
      .skip(page * limit)
      .limit(limit);
    res.status(200).json({ success: true, data: timeSlots });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server error" });
  }
};

exports.getAvailableSlots = async (req, res) => {
  try {
    let service = mongoose.Types.ObjectId(req.params.service);

    let serviceFind = await Service.findOne({ _id: service });

    if (!serviceFind) {
      return res
        .status(400)
        .json({ success: false, message: "Please Choose Correct Service" });
    }

    let slots = await calculateAvailableSlots(serviceFind, req);
    // console.log(slots);

    for (let i = 0; i <= slots.length - 1; i++) {
      if (slots[i].bookingData) {
        for (let j = 0; j <= slots[i].bookingData.length - 1; j++) {
          if (
            slots[i].bookingData[j].user.toString() ==
            req.userData.userId.toString()
          ) {
            slots[i].available = false;
            continue;
          }
        }
      }
    }
    res.status(200).json({ success: true, data: slots });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server error" });
  }
};

const calculateAvailableSlots = async (service, req) => {
  let page = parseInt(req.params.page);
  let limit = parseInt(req.params.limit);
  let slots = [];
  switch (service.code) {
    case "ORIENTATION":
      slots = await Slot.aggregate([
        {
          $lookup: {
            from: SlotBooking.collection.name,
            let: { slotId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$slot", "$$slotId"] },
                      {
                        $eq: ["$service", mongoose.Types.ObjectId(service._id)],
                      },
                      // {
                      //   $ne: [
                      //     "$user",
                      //     mongoose.Types.ObjectId(req.userData.userId),
                      //   ],
                      // },
                    ],
                  },
                },
              },
            ],
            as: "bookingData",
          },
        },
        { $sort: { createdAt: -1 } },
        { $skip: page * limit },
        { $limit: limit },
        {
          $project: {
            date: 1,
            startTime: 1,
            endTime: 1,
            service: 1,
            admin: 1,
            createdAt: 1,
            updatedAt: 1,
            bookingData: 1,
            available: {
              $cond: {
                if: {
                  $and: [
                    { $isArray: "$bookingData" },
                    {
                      $lt: [
                        { $size: "$bookingData" },
                        parseInt(service.userPerSlot),
                      ],
                    },
                  ],
                },
                then: true,
                else: false,
              },
            },
          },
        },
      ]);
      break;
    case "VYAMSHALA" || "DHYANSHALA" || "YOGSHALA":
      //check if basic user or not
      let user = await User.findOne({ _id: req.userData.userId });
      if (user.basicUser == true) {
        // check if user have the plan
        let plan = await UserPlan.findOne({
          user: req.userData.userId,
          service: service._id,
        });
        if (plan) {
          let alreadyBooked = await SlotBooking.findOne({
            user: req.userData.userId,
            service: service._id,
          });
          if (!alreadyBooked) {
            slots = await Slot.aggregate([
              { $match: { service: mongoose.Types.ObjectId(service._id) } },
              {
                $lookup: {
                  from: SlotBooking.collection.name,
                  let: { slotId: "$_id" },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $and: [
                            { $eq: ["$slot", "$$slotId"] },
                            {
                              $eq: [
                                "$service",
                                mongoose.Types.ObjectId(service._id),
                              ],
                            },
                            // {
                            //   $ne: [
                            //     "$user",
                            //     mongoose.Types.ObjectId(req.userData.userId),
                            //   ],
                            // },
                          ],
                        },
                      },
                    },
                  ],
                  as: "bookingData",
                },
              },
              { $sort: { createdAt: -1 } },
              { $skip: page * limit },
              { $limit: limit },
              {
                $project: {
                  date: 1,
                  startTime: 1,
                  endTime: 1,
                  service: 1,
                  admin: 1,
                  createdAt: 1,
                  updatedAt: 1,
                  bookingData: 1,
                  available: {
                    $cond: {
                      if: {
                        $and: [
                          { $isArray: "$bookingData" },
                          {
                            $lt: [
                              { $size: "$bookingData" },
                              parseInt(service.userPerSlot),
                            ],
                          },
                        ],
                      },
                      then: true,
                      else: false,
                    },
                  },
                },
              },
            ]);
          }
        }
      }

      // code block
      break;
    case "VAIDYA":
      user = await User.findOne({ _id: req.userData.userId });
      if (user.basicUser == true) {
        // check if user have the plan
        let plan = await UserPlan.findOne({
          user: req.userData.userId,
          service: service._id,
        });
        if (plan) {
          let alreadyBooked = await SlotBooking.findOne({
            user: req.userData.userId,
            service: service._id,
          });
          if (alreadyBooked) {
            let currentDate = moment(alreadyBooked.bookedAt);
            var futureMonth = moment(currentDate).add(1, "M");
            var futureMonthEnd = moment(futureMonth).endOf("month");

            if (
              currentDate.date() != futureMonth.date() &&
              futureMonth.isSame(futureMonthEnd.format("YYYY-MM-DD"))
            ) {
              futureMonth = futureMonth.add(1, "d");
            }
            let checkData = new Date(
              futureMonth.format("DD-MM-YYYY")
            ).toISOString();

            slots = await Slot.aggregate([
              {
                $match: {
                  $and: [
                    { service: mongoose.Types.ObjectId(service._id) },
                    { data: { $gte: checkData } },
                  ],
                },
              },
              { $sort: { createdAt: -1 } },
              { $skip: page * limit },
              { $limit: limit },
              {
                $project: {
                  date: 1,
                  startTime: 1,
                  endTime: 1,
                  service: 1,
                  admin: 1,
                  createdAt: 1,
                  updatedAt: 1,
                  bookingData: 1,
                  available: true,
                },
              },
            ]);
          } else {
            slots = await Slot.aggregate([
              {
                $match: {
                  $and: [{ service: mongoose.Types.ObjectId(service._id) }],
                },
              },
              { $sort: { createdAt: -1 } },
              { $skip: page * limit },
              { $limit: limit },
              {
                $project: {
                  date: 1,
                  startTime: 1,
                  endTime: 1,
                  service: 1,
                  admin: 1,
                  createdAt: 1,
                  updatedAt: 1,
                  bookingData: 1,
                  available: true,
                },
              },
            ]);
          }
        }
      }
      break;

    default:
    // code block
  }
  return slots;
};
