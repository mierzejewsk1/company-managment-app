const { mysql } = require('../lib/mysql');

const FindUserWithEmail = async userEmail => {
  let query = `SELECT userID, userEmail, userPassword, userToken, userResetPasswordToken, userTypeID, userName
      FROM o_users
      WHERE userEmail = ?
      LIMIT 1
    `;
  let values = [userEmail];

  return await mysql.app.select(query, values);
}

const FindUserById = async userID => {
  let query = `SELECT userID, userEmail, userPassword, userToken, userResetPasswordToken, userTypeID, userName
      FROM o_users
      WHERE userID = ?
      LIMIT 1
    `;
  let values = [userID];

  return await mysql.app.select(query, values);
}

const FindUsersByIds = async userIDs => {
  let query = `SELECT userID, userEmail, userPassword, userToken, userResetPasswordToken, userTypeID, userName
      FROM o_users
      WHERE userID IN (?)
    `;
  let values = [userIDs];

  return await mysql.app.select(query, values);
}

const FindUserByResetToken = async userResetPasswordToken => {
  let query = `SELECT userID, userEmail, userPassword, userToken, userResetPasswordToken, userTypeID, userName
      FROM o_users
      WHERE userResetPasswordToken = ?
      LIMIT 1
    `;
  let values = [userResetPasswordToken];

  return await mysql.app.select(query, values);
}

const FindMatchingEmail = async userEmail => {
  let query = `
    SELECT userEmail
    FROM o_users 
    WHERE userEmail = ?
    LIMIT 1
    `;
  let values = [userEmail];

  return await mysql.app.select(query, values);
}

const FindUserTypeNameById = async userID => {
    let query = `
      SELECT c.userTypeName
      FROM o_users o
      JOIN c_user_types c ON o.userTypeID = c.userTypeID
      WHERE o.userID = ?
      LIMIT 1
      `;
    let values = [userID];
  
    return await mysql.app.select(query, values);
  }

const FindUsers = async () => {
    let query = `SELECT userID, userEmail, userTypeID, userName
        FROM o_users
      `;
    let values = [];
  
    return await mysql.app.select(query, values);
  }

const UpdateUserToken = async (userID, userToken) => {
  let query = `
    UPDATE o_users 
    SET userToken = ?
    WHERE userID = ?
    `;
  let values = [userToken, userID];

  return await mysql.app.update(query, values);
}

const UpdateUserResetPasswordToken = async (userID, userResetPasswordToken) => {
  let query = `
    UPDATE o_users 
    SET userResetPasswordToken = ?
    WHERE userID = ?
    `;
  let values = [userResetPasswordToken, userID];

  return await mysql.app.update(query, values);
}

const UpdateUserPassword = async (userID, userPassword) => {
  let query = `
    UPDATE o_users 
    SET userPassword = ?
    WHERE userID = ?
    `;
  let values = [userPassword, userID];

  return await mysql.app.update(query, values);
}

const UpdateEmployeeById = async (
  employeeID, employeeObject) => {
  let query = `
      UPDATE o_users 
      SET ? 
      WHERE userID = ?
    `;

  let values = [employeeObject, employeeID];

  return await mysql.app.update(query, values);
}

const InsertNewUser = async (userEmail, userName, userTypeID, userPassword ) => {
  let query = `
    INSERT INTO o_users (userEmail, userName, userTypeID, userPassword  )
    VALUES ?
  `;
  let values = [[[userEmail, userName, userTypeID, userPassword ]]];

  return await mysql.app.insert(query, values);
}

const DeleteEmployeeById = async (employeeID) => {
  let query = `
    DELETE FROM o_users WHERE userID = ?
`;
  let values = [employeeID];

  return await mysql.app.delete(query, values);
}

const DeleteEmployeesById = async (employeeIDs) => {
  let query = `
    DELETE FROM o_users WHERE userID IN (?)
`;
  let values = [employeeIDs];

  return await mysql.app.delete(query, values);
}

module.exports = {
  FindUserWithEmail,
  FindUserById,
  FindUsersByIds,
  FindUserByResetToken,
  FindMatchingEmail,
  FindUserTypeNameById,
  FindUsers,
  UpdateUserToken,
  UpdateUserResetPasswordToken,
  UpdateUserPassword,
  UpdateEmployeeById,
  InsertNewUser,
  DeleteEmployeeById,
  DeleteEmployeesById 
}