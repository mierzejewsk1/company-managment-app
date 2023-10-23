const { mysql } = require('../lib/mysql');

const FindWorkspaces = async () => {
  let query = `SELECT w.workspaceID, w.userID, w.workspaceNumber, w.isAvailable, u.userName, c.userTypeName
    FROM o_workspaces w LEFT JOIN o_users u ON w.userID = u.userID LEFT JOIN c_user_types c ON u.userTypeID = c.userTypeID;
    `;
  return await mysql.app.select(query);
}

const FindWorkspaceByWorkspaceId = async (workspaceID) => {
  let query = `SELECT w.workspaceID, w.userID, w.workspaceNumber, w.isAvailable, u.userName, c.userTypeName
    FROM o_workspaces w LEFT JOIN o_users u ON w.userID = u.userID LEFT JOIN c_user_types c ON u.userTypeID = c.userTypeID
    WHERE w.workspaceID = ?;
    `;
  let values = [workspaceID]
  return await mysql.app.select(query, values);
}

const FindUserWorkspaceAmount = async (employeeID) => {
  let query = `SELECT COUNT(*) AS workspaceAmount
    FROM o_workspaces
    WHERE userID = ?;
    `;
  let values = [employeeID]
  return await mysql.app.select(query, values);
}

const UpdateWorkspace = async (workspaceID, employeeID) => {
  let query = `
    UPDATE o_workspaces
    SET userID = ? 
    WHERE workspaceID = ?
  `;
  let values = [employeeID, workspaceID];
  return await mysql.app.update(query, values);
}

const RemoveEmployeeFromWorkspace = async (workspaceID) => {
  let query = `
    UPDATE o_workspaces
    SET userID = null 
    WHERE workspaceID = ?
  `;
  let values = [workspaceID];
  return await mysql.app.update(query, values);
}

const UpdateWorkspaceAvailability = async (workspaceID, availableValue) => {
  let query = `
    UPDATE o_workspaces
    SET isAvailable = ? 
    WHERE workspaceID = ?
  `;
  let values = [availableValue, workspaceID];
  return await mysql.app.update(query, values);
}

module.exports = {
  FindWorkspaces,
  FindWorkspaceByWorkspaceId,
  FindUserWorkspaceAmount,
  UpdateWorkspace,
  RemoveEmployeeFromWorkspace,
  UpdateWorkspaceAvailability
}