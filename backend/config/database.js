const crypto = require("crypto").randomBytes(256).toString("hex");
// Provides cryptographic functionality (OpenSSL's hash, HMAC, cipher, decipher, sign and verify functions)

// Export config object
module.exports = {
  uri:
    "mongodb+srv://root:root123@excel-sheet-dev.3surr.mongodb.net/project-three",
  // "mongodb+srv://root:root123@excel-sheet-dev.3surr.mongodb.net/project-one",
  secret: "amide#14",
  db: "amin-data",
  pasword: "A33VkCNhdSKNFOtr",
  secret: "aminuddin",
  keys: {
    storage: {
      // CLOUD_BUCKET: "bht-client-bucket",
      CLOUD_BUCKET: "extra-insights-images",
    },
    razorpay: {
      keyId: "rzp_test_Rdjz7JaE3W1xJS",
      keySecret: "UoRMf58MqL4yumpbpz3zPPqt",
    },
  },
};
