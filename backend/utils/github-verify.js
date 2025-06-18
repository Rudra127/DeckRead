import axios from "axios";
import { APIError, STATUS_CODES } from "../utils/app-errors.js";

export async function verifyGitHubToken(token) {
    try {
        const response = await axios.get("https://api.github.com/user", {
            headers: {
                Authorization: `token ${token}`,
                Accept: "application/vnd.github.v3+json"
            }
        });

        if (response.status === 200 && response.data.login) {
            return {
                isValid: true,
                username: response.data.login,
                details: response.data
            };
        }

        return { isValid: false };
    } catch (error) {
        if (error.response && error.response.status === 401) {
            return { isValid: false };
        }
        throw new APIError(
            "GitHub API Error",
            STATUS_CODES.INTERNAL_ERROR,
            "Failed to verify GitHub token",
            false,
            error.stack
        );
    }
}