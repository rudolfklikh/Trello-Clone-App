export enum SocketEvents {
    BOARDS_JOIN = 'boards:join',
    BOARDS_LEAVE = 'boards:leave',

    COLUMNS_CREATE = 'columns:create',
    COLUMNS_CREATE_SUCCESS = 'columns:createSuccess',
    COLUMNS_CREATE_FAILURE = 'columns:createFailure',


    TASK_CREATE = 'task:create',
    TASK_CREATE_SUCCESS = 'task:createSuccess',
    TASK_CREATE_FAILURE = 'task:createFailure',
}