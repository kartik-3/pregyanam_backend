const Service = require("../models/Service");

exports.createService = async (req, res) => {
  try {
    if (!req.body.name || req.body.name == "") {
      return res
        .status(400)
        .json({ success: true, message: "Service name is required" });
    }
    if (req.body.price == undefined) {
      return res
        .status(400)
        .json({ success: true, message: "Service price is required" });
    }
    if (!req.body.userPerSlot || req.body.userPerSlot == "") {
      return res
        .status(400)
        .json({ success: true, message: "user count per slot is required" });
    }

    let newService = {
      name: req.body.name,
      price: req.body.price,
      userPerSlot: req.body.userPerSlot,
      code: req.body.code,
    };
    newService = await new Service(newService).save();
    res
      .status(201)
      .json({ success: true, message: "Service Addition successfull" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server error" });
  }
};

exports.getAllServices = async (req, res) => {
  try {
    let page = parseInt(req.params.page);
    let limit = parseInt(req.params.limit);

    let services = await Service.aggregate([
      { $sort: { createdAt: -1 } },
      { $skip: page * limit },
      { $limit: limit },
      {
        $project: {
          id: "$_id",
          title: "$name",
        },
      },
    ]);
    res.status(200).json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server error" });
  }
};
