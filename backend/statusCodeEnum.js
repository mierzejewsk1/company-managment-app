const StatusCodeEnum = Object.freeze({
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
});

const ErrorCodeEnum = Object.freeze({
    INCORRECT_EMAIL: 100,
    ALL_FIELDS_MUST_BE_FILLED: 101,
    INCORRECT_EMAIL_OR_PASSWORD: 102,
    USER_DOES_NOT_EXIST: 103,
    PASSWORDS_DONT_MATCH: 104,
    NO_RESET_PASSWORD_TOKEN: 105,
    PARAM_TYPE_IS_INAPPROPRIATE: 106,
    RESET_TOKEN_EXPIRED: 107,
    WORKSPACE_DOES_NOT_EXIST: 108,
    USER_HAS_NO_TYPE: 109,
    USER_IS_NOT_ADMIN: 110,
    USER_HAS_NO_EMAIL: 111,
    USER_HAS_NO_USERNAME: 112,
    INCORRECT_EMAIL_FORMAT: 113,
    EMAIL_WAS_TAKEN: 114,
    AUTHORIZATION_TOKEN_REQUIRED: 115,
    SESSION_EXPIRED: 116,
    INVALID_TOKEN: 117,
    NO_USER_ID_IN_HEADER: 119,
    NO_AUTHORIZATION_TOKEN_PROVIDED: 120,
    CAN_NOT_ADD_USER_TO_SELECTED_WORKSPACE: 121,
    USER_HAS_ASSIGNED_WORKSPACE: 122,
    WORKSPACE_DOES_NOT_HAVE_WORKER: 123,
    WORKSPACE_IS_ALREADY_UNAVAILABLE: 124,
    WORKSPACE_IS_ALREADY_AVAILABLE: 125,
    SERVER_ERROR: 500,
});

module.exports = { StatusCodeEnum, ErrorCodeEnum }