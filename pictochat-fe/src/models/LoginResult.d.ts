export default interface LoginResult {
    /**
     * If true, the authentication was successful
     */
    auth: boolean;
    /**
     * If authentication was successfull, an access token is returned
     */
    token: string;
    /**
     * Server response message
     */
    message: string;
}
