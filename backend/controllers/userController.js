const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userQuery = require('../queries/userQueries');
const { StatusCodeEnum, ErrorCodeEnum } = require('../statusCodeEnum');
const { HeaderEnum } = require('../headersEnum');

const createToken = (userID, expirationTime) => {
    return jwt.sign({ userID: userID }, process.env.SECRET, { expiresIn: expirationTime });
}

//Check if email format is correct
const emailRegex = new RegExp(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/);

const LoginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!emailRegex.test(email)) 
        return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.INCORRECT_EMAIL_FORMAT).status(StatusCodeEnum.BAD_REQUEST).send();

    try {
        const [user] = await userQuery.FindUserWithEmail(email);
        if (user === undefined)
            return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.INCORRECT_EMAIL_OR_PASSWORD).status(StatusCodeEnum.BAD_REQUEST).send();

        const match = await bcrypt.compare(password, user.userPassword);
        if (!match)
            return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.INCORRECT_EMAIL_OR_PASSWORD).status(StatusCodeEnum.BAD_REQUEST).send();

        const [ userData ] = await userQuery.FindUserTypeNameById(user.userID);
        if (userData === undefined)
            return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_HAS_NO_TYPE).status(StatusCodeEnum.BAD_REQUEST).send();
        const {userTypeName} = userData;

        const token = createToken(user.userID, '1d');
        await userQuery.UpdateUserToken(user.userID, token);
        return res.status(StatusCodeEnum.OK).json({ email, token, userTypeName });

    } catch (error) {
        console.error(error);
        return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
    }
};

const LogoutUser = async (req, res) => {
    const userID = req.user.userID;

    await userQuery.UpdateUserToken(userID, null);

    return res.status(StatusCodeEnum.OK).json({ msg: 'Logged out successfully' });
};

//Make user log in automatically if his token in local storage is not expired 
const ValidateLogin = async (req, res) => {
    return res.status(StatusCodeEnum.OK).send();
}

module.exports = {
    LoginUser,
    LogoutUser,
    ValidateLogin
}
