const mongoose = require("mongoose");

const AttributesSchema = new mongoose.Schema(
  {
    user_attribute_id: Number,
    name: String,
    type: String,
    description: String,
    is_important: Boolean,
    default_value: String,
    lifetime: Number,
    brn: String,
  },
  { timestamps: true }
);

const AccountSchema = new mongoose.Schema(
  {
    account_id: Number,
    attributes: {
      type: Map,
      of: AttributesSchema,
    },
    attributesId: {
      type: Map,
      of: String,
    },
  },
  { timestamps: true }
);

const myDB = mongoose.connection.useDb("Messaging");
module.exports = myDB.model("Account_User_Attribute", AccountSchema);
