const Admin = require("../models/Admin");
const AdminService = require("../models/Admin_Service");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

exports.createNewAdmin = async (req, res, next) => {
  try {
    let { email, password, name, service } = req.body;

    let checkEmailExist = await Admin.findOne({ email: email });
    if (checkEmailExist) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exist" });
    }

    if(!service || service == ""){
      return res.status(400).json({success:false, message:"Please Select a service"})
    }

    let addedAdmin = await new Admin({
      email: email,
      password: password,
      name: name,
      // image:
    }).save();

    //add admin with service
    await new AdminService({
      service: mongoose.Types.ObjectId(service),
      admin: addedAdmin._id,
    }).save();

    let addedAdminPopulated = await Admin.aggregate([
      { $match: { _id: addedAdmin._id } },
      {
        $lookup: {
          from: AdminService.collection.name,
          localField: "_id",
          foreignField: "admin",
          as: "serviceData",
        },
      },
      { $unwind: { path: "$serviceData", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          email: 1,
          name: 1,
          serviceId: "$serviceData.service",
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: addedAdminPopulated[0],
      message: "New Admin Registration is done Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error });
  }
};

exports.getAllAdmin = async (req, res, next) => {
  try {
    let page = parseInt(req.params.page);
    let limit = parseInt(req.params.limit);

    let user = mongoose.Types.ObjectId(req.userData.userId);

    let pipes = [];

    if(req.query.name && req.query.name != ""){
      pipes.push({$match:{name:RegExp(req.query.name.trim(),'i')}});
    }

    pipes.push({ $match: { _id: { $ne: user } } })
    pipes.push({ $sort: { createdAt: -1 } })
    pipes.push({ $skip: page * limit })
    pipes.push({ $limit: limit })
    pipes.push({
      $lookup: {
        from: AdminService.collection.name,
        localField: "_id",
        foreignField: "admin",
        as: "serviceData",
      },
    })
    pipes.push({ $unwind: { path: "$serviceData", preserveNullAndEmptyArrays: true } })
    pipes.push({
      $project: {
        email: 1,
        name: 1,
        serviceId: "$serviceData.service",
      },
    },)

    let admins = await Admin.aggregate(pipes);

    res.status(200).json({
      success: true,
      data: admins,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error });
  }
};


exports.deleteAdmin = async (req, res, next) => {
  try {
    let adminId = mongoose.Types.ObjectId(req.params.adminId);
    let result = await Admin.findOne({ _id: adminId });
    if (!result) {
      return res
        .status(400)
        .json({ success: false, message: "Admin Not Found" });
    }

    await AdminService.findOneAndDelete({admin:adminId})
    await Admin.deleteOne({ _id: adminId });

    res.status(200).json({
      success: true,
      message: "Admin Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error });
  }
};

exports.getloggedInUserInfo = async (req, res, next) => {
  try {
    let result = await Admin.findById(req.userData.userId);
    res.status(200).json({ success: true, user: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
};

exports.updateUserInfo = async (req, res, next) => {
  try {
    await AdminService.findOneAndDelete({admin:mongoose.Types.ObjectId(req.params.adminId)});

    let updatedInfo = {};
    if(req.body.name){
      updatedInfo.name = req.body.name;
    }
    if(req.body.email){
      updatedInfo.email = req.body.email;
    }
    if(req.body.password){
      bcrypt.hash(req.body.password, 10, async function (err, hash) {
        if (err) return res.status(200).json({success:false, message:"Update Failed Due to error in encrypting password"}); // Ensure no errors
        
        
        updatedInfo.password = hash;
        //admin update
      await Admin.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(req.params.adminId) },
        { $set: updatedInfo },
        { new: true }
      );
      });
      
    }else{
      //admin update
      await Admin.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(req.params.adminId) },
        { $set: updatedInfo },
        { new: true }
      );
    }

   

     //add admin with service
     await new AdminService({
      service: mongoose.Types.ObjectId(req.body.serviceId),
      admin: req.params.adminId,
    }).save();

    let addedAdminPopulated = await Admin.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(req.params.adminId) } },
      {
        $lookup: {
          from: AdminService.collection.name,
          localField: "_id",
          foreignField: "admin",
          as: "serviceData",
        },
      },
      { $unwind: { path: "$serviceData", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          email: 1,
          name: 1,
          serviceId: "$serviceData.service",
        },
      },
    ]);

    res.status(200).json({ success: true, message: "Admin details updated",data:addedAdminPopulated[0] });
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, error: error });
  }
};

exports.logoutUser = async (req, res, next) => {
  try {
    req.logout();
    res.status(200).json({ success: true, message: "logout successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error });
  }
};

exports.checkEmailExist = async (req, res, next) => {
  try {
    const email = req.params.email;
    let result = await Admin.countDocuments({ email: email });
    if (result > 0) {
      res.status(200).json({ success: false, message: "Email already Exist" });
    } else {
      res.status(200).json({ success: true, message: "Email is available" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
};

exports.updatePasswordFromProfile = async (req, res, next) => {
  try {
    if (req.body.password == "") {
      return res
        .status(200)
        .json({ success: false, message: "Password is required" });
    }
    bcrypt.hash(req.body.password, 10, async (err, hash) => {
      if (err) {
        res.status(500).json({ success: false, error: "Hasing error" });
      } else {
        const data = {
          password: hash,
        };
        await Admin.updateOne({ _id: req.userData.userId }, { $set: data });

        res
          .status(200)
          .json({ success: true, message: "Password has been updated" });
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
};

