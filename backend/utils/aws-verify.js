import { STS } from "@aws-sdk/client-sts";
import { APIError, STATUS_CODES } from "../utils/app-errors.js";

export async function verifyAWSCredentials(accessKeyId, secretAccessKey, region) {
    try {
        const sts = new STS({
            region,
            credentials: {
                accessKeyId,
                secretAccessKey
            }
        });

        const response = await sts.getCallerIdentity({});

        if (response.Arn) {
            return {
                isValid: true,
                accountId: response.Account,
                arn: response.Arn,
                userId: response.UserId
            };
        }

        return { isValid: false };
    } catch (error) {
        if (error.name === "InvalidClientTokenId" ||
            error.name === "SignatureDoesNotMatch" ||
            error.name === "UnrecognizedClientException") {
            return { isValid: false };
        }
        throw new APIError(
            "AWS API Error",
            STATUS_CODES.INTERNAL_ERROR,
            "Failed to verify AWS credentials",
            false,
            error.stack
        );
    }
}