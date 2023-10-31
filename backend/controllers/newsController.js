const userQuery = require('../queries/userQueries');
const newsQuery = require('../queries/newsQueries');
const { StatusCodeEnum, ErrorCodeEnum } = require('../statusCodeEnum');
const { HeaderEnum } = require('../headersEnum');

const DisplayNews = async (req, res) => {
  const userID = req.user.userID;
  try {
    const [user] = await userQuery.FindUserById(userID);
    if (user === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    if (user.userTypeID !== 1 && user.userTypeID !== 2)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.TYPE_OF_USER_DO_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    let newsData;
    if (user.userTypeID === 2)
      newsData = await newsQuery.FindNewsForWorkers();
    else
      newsData = await newsQuery.FindAllNews();

    return res.status(StatusCodeEnum.OK).json({ newsData });

  } catch (error) {
    console.error(error);
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
  }
};

// function to add news, only admin can add news
const AddNews = async (req, res) => {
  const userID = req.user.userID;
  const { newsDescription, targetGroupID } = req.body;
  try {
    const [user] = await userQuery.FindUserById(userID);
    if (user === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    if (typeof newsDescription != "string" || typeof targetGroupID != "number")
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.PARAM_TYPE_IS_INAPPROPRIATE).status(StatusCodeEnum.BAD_REQUEST).send();

    if (user.userTypeID !== 1)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_IS_NOT_ADMIN).status(StatusCodeEnum.BAD_REQUEST).send();

    if (targetGroupID !== 1 && targetGroupID !== 2)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.TYPE_OF_USER_DO_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    await newsQuery.InsertNews(newsDescription, targetGroupID, userID);

    return res.status(StatusCodeEnum.OK).json({ msg: "Dodano nowe ogłoszenie." });
  } catch (error) {
    console.error(error);
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
  }
}

// function do delete news, every admin can delete news
const DeleteNews = async (req, res) => {
  const userID = req.user.userID;
  const { newsID } = req.body;
  try {
    const [user] = await userQuery.FindUserById(userID);
    if (user === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    if (typeof newsID != "number")
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.PARAM_TYPE_IS_INAPPROPRIATE).status(StatusCodeEnum.BAD_REQUEST).send();

    if (user.userTypeID !== 1)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_IS_NOT_ADMIN).status(StatusCodeEnum.BAD_REQUEST).send();

    const [news] = await newsQuery.FindNewsByNewsId(newsID);
    if (news === undefined)
      return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.NEWS_DO_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    await newsQuery.DeleteNews(newsID);

    return res.status(StatusCodeEnum.OK).json({ msg: "Pomyślnie usunięto ogłoszenie." });
  } catch (error) {
    console.error(error);
    return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
  }
}

module.exports = {
  DisplayNews,
  AddNews,
  DeleteNews,
}