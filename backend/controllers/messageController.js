const userQuery = require('../queries/userQueries');
const messageQuery = require('../queries/messageQueries');
const { StatusCodeEnum, ErrorCodeEnum } = require('../statusCodeEnum');
const { HeaderEnum } = require('../headersEnum');

// DisplayEmployees return users available to send message to

// function to return all messages with selected person
const DisplayMessaages = async (req, res) => {
  const userID = req.user.userID;
  const { recipientID } = req.body;

  try {
    const [user] = await userQuery.FindUserById(userID);
    if (user === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    const [recipient] = await userQuery.FindUserById(recipientID);
    if (recipient === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    const messagesData = await messageQuery.FindMessagesForConversation(userID, recipientID);

    return res.status(StatusCodeEnum.OK).json({ messagesData });

  } catch (error) {
    console.error(error);
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
  }
};

// function to send message 
const SendMessage = async (req, res) => {
  const userID = req.user.userID;
  const { recipientID, messageDescription } = req.body;

  try {
    const [user] = await userQuery.FindUserById(userID);
    if (user === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    const [recipient] = await userQuery.FindUserById(recipientID);
    if (recipient === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    if (typeof recipientID != "number")
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.PARAM_TYPE_IS_INAPPROPRIATE).status(StatusCodeEnum.BAD_REQUEST).send();

    if (typeof messageDescription != "string")
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.PARAM_TYPE_IS_INAPPROPRIATE).status(StatusCodeEnum.BAD_REQUEST).send();

    await messageQuery.InsertNewMessage(userID, recipientID, messageDescription);

    return res.status(StatusCodeEnum.OK).json({ msg: `Wysłano wiadomość do użytkownika #${userID}` });

  } catch (error) {
    console.error(error);
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
  }
};

// function to delete all messages from conversation
const DeleteConversation = async (req, res) => {
  const userID = req.user.userID;
  const { recipientID } = req.body;

  try {
    const [user] = await userQuery.FindUserById(userID);
    if (user === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    const [recipient] = await userQuery.FindUserById(recipientID);
    if (recipient === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    if (typeof recipientID != "number")
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.PARAM_TYPE_IS_INAPPROPRIATE).status(StatusCodeEnum.BAD_REQUEST).send();

    await messageQuery.DeleteConversation(userID, recipientID);

    return res.status(StatusCodeEnum.OK).json({ msg: `Usunięto konwersację z użytkownikiem #${recipientID}` });

  } catch (error) {
    console.error(error);
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
  }
};

// function to delete single message from conversation
const DeleteMessage = async (req, res) => {
  const userID = req.user.userID;
  const { messageID } = req.body;

  try {
    if (typeof messageID != "number")
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.PARAM_TYPE_IS_INAPPROPRIATE).status(StatusCodeEnum.BAD_REQUEST).send();

    const [user] = await userQuery.FindUserById(userID);
    if (user === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    const [message] = await messageQuery.FindMessageById(messageID);
    if (message === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.MESSAGE_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    if (message.userID !== userID && message.recipientID !== userID)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.THIS_USER_CAN_NOT_DO_THIS).status(StatusCodeEnum.BAD_REQUEST).send();

    await messageQuery.DeleteMessage(messageID);

    return res.status(StatusCodeEnum.OK).json({ msg: `Usunięto wiadomość numer #${messageID}` });

  } catch (error) {
    console.error(error);
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
  }
};

module.exports = {
  DisplayMessaages,
  SendMessage,
  DeleteConversation,
  DeleteMessage
}