const Admin = require("../models/Admin");
const AdminService = require("../models/Admin_Service");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

exports.getAllAdmins = async (req, res, next) => {
  try {
    let service = mongoose.Types.ObjectId(req.params.serviceId);

    let admins = await AdminService.aggregate([
      { $match: { service } },
      {
        $lookup: {
          from: Admin.collection.name,
          localField: "admin",
          foreignField: "_id",
          as: "adminData",
        },
      },
      { $unwind: { path: "$adminData", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          id: "$adminData._id",
          title: "$adminData.name",
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: admins,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error });
  }
};
