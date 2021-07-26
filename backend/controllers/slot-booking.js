const SlotBooking = require("../models/Slot_Booking");
const Slot = require("../models/Slot");
const Service = require("../models/Service");
const Admin = require("../models/Admin");
const User = require("../models/User");

const mongoose = require("mongoose");

const { notifyBookingSlotChange } = require("../notification/emails");

// appointments

exports.createSlotBooking = async (req, res) => {
  try {
    let { service, slot, bookedAt } = req.body;
    let user = req.userData.userId;

    if (!slot || slot == "") {
      return res.status(400).json({
        success: true,
        message: "Please enter Slot ID to Book",
      });
    }

    let booking = await new SlotBooking({
      bookedAt: bookedAt,
      service: service,
      slot: slot,
      user: user,
    }).save();

    res.status(201).json({
      success: true,
      message: `Booking has been created Successfully`,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server error" });
  }
};

exports.updateSlotBooking = async (req, res) => {
  try {
    let id = mongoose.Types.ObjectId(req.params.bookingId);
    let exist = await SlotBooking.findOne({ _id: id });
    if (!exist) {
      return res
        .status(400)
        .json({ success: false, message: "Booking is not available" });
    } else {
      await SlotBooking.findOneAndUpdate(
        {
          _id: id,
        },
        {
          $set: req.body,
        },
        { new: true }
      );

      let updatedData = await SlotBooking.findOne({ _id: id })
        .populate("service")
        .populate({
          path: "slot",
          populate: {
            path: "admin",
            model: "Admin",
          },
        })
        .populate("user");

      /**here send email to the customer about booking date change */
      await notifyBookingSlotChange(
        updatedData.user.name,
        updatedData.user.email,
        updatedData.slot.startTime
      );

      res.status(200).json({
        success: true,
        message: "Booking Date Updated",
        data: updatedData,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server error" });
  }
};

/**admin api */
exports.getAllBookingForAdmin = async (req, res) => {
  try {
    let page = parseInt(req.params.page);
    let limit = parseInt(req.params.limit);

    let pipes = [];
    pipes.push({
      $lookup: {
        from: User.collection.name,
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    });
    pipes.push({
      $unwind: { path: "$user", preserveNullAndEmptyArrays: true },
    });
    pipes.push({
      $lookup: {
        from: Service.collection.name,
        localField: "service",
        foreignField: "_id",
        as: "service",
      },
    });
    pipes.push({
      $unwind: { path: "$service", preserveNullAndEmptyArrays: true },
    });

    if (req.query.name && req.query.name != "") {
      pipes.push({
        $match: {
          $or: [
            { "user.name": RegExp(req.query.name.trim(), "i") },
            { "service.name": RegExp(req.query.name.trim(), "i") },
          ],
        },
      });
    }

    pipes.push({ $sort: { createdAt: -1 } });

    // pipes.push({ $skip: page * limit });
    // pipes.push({ $limit: limit });
    pipes.push({
      $lookup: {
        from: Slot.collection.name,
        let: { slotId: "$slot" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$slotId"],
              },
            },
          },
          {
            $lookup: {
              from: Admin.collection.name,
              localField: "admin",
              foreignField: "_id",
              as: "admin",
            },
          },
          { $unwind: { path: "$admin", preserveNullAndEmptyArrays: true } },
        ],
        as: "slot",
      },
    });
    pipes.push({
      $unwind: { path: "$slot", preserveNullAndEmptyArrays: true },
    });

    let bookings = await SlotBooking.aggregate(pipes);
    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server error" });
  }
};
