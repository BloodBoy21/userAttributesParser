const mongoose = require("mongoose");

const AttributesSchema = new mongoose.Schema(
  {
    user_attribute_value_id: Number,
    name: String,
    value: String,
    cipher: String,
    user_id: Number,
    platform: String,
    type: String,
    description: String,
    is_important: Boolean,
    lifetime: Number,
    brn: String,
  },
  { timestamps: true }
);

const UserSchema = new mongoose.Schema(
  {
    account_id: Number,
    user_id: Number,
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
module.exports = myDB.model("User_Attribute", UserSchema);
