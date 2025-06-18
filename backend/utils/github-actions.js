import axios from "axios";
import { APIError, STATUS_CODES } from "./app-errors.js";

export class GitHubActionsManager {
    constructor(patToken, repoOwner, repoName) {
        this.patToken = process.env.githubPatTokenTesting1;
        this.repoOwner = repoOwner;
        this.repoName = repoName;
        this.apiBaseUrl = `https://api.github.com/repos/${repoOwner}/${repoName}`;

        this.axios = axios.create({
            baseURL: this.apiBaseUrl,
            headers: {
                Authorization: `token ${process.env.githubPatTokenTesting1}`,
                Accept: "application/vnd.github.v3+json",
                "Content-Type": "application/json"
            }
        });
    }

    async createWorkflow(workflowName, workflowContent) {
        try {
            const response = await this.axios.put(
                `/contents/.github/workflows/${workflowName}.yml`,
                {
                    message: `Add ${workflowName} workflow`,
                    content: Buffer.from(workflowContent).toString("base64"),
                    branch: "main"
                }
            );

            return response.data;
        } catch (error) {
            if (error.response) {
                throw new APIError(
                    "GitHub API Error",
                    error.response.status,
                    error.response.data.message,
                    true,
                    error.stack
                );
            }
            throw new APIError(
                "GitHub API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Failed to create workflow",
                false,
                error.stack
            );
        }
    }

    async createSelfHostedRunner(token, runnerName, labels = []) {
        try {
            // Step 1: Create runner registration token
            const tokenResponse = await this.axios.post(
                `/actions/runners/registration-token`
            );
            const registrationToken = tokenResponse.data.token;

            // Step 2: Return the commands to setup the runner
            const setupCommands = [
                `# Create a runner`,
                `mkdir -p ~/actions-runner && cd ~/actions-runner`,
                `# Download the latest runner package`,
                `curl -o actions-runner-linux-x64-2.311.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-linux-x64-2.311.0.tar.gz`,
                `# Extract the installer`,
                `tar xzf ./actions-runner-linux-x64-2.311.0.tar.gz`,
                `# Configure the runner`,
                `./config.sh --url https://github.com/${this.repoOwner}/${this.repoName} --token ${registrationToken} --name "${runnerName}" --labels "${labels.join(',')}" --unattended`,
                `# Install service and start`,
                `sudo ./svc.sh install`,
                `sudo ./svc.sh start`
            ];

            return {
                registrationToken,
                setupCommands: setupCommands.join('\n')
            };
        } catch (error) {
            if (error.response) {
                throw new APIError(
                    "GitHub API Error",
                    error.response.status,
                    error.response.data.message,
                    true,
                    error.stack
                );
            }
            throw new APIError(
                "GitHub API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Failed to create self-hosted runner",
                false,
                error.stack
            );
        }
    }


    static getWorkflowTemplate(projectType, projectName) {
        const baseTemplate = {
            on: {
                push: {
                    branches: ["main"],
                    paths: ["*"]
                },
                pull_request: {
                    branches: ["main"],
                    paths: ["*"]
                },
                workflow_dispatch: {}
            },
            jobs: {
                build: {
                    "runs-on": "self-hosted",
                    steps: []
                }
            }
        };

        const commonSteps = [
            {
                name: "Checkout repository",
                uses: "actions/checkout@v4"
            },
            {
                name: "Use Node.js 20.x",
                uses: "actions/setup-node@v4",
                with: {
                    "node-version": "20.x"
                }
            },
            {
                name: "Cache node_modules",
                id: "cache-node-modules",
                uses: "actions/cache@v3",
                with: {
                    path: "node_modules",
                    key: "${{ runner.os }}-node-modules-${{ hashFiles('package-lock.json') }}",
                    "restore-keys": "|\n${{ runner.os }}-node-modules-"
                }
            },
            {
                name: "Install dependencies",
                run: "npm install"
            }
        ];

        // Node.js Backend Specific Steps
        const backendSteps = [
            ...commonSteps,
            {
                name: "Run tests (if exists)",
                run: "npm test || echo 'No test script found'"
            },
            {
                name: `Restart ${projectName} via PM2`,
                run: `pm2 restart ${projectName} || pm2 start npm --name "${projectName}" -- start`
            }
        ];

        // React/Next.js Frontend Specific Steps
        const frontendSteps = [
            ...commonSteps,
            {
                name: "Build project",
                run: "npm run build"
            },
            {
                name: "Export static files (for Next.js)",
                run: "npm run export || echo 'No export script found'"
            },
            {
                name: "Serve with PM2",
                run: `pm2 restart ${projectName} || pm2 serve build 3000 --name "${projectName}" --spa`
            }
        ];

        if (projectType === 'backend') {
            return {
                ...baseTemplate,
                name: `${projectName} Backend CI/CD`,
                jobs: {
                    build: {
                        ...baseTemplate.jobs.build,
                        steps: backendSteps
                    }
                }
            };
        } else if (projectType === 'frontend') {
            return {
                ...baseTemplate,
                name: `${projectName} Frontend CI/CD`,
                jobs: {
                    build: {
                        ...baseTemplate.jobs.build,
                        steps: frontendSteps
                    }
                }
            };
        }

        // Default template for unknown project types
        return {
            ...baseTemplate,
            name: `${projectName} CI/CD`,
            jobs: {
                build: {
                    ...baseTemplate.jobs.build,
                    steps: [
                        ...commonSteps,
                        {
                            name: "Build project (if exists)",
                            run: "npm run build || echo 'No build script found'"
                        }
                    ]
                }
            }
        };
    }

    async detectProjectType(userProvidedType) {
        try {
            // If user explicitly provided a type, use that
            if (userProvidedType && ['backend', 'frontend'].includes(userProvidedType.toLowerCase())) {
                return userProvidedType.toLowerCase();
            }

            // Otherwise try to auto-detect
            const { data: packageJson } = await this.axios.get(
                `/contents/package.json`
            );
            const content = JSON.parse(
                Buffer.from(packageJson.content, 'base64').toString()
            );

            if (content.scripts?.build) {
                if (content.dependencies?.next || content.dependencies?.react) {
                    return 'frontend';
                }
                return 'backend';
            }

            return 'unknown';
        } catch (error) {
            return 'unknown';
        }
    }


}