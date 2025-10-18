-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('EMAIL', 'GOOGLE', 'GITHUB', 'MICROSOFT');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER', 'DEVELOPER');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION', 'DELETED');

-- CreateEnum
CREATE TYPE "SubscriptionPlan" AS ENUM ('FREE', 'STARTER', 'PRO', 'TEAM', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'REVOKED');

-- CreateEnum
CREATE TYPE "FailedLoginReason" AS ENUM ('INVALID_CREDENTIALS', 'ACCOUNT_SUSPENDED', 'ACCOUNT_DELETED', 'RATE_LIMITED', 'MFA_REQUIRED', 'MFA_FAILED');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('USER_CREATED', 'USER_UPDATED', 'USER_DELETED', 'LOGIN_SUCCESS', 'LOGIN_FAILED', 'LOGOUT', 'SESSION_CREATED', 'SESSION_REVOKED', 'PASSWORD_CHANGED', 'EMAIL_VERIFIED', 'MFA_ENABLED', 'MFA_DISABLED', 'WORKFLOW_CREATED', 'WORKFLOW_UPDATED', 'WORKFLOW_DELETED', 'WORKFLOW_EXECUTED', 'SITE_DISCOVERED');

-- CreateEnum
CREATE TYPE "AuditResource" AS ENUM ('USER', 'SESSION', 'AUTH', 'WORKFLOW', 'EXECUTION', 'SITE');

-- CreateEnum
CREATE TYPE "WorkflowCategory" AS ENUM ('DATA_EXTRACTION', 'FORM_SUBMISSION', 'MONITORING', 'TESTING', 'INTEGRATION', 'CUSTOM');

-- CreateEnum
CREATE TYPE "WorkflowStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'PAUSED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "RetryPolicy" AS ENUM ('NONE', 'LINEAR', 'EXPONENTIAL');

-- CreateEnum
CREATE TYPE "TriggerType" AS ENUM ('MANUAL', 'SCHEDULE', 'WEBHOOK', 'EVENT');

-- CreateEnum
CREATE TYPE "TriggerSource" AS ENUM ('MANUAL', 'SCHEDULED', 'WEBHOOK', 'API', 'SYSTEM');

-- CreateEnum
CREATE TYPE "ExecutionStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED', 'TIMEOUT');

-- CreateEnum
CREATE TYPE "JobPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "StepType" AS ENUM ('NAVIGATE', 'CLICK', 'FILL_FORM', 'EXTRACT', 'WAIT', 'CONDITION', 'API_CALL', 'SCRIPT');

-- CreateEnum
CREATE TYPE "StepStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'SKIPPED');

-- CreateEnum
CREATE TYPE "SiteCategory" AS ENUM ('E_COMMERCE', 'SOCIAL_MEDIA', 'PRODUCTIVITY', 'FINANCE', 'EDUCATION', 'HEALTHCARE', 'GOVERNMENT', 'ENTERTAINMENT', 'NEWS', 'OTHER');

-- CreateEnum
CREATE TYPE "SchemaStatus" AS ENUM ('DISCOVERED', 'VALIDATED', 'STALE', 'FAILED');

-- CreateEnum
CREATE TYPE "ApiKeyStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'REVOKED');

-- CreateEnum
CREATE TYPE "ApiScope" AS ENUM ('WORKFLOWS_READ', 'WORKFLOWS_WRITE', 'WORKFLOWS_DELETE', 'EXECUTIONS_READ', 'EXECUTIONS_WRITE', 'SITES_READ', 'SITES_WRITE', 'ADMIN');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "imageUrl" TEXT,
    "provider" "AuthProvider" NOT NULL DEFAULT 'EMAIL',
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "plan" "SubscriptionPlan" NOT NULL DEFAULT 'FREE',
    "planEndsAt" TIMESTAMP(3),
    "mfaEnabled" BOOLEAN NOT NULL DEFAULT false,
    "mfaSecret" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerifiedAt" TIMESTAMP(3),
    "lastLoginAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLoginIp" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "clerkSessionId" TEXT NOT NULL,
    "device" TEXT,
    "browser" TEXT,
    "os" TEXT,
    "ipAddress" TEXT,
    "country" TEXT,
    "city" TEXT,
    "userAgent" TEXT,
    "status" "SessionStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "failed_logins" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "email" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "userAgent" TEXT,
    "reason" "FailedLoginReason" NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "failed_logins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" "AuditAction" NOT NULL,
    "resource" "AuditResource" NOT NULL,
    "resourceId" TEXT,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflows" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "nodes" JSONB NOT NULL,
    "edges" JSONB NOT NULL,
    "variables" JSONB,
    "version" INTEGER NOT NULL DEFAULT 1,
    "category" "WorkflowCategory",
    "tags" TEXT[],
    "schedule" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "isScheduled" BOOLEAN NOT NULL DEFAULT false,
    "timeout" INTEGER NOT NULL DEFAULT 300,
    "retryPolicy" "RetryPolicy" NOT NULL DEFAULT 'EXPONENTIAL',
    "maxRetries" INTEGER NOT NULL DEFAULT 3,
    "status" "WorkflowStatus" NOT NULL DEFAULT 'DRAFT',
    "totalRuns" INTEGER NOT NULL DEFAULT 0,
    "successRuns" INTEGER NOT NULL DEFAULT 0,
    "failedRuns" INTEGER NOT NULL DEFAULT 0,
    "lastRunAt" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workflows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflow_triggers" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "type" "TriggerType" NOT NULL,
    "config" JSONB NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workflow_triggers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "executions" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "executionNumber" INTEGER NOT NULL,
    "triggeredBy" "TriggerSource" NOT NULL,
    "triggerMetadata" JSONB,
    "status" "ExecutionStatus" NOT NULL DEFAULT 'PENDING',
    "priority" "JobPriority" NOT NULL DEFAULT 'NORMAL',
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "duration" INTEGER,
    "output" JSONB,
    "logs" JSONB NOT NULL DEFAULT '[]',
    "screenshots" TEXT[],
    "error" TEXT,
    "errorStack" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "pageLoads" INTEGER NOT NULL DEFAULT 0,
    "apiCalls" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "executions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "execution_steps" (
    "id" TEXT NOT NULL,
    "executionId" TEXT NOT NULL,
    "stepId" TEXT NOT NULL,
    "stepType" "StepType" NOT NULL,
    "stepName" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL,
    "status" "StepStatus" NOT NULL DEFAULT 'PENDING',
    "input" JSONB,
    "output" JSONB,
    "error" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "duration" INTEGER,
    "retryCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "execution_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discovered_sites" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "title" TEXT,
    "schemaVersion" INTEGER NOT NULL DEFAULT 1,
    "htmlSnapshot" TEXT,
    "screenshot" TEXT,
    "elements" JSONB NOT NULL,
    "navigation" JSONB NOT NULL,
    "auth" JSONB,
    "apis" JSONB,
    "category" "SiteCategory",
    "tags" TEXT[],
    "status" "SchemaStatus" NOT NULL DEFAULT 'DISCOVERED',
    "lastScanned" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "discovered_sites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_keys" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "keyHash" TEXT NOT NULL,
    "keyPrefix" TEXT NOT NULL,
    "scopes" "ApiScope"[],
    "rateLimit" INTEGER NOT NULL DEFAULT 1000,
    "lastUsed" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),
    "status" "ApiKeyStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_clerkId_key" ON "users"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE INDEX "users_clerkId_idx" ON "users"("clerkId");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_username_idx" ON "users"("username");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "users"("status");

-- CreateIndex
CREATE INDEX "users_deletedAt_idx" ON "users"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_clerkSessionId_key" ON "sessions"("clerkSessionId");

-- CreateIndex
CREATE INDEX "sessions_userId_idx" ON "sessions"("userId");

-- CreateIndex
CREATE INDEX "sessions_clerkSessionId_idx" ON "sessions"("clerkSessionId");

-- CreateIndex
CREATE INDEX "sessions_status_idx" ON "sessions"("status");

-- CreateIndex
CREATE INDEX "sessions_expiresAt_idx" ON "sessions"("expiresAt");

-- CreateIndex
CREATE INDEX "failed_logins_email_idx" ON "failed_logins"("email");

-- CreateIndex
CREATE INDEX "failed_logins_ipAddress_idx" ON "failed_logins"("ipAddress");

-- CreateIndex
CREATE INDEX "failed_logins_createdAt_idx" ON "failed_logins"("createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_resource_idx" ON "audit_logs"("resource");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- CreateIndex
CREATE INDEX "workflows_userId_idx" ON "workflows"("userId");

-- CreateIndex
CREATE INDEX "workflows_status_idx" ON "workflows"("status");

-- CreateIndex
CREATE INDEX "workflows_category_idx" ON "workflows"("category");

-- CreateIndex
CREATE INDEX "workflows_isScheduled_idx" ON "workflows"("isScheduled");

-- CreateIndex
CREATE INDEX "workflows_createdAt_idx" ON "workflows"("createdAt");

-- CreateIndex
CREATE INDEX "workflow_triggers_workflowId_idx" ON "workflow_triggers"("workflowId");

-- CreateIndex
CREATE INDEX "workflow_triggers_type_idx" ON "workflow_triggers"("type");

-- CreateIndex
CREATE INDEX "workflow_triggers_enabled_idx" ON "workflow_triggers"("enabled");

-- CreateIndex
CREATE INDEX "executions_workflowId_idx" ON "executions"("workflowId");

-- CreateIndex
CREATE INDEX "executions_userId_idx" ON "executions"("userId");

-- CreateIndex
CREATE INDEX "executions_status_idx" ON "executions"("status");

-- CreateIndex
CREATE INDEX "executions_triggeredBy_idx" ON "executions"("triggeredBy");

-- CreateIndex
CREATE INDEX "executions_createdAt_idx" ON "executions"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "executions_workflowId_executionNumber_key" ON "executions"("workflowId", "executionNumber");

-- CreateIndex
CREATE INDEX "execution_steps_executionId_idx" ON "execution_steps"("executionId");

-- CreateIndex
CREATE INDEX "execution_steps_status_idx" ON "execution_steps"("status");

-- CreateIndex
CREATE INDEX "discovered_sites_userId_idx" ON "discovered_sites"("userId");

-- CreateIndex
CREATE INDEX "discovered_sites_domain_idx" ON "discovered_sites"("domain");

-- CreateIndex
CREATE INDEX "discovered_sites_status_idx" ON "discovered_sites"("status");

-- CreateIndex
CREATE INDEX "discovered_sites_lastScanned_idx" ON "discovered_sites"("lastScanned");

-- CreateIndex
CREATE UNIQUE INDEX "discovered_sites_userId_url_schemaVersion_key" ON "discovered_sites"("userId", "url", "schemaVersion");

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_keyHash_key" ON "api_keys"("keyHash");

-- CreateIndex
CREATE INDEX "api_keys_userId_idx" ON "api_keys"("userId");

-- CreateIndex
CREATE INDEX "api_keys_keyHash_idx" ON "api_keys"("keyHash");

-- CreateIndex
CREATE INDEX "api_keys_status_idx" ON "api_keys"("status");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "failed_logins" ADD CONSTRAINT "failed_logins_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflows" ADD CONSTRAINT "workflows_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_triggers" ADD CONSTRAINT "workflow_triggers_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "workflows"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "executions" ADD CONSTRAINT "executions_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "workflows"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "executions" ADD CONSTRAINT "executions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "execution_steps" ADD CONSTRAINT "execution_steps_executionId_fkey" FOREIGN KEY ("executionId") REFERENCES "executions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discovered_sites" ADD CONSTRAINT "discovered_sites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
