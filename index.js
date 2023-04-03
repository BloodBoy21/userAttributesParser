require("dotenv").config();
require("./lib/mongo")();
const prisma = require("./prisma/index");
const UserAttributes = require("./models/UserAttribute");
const AccountUserAttributes = require("./models/AccountUserAttribute");
const _ = require("lodash");
async function getAllUserAttributes() {
  const query = {
    include: {
      User_Attribute_Value: true,
    },
  };
  const allUserAttributes = await prisma.user_Attribute.findMany(query);
  return allUserAttributes;
}

const getAccountAttributes = async (accountId) => {
  const account = await AccountUserAttributes.findOne(
    {
      account_id: accountId,
    },
    { attributes: 1 }
  ).lean();
  const { attributes } = account || {};
  const { _id, ...rest } = attributes || {};
  return rest || {};
};

const updateAccountAttributes = async (accountId, attributes) => {
  const accountAttributes = await AccountUserAttributes.findOne({
    account_id: accountId,
  }).lean();
  if (!accountAttributes)
    return await createAccountAttributes({
      account_id: accountId,
      attributes,
    });
  accountAttributes.attributes = {
    ...accountAttributes.attributes,
    ...attributes,
  };
  const query = { account_id: accountId };
  const update = { ...accountAttributes };
  await AccountUserAttributes.findOneAndUpdate(query, update);
};

const createAccountAttributes = async (data) => {
  await AccountUserAttributes.create(data);
};

const getUserAttributes = async (userId) => {
  const user = await UserAttributes.findOne(
    {
      user_id: userId,
    },
    {
      attributes: 1,
    }
  ).lean();
  const { attributes } = user || {};
  const { _id, ...rest } = attributes || {};
  return rest || {};
};

const updateUserAttributes = async (userId, accountId, attributes) => {
  const userAttributes = await UserAttributes.findOne({
    user_id: userId,
  }).lean();
  if (!userAttributes)
    return await createUserAttributes({
      user_id: userId,
      account_id: accountId,
      attributes,
    });
  userAttributes.attributes = {
    ...userAttributes.attributes,
    ...attributes,
  };
  const query = { user_id: userId };
  const update = { ...userAttributes };
  await UserAttributes.findOneAndUpdate(query, update);
};

const createUserAttributes = async (data) => {
  await UserAttributes.create(data);
};

async function parseUserAttributes(userAttributes) {
  for (const userAttribute of userAttributes) {
    const {
      account_id: accountId,
      User_Attribute_Value = [],
      ...rest
    } = userAttribute;
    let { name } = userAttribute;
    name = name.replace(/\./g, "_").toLowerCase();
    const accountAttributes = await getAccountAttributes(accountId);
    await updateAccountAttributes(accountId, {
      ...accountAttributes,
      [name]: { ...rest, name },
    });
    console.log({ name, accountId });
    if (_.isEmpty(User_Attribute_Value)) continue;
    for (const attribute of User_Attribute_Value) {
      const attributes = await getUserAttributes(attribute.user_id);
      console.log({ name, userId: attribute.user_id });
      await updateUserAttributes(attribute.user_id, accountId, {
        ...attributes,
        [name]: { ...attribute, name },
      });
    }
  }
}

(async () => {
  try {
    const userAttributes = await getAllUserAttributes();
    await parseUserAttributes(userAttributes);
    console.log("Done");
  } catch (err) {
    console.log(err);
  }
})();
