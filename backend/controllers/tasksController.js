const userQuery = require('../queries/userQueries');
const tasksQuery = require('../queries/tasksQueries');
const { StatusCodeEnum, ErrorCodeEnum } = require('../statusCodeEnum');
const { HeaderEnum } = require('../headersEnum');

const DisplayTasks= async (req, res) => {
  const userID = req.user.userID;
  try {
    const [user] = await userQuery.FindUserById(userID);
    if (user === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    if (user.userTypeID !== 1 && user.userTypeID !== 2)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.TYPE_OF_USER_DO_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    let taskData;
    if (user.userTypeID === 2)
        taskData = await tasksQuery.FindTasksByUserID(user.userID);
    else
        taskData = await tasksQuery.FindTasks();

    return res.status(StatusCodeEnum.OK).json({ taskData });

  } catch (error) {
    console.error(error);
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
  }
};

// function to add tasks, only admin can add tasks
const AddTasks = async (req, res) => {
  const userID1 = req.user.userID;

  const { taskDescription, taskEndDate, userID } = req.body;
  try {
    const [user] = await userQuery.FindUserById(userID1);

    if (user === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    if (typeof taskDescription != "string" || typeof userID != "number" || typeof taskEndDate != "string")
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.PARAM_TYPE_IS_INAPPROPRIATE).status(StatusCodeEnum.BAD_REQUEST).send();

    if (user.userTypeID !== 1)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_IS_NOT_ADMIN).status(StatusCodeEnum.BAD_REQUEST).send();

    await tasksQuery.InsertNewTask(taskDescription, taskEndDate, userID, 0);

    return res.status(StatusCodeEnum.OK).json({ msg: "Dodano nowe zadanie" });
  } catch (error) {
    console.error(error);
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
  }
}

const ToggleTasks = async (req, res) => {
    const userID1 = req.user.userID;
  
    const { taskID } = req.body;
    try {
      const [user] = await userQuery.FindUserById(userID1);
  
      if (user === undefined)
        return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();
  
      if (typeof taskID != "number")
        return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.PARAM_TYPE_IS_INAPPROPRIATE).status(StatusCodeEnum.BAD_REQUEST).send();
  
      await tasksQuery.ToggleTaskState( taskID );
  
      return res.status(StatusCodeEnum.OK).json({ msg: "Zmieniono stan zadania" });
    } catch (error) {
      console.error(error);
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
    }
  }



module.exports = {
 DisplayTasks,
 AddTasks,
 ToggleTasks
}