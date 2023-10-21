const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userQuery = require('../queries/userQueries');
const { StatusCodeEnum, ErrorCodeEnum } = require('../statusCodeEnum');
const { HeaderEnum } = require('../headersEnum');

const mailer = require('../lib/mailer');
const mailerConfig = require('../lib/mailerConfig');


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

        const [userData] = await userQuery.FindUserTypeNameById(user.userID);
        if (userData === undefined)
            return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_HAS_NO_TYPE).status(StatusCodeEnum.BAD_REQUEST).send();
        const { userTypeName } = userData;

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

const SendResetPasswordEmailHTML = async (req, res) => {
    const { email } = req.body

    const [user] = await userQuery.FindUserWithEmail(email);

    if (user === undefined)
        return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

    let userName = user.userName;
    if (user.userName === undefined || user.userName === undefined)
        userName = "Użytkownik";

    const resetToken = createToken(user.userID, '15m')

    await userQuery.UpdateUserResetPasswordToken(user.userID, resetToken);

    const sender = mailerConfig.mailer['testmail45122@gmail.com'].auth.user;
    const address = email;
    const subject = 'Reset Hasła';
    const resetLink = `http://localhost:5173/get-new-password/?token=${resetToken}`; //change localhost
    const html = await mailer.loadTemplate('resetPassword.html', { userName, resetLink })

    mailer.sendHTMLMail(sender, address, subject, html);
    return res.status(StatusCodeEnum.OK).json({ msg: 'Email sent succesfully' });

}

const ResetPassword = async (req, res) => {
    //I assume that userRestartPasswordToken will be extracted from link in front-end and sent here
    const { resetToken, newPassword, newPassword2 } = req.body;

    if (newPassword2 !== newPassword)
        return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.PASSWORDS_DONT_MATCH).status(StatusCodeEnum.BAD_REQUEST).send();

    if (resetToken === undefined || resetToken === null)
        return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.NO_RESET_PASSWORD_TOKEN).status(StatusCodeEnum.BAD_REQUEST).send();

    try {
        const [user] = await userQuery.FindUserByResetToken(resetToken)

        if (user === undefined) {
            return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();
        }

        //Verify token validity (check if resetToken is expired)
        jwt.verify(resetToken, process.env.SECRET);

        //Change password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const updateUserPassword = userQuery.UpdateUserPassword(user.userID, hashedPassword);
        const updateUserResetPasswordToken = userQuery.UpdateUserResetPasswordToken(user.userID, null);

        await Promise.all([updateUserPassword, updateUserResetPasswordToken]);

        return res.status(StatusCodeEnum.OK).json({ msg: 'Password reset successfully' });
    }
    catch (error) {
        console.error(error);
        if (error instanceof jwt.TokenExpiredError)
            return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.RESET_TOKEN_EXPIRED).status(StatusCodeEnum.UNAUTHORIZED).send();
        else
            return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
    }
}

//Make user log in automatically if his token in local storage is not expired 
const ValidateLogin = async (req, res) => {
    return res.status(StatusCodeEnum.OK).send();
}

const CreateEmployee = async (req, res) => {
    const { email, userName, password } = req.body;
    const userID = req.user.userID;
    if (!emailRegex.test(email))
        return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.INCORRECT_EMAIL_FORMAT).status(StatusCodeEnum.BAD_REQUEST).send();

    try {
        const [user] = await userQuery.FindUserById(userID);

        if (user.userTypeID !== 1)
            return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_IS_NOT_ADMIN).status(StatusCodeEnum.UNAUTHORIZED).send();

        const [matchingEmail] = await userQuery.FindMatchingEmail(email);

        if (matchingEmail !== null && matchingEmail !== undefined)
            return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.EMAIL_WAS_TAKEN).status(StatusCodeEnum.BAD_REQUEST).send();

        const hashedPassword = await bcrypt.hash(password, 10);

        await userQuery.InsertNewUser(email, userName, 2, hashedPassword);

        return res.status(StatusCodeEnum.OK).json({ msg: 'Standard user was added' });
    }
    catch (error) {
        console.error(error);
        return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
    }
}

const DisplayEmployees = async (req, res) => {
    const userID = req.user.userID;
    try {
        const [user] = await userQuery.FindUserById(userID);

        let employeesData = await userQuery.FindUsers();

        employeesData = employeesData.filter(employee => employee.userID !== userID);

        return res.status(StatusCodeEnum.OK).json({ employeesData });

    } catch (error) {
        console.error(error);
        return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
    }
};

const DeleteEmployee = async (req, res) => {
    const { employeeID } = req.body;
    const userID = req.user.userID;

    try {
        const [user] = await userQuery.FindUserById(userID);

        const [employee] = await userQuery.FindUserById(employeeID);
        if (employee === undefined)
            return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

        if (user.userTypeID !== 1)
            return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_IS_NOT_ADMIN).status(StatusCodeEnum.UNAUTHORIZED).send();

        await userQuery.DeleteEmployeeById(employeeID);

        return res.status(StatusCodeEnum.OK).json({ msg: 'Deleted users successfully' });

    } catch (error) {
        console.error(error);
        return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
    }
};

const EditEmployee = async (req, res) => {
    const { employeeID } = req.body;

    const userID = req.user.userID;

    let employeeObject = Object.keys(req.body).reduce((object, key) => {
        if (key !== "employeeID") {
            object[key] = req.body[key];
        }
        return object;
    }, {});

    try {
        const [user] = await userQuery.FindUserById(userID);

        if (user.userTypeID !== 1)
            return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_IS_NOT_ADMIN).status(StatusCodeEnum.UNAUTHORIZED).send();

        const [employee] = await userQuery.FindUserById(employeeID);

        if (employee === undefined)
            return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.USER_DOES_NOT_EXIST).status(StatusCodeEnum.BAD_REQUEST).send();

        await userQuery.UpdateEmployeeById(employeeID, employeeObject);

        return res.status(StatusCodeEnum.OK).json({ msg: 'Updated employee successfully' });

    } catch (error) {
        console.error(error);
        return res.setHeader(HeaderEnum.RESPONSE_HEADER, ErrorCodeEnum.SERVER_ERROR).status(StatusCodeEnum.INTERNAL_SERVER_ERROR).send();
    }
};

module.exports = {
    LoginUser,
    LogoutUser,
    ValidateLogin,
    SendResetPasswordEmailHTML,
    ResetPassword,
    CreateEmployee,
    DisplayEmployees,
    DeleteEmployee,
    EditEmployee
}
