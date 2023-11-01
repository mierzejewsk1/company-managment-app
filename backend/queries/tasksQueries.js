const { mysql } = require('../lib/mysql');

const FindTasks = async () => {
  let query = `
    SELECT
        t.taskID,
        t.taskDescription,
        t.taskEndDate,
        t.userID,
        u.userName,
        t.taskState
    FROM o_tasks AS t
    JOIN o_users AS u ON t.userID = u.userID;
    `;
  return await mysql.app.select(query);
}

const FindTasksByUserID = async (userID) => {
    let query = `
      SELECT
        t.taskID,
        t.taskDescription,
        t.taskEndDate,
        t.userID,
        u.userName,
        t.taskState
      FROM o_tasks AS t
      JOIN o_users AS u ON t.userID = u.userID
      WHERE u.userID = ?;
    `;
    let values = [[userID]];
  
    return await mysql.app.select(query, values);
}
  
const FindTaskByTaskID = async (taskID) => {
    let query = `
        SELECT
        t.taskID,
        t.taskDescription,
        t.taskEndDate,
        t.userID,
        u.userName,
        t.taskState
        FROM o_tasks AS t
        JOIN o_users AS u ON t.userID = u.userID
        WHERE t.taskID = ?;
    `;
    let values = [[taskID]];

    return await mysql.app.select(query, values);
}

const ToggleTaskState = async (taskID) => {
    let query = `
      UPDATE o_tasks
      SET taskState = CASE WHEN taskState = 0 THEN 1 ELSE 0 END
      WHERE taskID = ?;
    `;
    let values = [taskID];
  
    return await mysql.app.select(query, values);
}
  
const InsertNewTask = async (taskDescription, taskEndDate, userID, taskState) => {
    let query = `
        INSERT INTO o_tasks (taskDescription, taskEndDate, userID, taskState)
        VALUES ?;
    `;
    let values = [[[taskDescription, taskEndDate, userID, taskState]]];

    return await mysql.app.insert(query, values);
}
  

module.exports = {
    FindTasks,
    FindTasksByUserID,
    FindTaskByTaskID,
    ToggleTaskState,
    InsertNewTask
}