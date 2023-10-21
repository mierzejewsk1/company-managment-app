const loginFields = [
    'email',
    'password'
];

const sendResetPasswordEmailHTMLFields = [
    'email'
];

const resetPasswordFields = [
    'resetToken',
    'newPassword',
    'newPassword2'
];

const createEmployeeFields = [
    'email',
    'userName',
    'password',
];

const deleteEmployeeFields = [
    'employeeID',
];

const editEmployeeFields = [
    'employeeID',
];

module.exports = {
    loginFields,
    sendResetPasswordEmailHTMLFields,
    resetPasswordFields,
    createEmployeeFields,
    deleteEmployeeFields,
    editEmployeeFields
};