const userQuery = require('../queries/userQueries');
const workspaceQuery = require('../queries/workspaceQueries');
const { StatusCodeEnum, ErrorCodeEnum } = require('../statusCodeEnum');
const { HeaderEnum } = require('../headersEnum');

const DisplayWorkspaces = async (req, res) => {
  const userID = req.user.userID;
  try {
    const [user] = await userQuery.FindUserById(userID);
    if (user === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    if (user.userTypeID !== 1)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_IS_NOT_ADMIN).status(StatusCodeEnum.BAD_REQUEST).send();

    let workspacesData = await workspaceQuery.FindWorkspaces();
    return res.status(StatusCodeEnum.OK).json({ workspacesData });

  } catch (error) {
    console.error(error);
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
  }
};

const AssignEmployeeToWorkspace = async (req, res) => {
  const userID = req.user.userID;
  const { employeeID, workspaceID } = req.body;
  try {
    const [user] = await userQuery.FindUserById(userID);
    if (user === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    if (typeof employeeID != "number" || typeof workspaceID != "number")
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.PARAM_TYPE_IS_INAPPROPRIATE).status(StatusCodeEnum.BAD_REQUEST).send();

    if (user.userTypeID !== 1)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_IS_NOT_ADMIN).status(StatusCodeEnum.BAD_REQUEST).send();

    const [employee] = await userQuery.FindUserById(employeeID);
    if (employee === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    const [workspace] = await workspaceQuery.FindWorkspaceByWorkspaceId(workspaceID);
    if (workspace === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.WORKSPACE_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    if (workspace.userID !== null)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.CAN_NOT_ADD_USER_TO_SELECTED_WORKSPACE).status(StatusCodeEnum.BAD_REQUEST).send();

    const workspaceOfUserAmount = (await workspaceQuery.FindUserWorkspaceAmount(employeeID))[0];
    if (workspaceOfUserAmount.workspaceAmount > 0)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_HAS_ASSIGNED_WORKSPACE).status(StatusCodeEnum.BAD_REQUEST).send();

    await workspaceQuery.UpdateWorkspace(workspaceID, employeeID);

    return res.status(StatusCodeEnum.OK).json({ msg: "Przypisano użytkownika do wybranego stanowiska." });
  } catch (error) {
    console.error(error);
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
  }
}

const DeleteEmployeeFromWorkspace = async (req, res) => {
  const userID = req.user.userID;
  const { workspaceID } = req.body;
  try {
    const [user] = await userQuery.FindUserById(userID);
    if (user === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    if (typeof workspaceID != "number")
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.PARAM_TYPE_IS_INAPPROPRIATE).status(StatusCodeEnum.BAD_REQUEST).send();

    if (user.userTypeID !== 1)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_IS_NOT_ADMIN).status(StatusCodeEnum.BAD_REQUEST).send();

    const [workspace] = await workspaceQuery.FindWorkspaceByWorkspaceId(workspaceID);
    if (workspace === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.WORKSPACE_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    if (workspace.userID === null)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.WORKSPACE_DOES_NOT_HAVE_WORKER).status(StatusCodeEnum.BAD_REQUEST).send();

    await workspaceQuery.RemoveEmployeeFromWorkspace(workspaceID);

    return res.status(StatusCodeEnum.OK).json({ msg: "Usunięto pracownika z wybranego stanowiska." });
  } catch (error) {
    console.error(error);
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
  }
}

const BlockWorkspace = async (req, res) => {
  const userID = req.user.userID;
  const { workspaceID } = req.body;
  try {
    const [user] = await userQuery.FindUserById(userID);
    if (user === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    if (typeof workspaceID != "number")
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.PARAM_TYPE_IS_INAPPROPRIATE).status(StatusCodeEnum.BAD_REQUEST).send();

    if (user.userTypeID !== 1)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_IS_NOT_ADMIN).status(StatusCodeEnum.BAD_REQUEST).send();

    const [workspace] = await workspaceQuery.FindWorkspaceByWorkspaceId(workspaceID);
    if (workspace === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.WORKSPACE_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    const { isAvailable } = workspace;
    if (isAvailable === 0)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.WORKSPACE_IS_ALREADY_UNAVAILABLE).status(StatusCodeEnum.BAD_REQUEST).send();

    await workspaceQuery.UpdateWorkspaceAvailability(workspaceID, 0);

    return res.status(StatusCodeEnum.OK).json({ msg: "Usunięto pracownika z wybranego stanowiska." });
  } catch (error) {
    console.error(error);
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
  }
}

const UnblockWorkspace = async (req, res) => {
  const userID = req.user.userID;
  const { workspaceID } = req.body;
  try {
    const [user] = await userQuery.FindUserById(userID);
    if (user === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    if (typeof workspaceID != "number")
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.PARAM_TYPE_IS_INAPPROPRIATE).status(StatusCodeEnum.BAD_REQUEST).send();

    if (user.userTypeID !== 1)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_IS_NOT_ADMIN).status(StatusCodeEnum.BAD_REQUEST).send();

    const [workspace] = await workspaceQuery.FindWorkspaceByWorkspaceId(workspaceID);
    if (workspace === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.WORKSPACE_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    const { isAvailable } = workspace;
    if (isAvailable === 1)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.WORKSPACE_IS_ALREADY_AVAILABLE).status(StatusCodeEnum.BAD_REQUEST).send();

    await workspaceQuery.UpdateWorkspaceAvailability(workspaceID, 1);

    return res.status(StatusCodeEnum.OK).json({ msg: "Usunięto pracownika z wybranego stanowiska." });
  } catch (error) {
    console.error(error);
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
  }
}


module.exports = {
  DisplayWorkspaces,
  AssignEmployeeToWorkspace,
  DeleteEmployeeFromWorkspace,
  BlockWorkspace,
  UnblockWorkspace
}