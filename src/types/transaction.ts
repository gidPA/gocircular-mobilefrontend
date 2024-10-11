export enum TransactionProgressState{
    Inactive = 0,
    Approved = 1,
    Completed = 50,
    BinFullError = 125,
    CoinEmptyError = 126,
    BusyError = 127,
    TimeoutError = 400,
}