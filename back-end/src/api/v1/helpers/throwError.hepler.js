function checkStatusName(statusCode) {
    switch (statusCode) {
        case 400:
            return 'Bad Request'
            break
        case 401:
            return 'Unauthorized'
            break
        case 402:
            return 'Payment Required'
            break
        case 403:
            return 'Forbidden'
            break
        case 404:
            return 'Not Found'
            break
        case 405:
            return 'Method Not Allowed'
            break
        case 406:
            return 'Not Acceptable'
            break
        case 407:
            return 'Proxy Authentication Required'
            break
        case 408:
            return 'Request Timeout'
            break
        case 409:
            return 'Conflict'
            break
        case 410:
            return 'Gone'
            break
        case 411:
            return 'Length Required'
            break
        case 412:
            return 'Precondition Failed'
            break
        case 413:
            return 'Payload TooLarge'
            break
        case 414:
            return 'URI Too Long'
            break
        case 415:
            return 'Unsupported Media Type'
            break
        case 416:
            return 'Range Not Satisfiable'
            break
        case 417:
            return 'Expectation Failed'
            break
        case 418:
            return 'Im A Teapot'
            break
        case 421:
            return 'Misdirected Request'
            break
        case 422:
            return 'Unprocessable Entity'
            break
        case 423:
            return 'Locked'
            break
        case 424:
            return 'Failed Dependency'
            break
        case 425:
            return 'Too Early'
            break
        case 426:
            return 'Upgrade Required'
            break
        case 428:
            return 'Precondition Required'
            break
        case 429:
            return 'Too Many Requests'
            break
        case 431:
            return 'Request Header Fields Too Large'
            break
        case 451:
            return 'Unavailable For Legal Reasons'
            break
        case 500:
            return 'Internal Server Error'
            break
        case 501:
            return 'Not Implemented'
            break
        case 502:
            return 'Bad Gateway'
            break
        case 503:
            return 'Service Unavailable'
            break
        case 504:
            return 'Gateway Timeout'
            break
        case 505:
            return 'HTTP Version Not Supported'
            break
        case 506:
            return 'Variant Also Negotiates'
            break
        case 507:
            return 'Insufficient Storage'
            break
        case 508:
            return 'Loop Detected'
            break
        case 509:
            return 'Bandwidth Limit Exceeded'
            break
        case 510:
            return 'Not Extended'
            break
        case 511:
            return 'Network Authentication Required'
        default:
            'Not Error'
    }
}

function throwError(
    statusCode,
    msg = `${statusCode} - ${checkStatusName(statusCode)}`,
    res,
    err = null,
) {
    if (err != null) {
        return console.error(err.stack)
    }
    return res
        .type('json')
        .status(statusCode)
        .send({
            error: checkStatusName(statusCode),
            message: msg,
            statusCode: statusCode,
        })
}

module.exports = throwError
