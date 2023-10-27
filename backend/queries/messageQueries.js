const { mysql } = require('../lib/mysql');

const FindMessagesForConversation = async (userID, recipientID) => {
  let query = `SELECT m.messageID, m.userID, m.recipientID, m.messageDescription, m.insertTimestamp, u.userName
    FROM o_messages m JOIN o_users u ON m.userID = u.userID 
    WHERE (m.userID = ? AND m.recipientID = ?) OR (m.userID = ? AND m.recipientID = ?)
    ORDER BY m.insertTimestamp ASC;
    `;
  let values = [userID, recipientID, recipientID, userID]
  return await mysql.app.select(query, values);
}

const InsertNewMessage = async (userID, recipientID, messageDescription) => {
  let query = `
    INSERT INTO o_messages (userID, recipientID, messageDescription)
    VALUES ?
  `;
  let values = [[[userID, recipientID, messageDescription]]];

  return await mysql.app.insert(query, values);
}

const DeleteConversation = async (userID, recipientID) => {
  let query = `
    DELETE FROM o_messages WHERE (userID = ? AND recipientID = ? ) OR (userID = ? AND recipientID = ? )
  `;
  let values = [userID, recipientID, recipientID, userID];

  return await mysql.app.delete(query, values);
}

const FindMessageById = async (messageID) => {
  let query = `SELECT m.messageID, m.userID, m.recipientID, m.messageDescription, m.insertTimestamp, u.userName
    FROM o_messages m JOIN o_users u ON m.userID = u.userID 
    WHERE m.messageID = ?
    `;
  let values = [messageID]
  return await mysql.app.select(query, values);
}

const DeleteMessage = async (messageID) => {
  let query = `
    DELETE FROM o_messages WHERE messageID = ?
  `;
  let values = [messageID];

  return await mysql.app.delete(query, values);
}

module.exports = {
  FindMessagesForConversation,
  InsertNewMessage,
  DeleteConversation,
  FindMessageById,
  DeleteMessage,
}