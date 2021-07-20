export type Provider = {
    email: string;
    userID: string;
    online: boolean;
};

export type Message = {
    sender: string;
    senderType: string;
    timestamp: string;
    message: string;
};
