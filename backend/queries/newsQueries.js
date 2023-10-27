const { mysql } = require('../lib/mysql');

const FindAllNews = async () => {
  let query = `SELECT n.newsID, n.newsDescription, n.targetGroupID, n.userID, u.userName, c.targetGroupName
    FROM o_news n JOIN o_users u ON n.userID = u.userID JOIN c_target_groups c ON n.targetGroupID = c.targetGroupID;
    `;
  return await mysql.app.select(query);
}

const FindNewsForWorkers = async () => {
  let query = `SELECT n.newsID, n.newsDescription, n.targetGroupID, n.userID, u.userName, c.targetGroupName
    FROM o_news n JOIN o_users u ON n.userID = u.userID JOIN c_target_groups c ON n.targetGroupID = c.targetGroupID
    WHERE n.targetGroupID = 1; 
    `;
  return await mysql.app.select(query);
}

const InsertNews = async (newsDescription, targetGroupID, userID) => {
  let query = `
    INSERT INTO o_news (newsDescription, targetGroupID, userID)
    VALUES ?
  `;
  let values = [[[newsDescription, targetGroupID, userID]]];

  return await mysql.app.insert(query, values);
}

const FindNewsByNewsId = async (newsID) => {
  let query = `SELECT n.newsID, n.newsDescription, n.targetGroupID, n.userID, u.userName, c.targetGroupName
    FROM o_news n JOIN o_users u ON n.userID = u.userID JOIN c_target_groups c ON n.targetGroupID = c.targetGroupID
    WHERE n.newsID = ?; 
    `;
  let values = [newsID];
  return await mysql.app.select(query, values);
}

const DeleteNews = async (newsID) => {
  let query = `
    DELETE FROM o_news WHERE newsID = ?
  `;
  let values = [newsID];

  return await mysql.app.delete(query, values);
}

module.exports = {
  FindAllNews,
  FindNewsForWorkers,
  InsertNews,
  FindNewsByNewsId,
  DeleteNews,
}