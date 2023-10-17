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

const deleteEmployeesFields = [
    'employeeIDs',
];

const editEmployeeFields = [
    'employeeID',
];

module.exports = {
    loginFields,
    sendResetPasswordEmailHTMLFields,
    resetPasswordFields,
    createEmployeeFields,
    deleteEmployeesFields,
    editEmployeeFields
};