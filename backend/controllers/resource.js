const mongoose = require("mongoose");
const Resource = require("../models/Resource");

exports.addResource = async (req, res) => {
  try {
    let {
      name,
      url,
      description,
      type, //BOOK, VIDEO
      price,
    } = req.body;

    let user = req.userData.userId;
    let addedResource = await new Resource({
      name,
      url,
      description,
      type,
      price,
      creator: user,
    }).save();
    res.status(201).json({
      success: true,
      message: `Resource Added Successfully`,
      data: addedResource,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server error" });
  }
};

/**admin api */
exports.getAllResources = async (req, res) => {
  try {
    let page = parseInt(req.params.page);
    let limit = parseInt(req.params.limit);

    let obj = {};
    if (req.query.type && req.query.type != "") {
      obj["type"] = req.query.type;
    }
    if (req.query.name && req.query.name != "") {
      obj["name"] = RegExp(req.query.name.trim(), "i");
    }

    let resources = await Resource.find(obj)
      .sort({ createdAt: -1 })
      .skip(page * limit)
      .limit(limit)
      .populate("creator");
    res.status(200).json({ success: true, data: resources });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server error" });
  }
};
