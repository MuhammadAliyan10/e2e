import type { Node, Edge, MarkerType } from "reactflow";
import { z } from "zod";

export const ExecutionState = z.enum([
  "idle",
  "running",
  "success",
  "error",
  "warning",
]);
export type ExecutionState = z.infer<typeof ExecutionState>;

export const NodeHandleSchema = z.object({
  id: z.string(),
  type: z.enum(["source", "target"]),
  position: z.enum(["top", "right", "bottom", "left"]),
  connected: z.boolean().default(false),
  dataType: z.string().optional(),
  label: z.string().optional(),
  required: z.boolean().default(false),
  multiple: z.boolean().default(false),
});

export type NodeHandle = z.infer<typeof NodeHandleSchema>;

export const OnClickTriggerDataSchema = z.object({
  id: z.string(),
  type: z.literal("trigger"),
  label: z.string().default("OnClick Trigger"),
  description: z.string().optional(),
  enabled: z.boolean().default(true),
  executionState: ExecutionState.default("idle"),
  errors: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
  lastExecutedAt: z.string().datetime().nullable().default(null),
  executionCount: z.number().default(0),
  metadata: z.record(z.string(), z.any()).default({}),
  version: z.number().default(1),

  // Execution control
  debounceMs: z.number().min(0).max(10000).default(500),
  rateLimitPerMinute: z.number().min(1).max(1000).nullable().default(null),
  maxExecutions: z.number().min(1).nullable().default(null),
  executeOnlyWhenEnabled: z.boolean().default(true),

  // Payload configuration
  customPayload: z.record(z.string(), z.any()).default({}),
  outputSchema: z.record(z.string(), z.any()).optional(),

  // Advanced options
  waitForCompletion: z.boolean().default(false),
  timeoutMs: z.number().min(1000).max(300000).default(30000),
  logExecutions: z.boolean().default(true),
  retryCount: z.number().min(0).max(5).default(0),
  retryDelayMs: z.number().min(100).max(60000).default(1000),

  // UI state
  lastClickAt: z.string().datetime().nullable().default(null),
  clickCount: z.number().default(0),

  // UI callbacks (injected at runtime)
  onTrigger: z.function().optional(),
  onUpdate: z.function().optional(),
  onDelete: z.function().optional(),
  onConfigure: z.function().optional(),
  onAddNode: z.function().optional(),
});

export type OnClickTriggerData = z.infer<typeof OnClickTriggerDataSchema>;

// Enhanced OnClick Node Data (backward compatible)
export type OnClickNodeData = {
  label?: string;
  description?: string;
  debounceMs?: number;
  rateLimitPerMinute?: number | null;
  enabled?: boolean;
  executionState?: "idle" | "running" | "success" | "error" | "warning";
  errors?: string[];
  warnings?: string[];
  lastExecutedAt?: string;
  executionCount?: number;
  clickCount?: number;
  lastClickAt?: string;
  customPayload?: Record<string, any>;
  maxExecutions?: number | null;
  executeOnlyWhenEnabled?: boolean;
  logExecutions?: boolean;
  waitForCompletion?: boolean;
  timeoutMs?: number;
  retryCount?: number;
  retryDelayMs?: number;
  metadata?: Record<string, any>;
  version?: number;

  // UI integration hooks (parent/demo provides these)
  onTrigger?: (payload: {
    nodeId: string;
    nodeLabel: string;
    executionId: string;
    timestamp: string;
    data: Record<string, any>;
    metadata?: Record<string, any> | null;
  }) => Promise<void> | void;

  // setData is how the node asks the parent to persist new config (UI-only, updates JSON)
  setData?: (partial: Partial<OnClickNodeData>) => void;
  onUpdate?: (partial: Partial<OnClickNodeData>) => void;
  onDelete?: () => void;
  onConfigure?: () => void;
  onAddNode?: (sourceNodeId: string, sourceHandleId: string) => void;
};

// Node execution payload
export const NodeExecutionPayloadSchema = z.object({
  nodeId: z.string(),
  nodeType: z.string(),
  timestamp: z.string().datetime(),
  executionId: z.string(),
  data: z.record(z.string(), z.any()),
  metadata: z.record(z.string(), z.any()).optional(),
  parentExecutionId: z.string().optional(),
  traceId: z.string().optional(),
});

export type NodeExecutionPayload = z.infer<typeof NodeExecutionPayloadSchema>;

// Node execution result
export const NodeExecutionResultSchema = z.object({
  nodeId: z.string(),
  executionId: z.string(),
  status: ExecutionState,
  data: z.record(z.string(), z.any()).optional(),
  errors: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
  executedAt: z.string().datetime(),
  durationMs: z.number(),
  outputData: z.record(z.string(), z.any()).optional(),
  nextNodes: z.array(z.string()).default([]),
});

export type NodeExecutionResult = z.infer<typeof NodeExecutionResultSchema>;

// Workflow execution context
export interface WorkflowExecutionContext {
  workflowId: string;
  executionId: string;
  userId: string;
  variables: Record<string, any>;
  metadata: Record<string, any>;
  startedAt: string;
  timeoutAt?: string;
}

// Enhanced workflow node with handles
export interface EnhancedWorkflowNode<T = BaseNodeData> extends Node {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: T;
  handles: NodeHandle[];
  selected?: boolean;
  dragging?: boolean;
}

export type OnClickTriggerNode = EnhancedWorkflowNode<OnClickTriggerData>;

// ============ BASE TYPES ============
export interface NodeOutput {
  data: any;
  metadata?: {
    timestamp: string;
    duration?: number;
    success: boolean;
  };
}

export interface BaseNodeData {
  label: string;
  description?: string;
  enabled?: boolean;
  executionState?: "idle" | "running" | "success" | "error";
  outputSchema?: Record<string, any>;
  errors?: string[];
  outputs?: NodeOutput;
}

// ============ AI AGENT NODE ============
export interface AIAgentNodeData extends BaseNodeData {
  prompt: string;
  context?: string;
  model?: "gpt-4" | "gpt-3.5-turbo" | "claude-3" | "gemini-pro";
  maxSteps?: number;
  outputFormat?: "structured" | "text" | "json";
  url?: string;
  memory?: {
    enabled: boolean;
    type?: "vector" | "postgres" | "redis";
    connectionString?: string;
  };
  tools?: Array<{
    id: string;
    name: string;
    description?: string;
    icon?: string;
    enabled: boolean;
  }>;
}

export interface AIAgentExecutionResult {
  success: boolean;
  executionTime: number;
  steps: Array<{
    step: number;
    action: string;
    target: string;
    result: "success" | "failed";
    screenshot?: string;
    error?: string;
  }>;
  result: {
    data: any;
    metadata: {
      itemsFound?: number;
      timestamp: string;
    };
  };
  error: string | null;
}

// ============ 1. WEB AUTOMATION NODES ============

// Web Interaction
export interface OpenURLNodeData extends BaseNodeData {
  url: string;
  waitForSelector?: string;
  timeout?: number;
  userAgent?: string;
  warnings?: string;
  referer?: string;
  waitForNavigation?: boolean;
  viewport?: { width: number; height: number };
}

export interface ClickElementNodeData extends BaseNodeData {
  selector: string;
  selectorType: "css" | "xpath" | "text";
  clickType: "single" | "double" | "right";
  waitAfterClick?: number;
  retryCount?: number;
  timeout?: number;
  forceClick?: boolean;
}

export interface FillInputNodeData extends BaseNodeData {
  selector: string;
  value: string;
  clearFirst?: boolean;
  pressEnter?: boolean;
  delay?: number;
  validateInput?: boolean;
}

export interface SelectDropdownNodeData extends BaseNodeData {
  selector: string;
  value: string;
  selectBy: "value" | "label" | "index";
  waitForOptions?: boolean;
}

export interface UploadFileNodeData extends BaseNodeData {
  selector: string;
  filePath: string;
  fileSource: "local" | "url" | "base64";
  mimeType?: string;
  waitForUpload?: boolean;
}

export interface DownloadFileNodeData extends BaseNodeData {
  selector?: string;
  url?: string;
  savePath: string;
  filename?: string;
  overwrite?: boolean;
  waitForDownload?: boolean;
  timeout?: number;
}

export interface WaitForElementNodeData extends BaseNodeData {
  selector: string;
  state?: "visible" | "hidden" | "attached" | "detached";
  timeout?: number;
  throwOnTimeout?: boolean;
}

export interface ExtractTextNodeData extends BaseNodeData {
  selector: string;
  attribute?: "text" | "innerText" | "innerHTML";
  multiple?: boolean;
  trim?: boolean;
  regex?: string;
}

export interface ExtractAttributeNodeData extends BaseNodeData {
  selector: string;
  attribute: string;
  multiple?: boolean;
  fallback?: string;
}

export interface TakeScreenshotNodeData extends BaseNodeData {
  fullPage?: boolean;
  selector?: string;
  format?: "png" | "jpeg";
  quality?: number;
  savePath?: string;
  base64?: boolean;
}

export interface ScrollToElementNodeData extends BaseNodeData {
  selector?: string;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
  behavior?: "auto" | "smooth";
}

export interface GoBackNodeData extends BaseNodeData {
  waitForNavigation?: boolean;
  timeout?: number;
}

export interface GoForwardNodeData extends BaseNodeData {
  waitForNavigation?: boolean;
  timeout?: number;
}

export interface SwitchTabNodeData extends BaseNodeData {
  tabIndex?: number;
  tabUrl?: string;
  createIfNotExists?: boolean;
}

export interface CloseTabNodeData extends BaseNodeData {
  tabIndex?: number;
  closeAll?: boolean;
}

// Web Authentication
export interface LoginViaFormNodeData extends BaseNodeData {
  usernameSelector: string;
  passwordSelector: string;
  submitSelector: string;
  username: string;
  password: string;
  waitForSelector?: string;
  saveCookies?: boolean;
}

export interface LoginViaOAuthNodeData extends BaseNodeData {
  provider: "google" | "facebook" | "github" | "microsoft" | "apple";
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope?: string[];
}

export interface HandleCaptchaNodeData extends BaseNodeData {
  captchaType: "recaptcha_v2" | "recaptcha_v3" | "hcaptcha" | "image";
  siteKey?: string;
  solverService?: "2captcha" | "anticaptcha" | "manual";
  apiKey?: string;
  timeout?: number;
}

export interface CookieSaveNodeData extends BaseNodeData {
  savePath: string;
  cookieName?: string;
  domain?: string;
}

export interface CookieLoadNodeData extends BaseNodeData {
  loadPath: string;
  domain?: string;
}

export interface SessionRestoreNodeData extends BaseNodeData {
  sessionPath: string;
  includeLocalStorage?: boolean;
}

export interface LogoutNodeData extends BaseNodeData {
  logoutSelector?: string;
  clearCookies?: boolean;
  clearLocalStorage?: boolean;
}

// Website Data Extraction
export interface ScrapeTableNodeData extends BaseNodeData {
  tableSelector: string;
  includeHeaders?: boolean;
  rowSelector?: string;
  cellSelector?: string;
  outputFormat?: "array" | "json" | "csv";
}

export interface ScrapeListNodeData extends BaseNodeData {
  listSelector: string;
  itemSelector: string;
  extractFields: Array<{
    key: string;
    selector: string;
    attribute?: string;
  }>;
}

export interface ExtractJSONFromHTMLNodeData extends BaseNodeData {
  scriptSelector?: string;
  jsonPath?: string;
  validateSchema?: boolean;
}

export interface ExtractMetadataNodeData extends BaseNodeData {
  fields: Array<
    "title" | "description" | "keywords" | "author" | "og:image" | "canonical"
  >;
}

export interface ParseDOMTreeNodeData extends BaseNodeData {
  rootSelector?: string;
  depth?: number;
  includeAttributes?: boolean;
}

export interface WebSearchNodeData extends BaseNodeData {
  searchEngine: "google" | "bing" | "duckduckgo";
  query: string;
  resultCount?: number;
  language?: string;
  region?: string;
}

export interface RSSFeedReaderNodeData extends BaseNodeData {
  feedUrl: string;
  itemCount?: number;
  parseContent?: boolean;
}

// Web Control / Navigation
export interface DetectURLRedirectNodeData extends BaseNodeData {
  followRedirects?: boolean;
  maxRedirects?: number;
  captureRedirectChain?: boolean;
}

export interface HandlePopupNodeData extends BaseNodeData {
  action: "accept" | "dismiss" | "interact";
  waitForPopup?: boolean;
  popupSelector?: string;
}

export interface HandleIFrameNodeData extends BaseNodeData {
  iframeSelector: string;
  action: "enter" | "exit";
  waitForLoad?: boolean;
}

export interface DetectAndClickButtonNodeData extends BaseNodeData {
  buttonText?: string;
  buttonRole?: string;
  fallbackSelector?: string;
  fuzzyMatch?: boolean;
}

export interface ScrollInfinitePageNodeData extends BaseNodeData {
  maxScrolls?: number;
  scrollDelay?: number;
  scrollSelector?: string;
  stopCondition?: string;
}

export interface DetectFileDownloadLinkNodeData extends BaseNodeData {
  linkSelector?: string;
  fileExtensions?: string[];
  downloadOnDetect?: boolean;
}

// ============ 2. APP INTEGRATION NODES ============

// Communication
export interface GmailNodeData extends BaseNodeData {
  action: "send" | "read" | "search" | "delete";
  to?: string;
  subject?: string;
  body?: string;
  from?: string;
  query?: string;
  maxResults?: number;
  attachments?: string[];
}

export interface OutlookNodeData extends BaseNodeData {
  action: "send" | "read" | "calendar" | "delete";
  to?: string;
  subject?: string;
  body?: string;
  startDate?: string;
  endDate?: string;
}

export interface SlackNodeData extends BaseNodeData {
  action: "send" | "read" | "upload" | "react";
  channel: string;
  message?: string;
  threadTs?: string;
  fileUrl?: string;
}

export interface DiscordNodeData extends BaseNodeData {
  action: "send" | "read" | "embed";
  channelId: string;
  message?: string;
  embed?: {
    title?: string;
    description?: string;
    color?: string;
    fields?: Array<{ name: string; value: string }>;
  };
}

export interface TelegramNodeData extends BaseNodeData {
  action: "send" | "read" | "sendPhoto";
  chatId: string;
  message?: string;
  photoUrl?: string;
  parseMode?: "Markdown" | "HTML";
}

export interface WhatsAppBusinessNodeData extends BaseNodeData {
  action: "send" | "sendTemplate" | "read";
  to: string;
  message?: string;
  templateName?: string;
  templateParams?: string[];
}

export interface TwilioSMSNodeData extends BaseNodeData {
  action: "send" | "receive";
  to?: string;
  from: string;
  body?: string;
  mediaUrl?: string;
}

// Social Media
export interface TwitterNodeData extends BaseNodeData {
  action: "tweet" | "reply" | "retweet" | "like" | "follow" | "search";
  text?: string;
  tweetId?: string;
  username?: string;
  query?: string;
  mediaUrls?: string[];
}

export interface InstagramNodeData extends BaseNodeData {
  action: "post" | "story" | "comment" | "like" | "follow";
  imageUrl?: string;
  caption?: string;
  postId?: string;
  comment?: string;
}

export interface FacebookNodeData extends BaseNodeData {
  action: "post" | "comment" | "like" | "share" | "message";
  pageId?: string;
  message?: string;
  link?: string;
  postId?: string;
}

export interface LinkedInNodeData extends BaseNodeData {
  action: "post" | "comment" | "message" | "connect";
  text?: string;
  postId?: string;
  userId?: string;
  connectionMessage?: string;
}

export interface YouTubeNodeData extends BaseNodeData {
  action: "upload" | "comment" | "like" | "subscribe" | "playlist";
  videoFile?: string;
  title?: string;
  description?: string;
  videoId?: string;
  playlistId?: string;
}

export interface TikTokNodeData extends BaseNodeData {
  action: "upload" | "like" | "comment" | "analytics";
  videoFile?: string;
  caption?: string;
  videoId?: string;
}

// Productivity
export interface GoogleDriveNodeData extends BaseNodeData {
  action: "upload" | "download" | "delete" | "list" | "share";
  fileId?: string;
  fileName?: string;
  filePath?: string;
  folderId?: string;
  shareWith?: string;
  permission?: "view" | "edit" | "comment";
}

export interface GoogleSheetsNodeData extends BaseNodeData {
  action: "read" | "write" | "append" | "clear" | "create";
  spreadsheetId: string;
  sheetName?: string;
  range?: string;
  values?: any[][];
}

export interface NotionNodeData extends BaseNodeData {
  action: "createPage" | "updatePage" | "query" | "createDatabase";
  databaseId?: string;
  pageId?: string;
  properties?: Record<string, any>;
  filter?: Record<string, any>;
}

export interface AirtableNodeData extends BaseNodeData {
  action: "create" | "read" | "update" | "delete" | "list";
  baseId: string;
  tableName: string;
  recordId?: string;
  fields?: Record<string, any>;
  filterByFormula?: string;
}

export interface TrelloNodeData extends BaseNodeData {
  action: "createCard" | "moveCard" | "updateCard" | "deleteCard" | "listCards";
  boardId?: string;
  listId?: string;
  cardId?: string;
  cardName?: string;
  description?: string;
  position?: number;
}

export interface AsanaNodeData extends BaseNodeData {
  action: "createTask" | "updateTask" | "deleteTask" | "listTasks";
  projectId?: string;
  taskId?: string;
  taskName?: string;
  assignee?: string;
  dueDate?: string;
}

export interface ClickUpNodeData extends BaseNodeData {
  action: "createTask" | "updateTask" | "deleteTask" | "listTasks";
  listId?: string;
  taskId?: string;
  taskName?: string;
  status?: string;
  priority?: number;
}

export interface CalendarNodeData extends BaseNodeData {
  action: "create" | "update" | "delete" | "list";
  provider: "google" | "outlook" | "ical";
  eventId?: string;
  summary?: string;
  startTime?: string;
  endTime?: string;
  attendees?: string[];
}

// File Management
export interface DropboxNodeData extends BaseNodeData {
  action: "upload" | "download" | "delete" | "list" | "share";
  path: string;
  filePath?: string;
  recursive?: boolean;
}

export interface OneDriveNodeData extends BaseNodeData {
  action: "upload" | "download" | "delete" | "list" | "share";
  path: string;
  filePath?: string;
}

export interface AWSS3NodeData extends BaseNodeData {
  action: "upload" | "download" | "delete" | "list" | "copy";
  bucket: string;
  key: string;
  filePath?: string;
  acl?: "private" | "public-read" | "public-read-write";
}

export interface FTPSFTPNodeData extends BaseNodeData {
  action: "upload" | "download" | "delete" | "list";
  protocol: "ftp" | "sftp";
  host: string;
  port: number;
  username: string;
  password?: string;
  privateKey?: string;
  remotePath: string;
  localPath?: string;
}

// Developer Tools
export interface GitHubNodeData extends BaseNodeData {
  action: "createRepo" | "createIssue" | "createPR" | "listRepos" | "commit";
  owner: string;
  repo?: string;
  title?: string;
  body?: string;
  branch?: string;
  baseBranch?: string;
}

export interface GitLabNodeData extends BaseNodeData {
  action: "createProject" | "createIssue" | "createMR" | "triggerPipeline";
  projectId?: string;
  title?: string;
  description?: string;
  sourceBranch?: string;
  targetBranch?: string;
}

export interface BitbucketNodeData extends BaseNodeData {
  action: "createRepo" | "createPR" | "commit" | "listRepos";
  workspace: string;
  repoSlug?: string;
  title?: string;
  sourceBranch?: string;
  destinationBranch?: string;
}

export interface JiraNodeData extends BaseNodeData {
  action:
    | "createIssue"
    | "updateIssue"
    | "deleteIssue"
    | "transition"
    | "comment";
  projectKey: string;
  issueKey?: string;
  summary?: string;
  description?: string;
  issueType?: string;
  transitionId?: string;
}

export interface PostmanAPIRunnerNodeData extends BaseNodeData {
  collectionId: string;
  environment?: string;
  variables?: Record<string, any>;
}

export interface SwaggerAPINodeData extends BaseNodeData {
  swaggerUrl: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  parameters?: Record<string, any>;
}

// E-commerce
export interface ShopifyNodeData extends BaseNodeData {
  action:
    | "createProduct"
    | "updateProduct"
    | "deleteProduct"
    | "listOrders"
    | "fulfillOrder";
  shopDomain: string;
  productId?: string;
  orderId?: string;
  productData?: Record<string, any>;
}

export interface WooCommerceNodeData extends BaseNodeData {
  action: "createProduct" | "updateProduct" | "listOrders" | "updateOrder";
  storeUrl: string;
  productId?: string;
  orderId?: string;
  productData?: Record<string, any>;
}

export interface DarazNodeData extends BaseNodeData {
  action: "listProducts" | "getOrder" | "updateOrder";
  productId?: string;
  orderId?: string;
}

export interface AmazonSellerNodeData extends BaseNodeData {
  action: "listProducts" | "updateInventory" | "getOrder" | "fulfillOrder";
  marketplaceId: string;
  sellerId: string;
  productId?: string;
  orderId?: string;
}

export interface StripeNodeData extends BaseNodeData {
  action: "createPayment" | "createSubscription" | "refund" | "listCustomers";
  amount?: number;
  currency?: string;
  customerId?: string;
  paymentIntentId?: string;
  priceId?: string;
}

export interface PayPalNodeData extends BaseNodeData {
  action: "createPayment" | "capturePayment" | "refund";
  amount?: number;
  currency?: string;
  orderId?: string;
}

// Databases
export interface MongoDBNodeData extends BaseNodeData {
  action: "find" | "insert" | "update" | "delete" | "aggregate";
  connectionString: string;
  database: string;
  collection: string;
  query?: Record<string, any>;
  document?: Record<string, any>;
  pipeline?: any[];
}

export interface MySQLNodeData extends BaseNodeData {
  action: "query" | "insert" | "update" | "delete";
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  query?: string;
  parameters?: any[];
}

export interface PostgreSQLNodeData extends BaseNodeData {
  action: "query" | "insert" | "update" | "delete";
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  query?: string;
  parameters?: any[];
}

export interface RedisNodeData extends BaseNodeData {
  action: "get" | "set" | "delete" | "expire" | "keys";
  host: string;
  port: number;
  password?: string;
  key?: string;
  value?: string;
  ttl?: number;
  pattern?: string;
}

export interface FirebaseNodeData extends BaseNodeData {
  action: "read" | "write" | "update" | "delete" | "query";
  path: string;
  data?: any;
  orderBy?: string;
  limitToFirst?: number;
  limitToLast?: number;
}

export interface SupabaseNodeData extends BaseNodeData {
  action: "select" | "insert" | "update" | "delete" | "rpc";
  table?: string;
  columns?: string[];
  filter?: Record<string, any>;
  data?: Record<string, any>;
  rpcFunction?: string;
}

// Cloud & Infra
export interface AWSNodeData extends BaseNodeData {
  service: "ec2" | "s3" | "lambda" | "dynamodb" | "sqs" | "sns";
  action: string;
  region: string;
  parameters?: Record<string, any>;
}

export interface GoogleCloudNodeData extends BaseNodeData {
  service: "compute" | "storage" | "pubsub" | "functions";
  action: string;
  projectId: string;
  parameters?: Record<string, any>;
}

export interface AzureNodeData extends BaseNodeData {
  service: "vm" | "storage" | "functions" | "database";
  action: string;
  resourceGroup: string;
  parameters?: Record<string, any>;
}

export interface DockerNodeData extends BaseNodeData {
  action: "build" | "run" | "stop" | "remove" | "logs" | "ps";
  image?: string;
  container?: string;
  dockerfile?: string;
  buildArgs?: Record<string, string>;
  ports?: string[];
  volumes?: string[];
}

export interface KubernetesNodeData extends BaseNodeData {
  action: "apply" | "delete" | "get" | "scale" | "rollout";
  resourceType: "pod" | "deployment" | "service" | "configmap" | "secret";
  namespace?: string;
  name?: string;
  manifest?: string;
  replicas?: number;
}

export interface CICDWebhookNodeData extends BaseNodeData {
  provider: "github-actions" | "gitlab-ci" | "jenkins" | "circleci";
  webhookUrl: string;
  branch?: string;
  parameters?: Record<string, any>;
}

// ============ 3. AUTOMATION LOGIC NODES ============

// Control Flow
export interface IfElseNodeData extends BaseNodeData {
  condition: string;
  operator:
    | "equals"
    | "notEquals"
    | "contains"
    | "gt"
    | "lt"
    | "gte"
    | "lte"
    | "exists"
    | "regex";
  value?: any;
  compareField?: string;
}

export interface SwitchNodeData extends BaseNodeData {
  inputField: string;
  cases: Array<{
    value: any;
    label?: string;
  }>;
  defaultCase?: boolean;
}

export interface LoopNodeData extends BaseNodeData {
  loopType: "count" | "forEach" | "while";
  iterations?: number;
  arrayVariable?: string;
  condition?: string;
  maxIterations?: number;
}

export interface BreakNodeData extends BaseNodeData {
  condition?: string;
}

export interface ParallelRunNodeData extends BaseNodeData {
  branches: number;
  waitForAll?: boolean;
  timeout?: number;
}

export interface DelayNodeData extends BaseNodeData {
  delayType: "fixed" | "random" | "conditional";
  delayMs?: number;
  minDelayMs?: number;
  maxDelayMs?: number;
  condition?: string;
  unit?: "ms" | "s" | "m";
}

export interface RetryNodeData extends BaseNodeData {
  maxRetries: number;
  retryDelay: number;
  exponentialBackoff?: boolean;
  retryCondition?: string;
}

export interface ErrorHandlerNodeData extends BaseNodeData {
  catchErrors?: boolean;
  errorVariable?: string;
  continueOnError?: boolean;
  fallbackValue?: any;
}

export interface WaitForEventNodeData extends BaseNodeData {
  eventType: "webhook" | "variable" | "time" | "custom";
  eventName?: string;
  timeout?: number;
  timeoutAction?: "error" | "continue";
}

// Scheduling
export interface CronTriggerNodeData extends BaseNodeData {
  cronExpression: string;
  timezone?: string;
  enabled?: boolean;
}

export interface TimeDelayNodeData extends BaseNodeData {
  delayMs: number;
  unit: "ms" | "s" | "m" | "h";
}

export interface IntervalTriggerNodeData extends BaseNodeData {
  intervalMs: number;
  maxExecutions?: number;
  enabled?: boolean;
}

export interface DateTimeFilterNodeData extends BaseNodeData {
  filterType: "before" | "after" | "between" | "dayOfWeek";
  dateField: string;
  startDate?: string;
  endDate?: string;
  daysOfWeek?: number[];
}

// Event-Based
export interface WebhookTriggerNodeData extends BaseNodeData {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  authentication?: {
    type: "none" | "basic" | "bearer" | "apiKey";
    credentials?: Record<string, string>;
  };
}

export interface APITriggerNodeData extends BaseNodeData {
  endpoint: string;
  method: "GET" | "POST";
  authentication?: {
    type: "none" | "apiKey" | "oauth";
    credentials?: Record<string, string>;
  };
}

export interface FileUploadTriggerNodeData extends BaseNodeData {
  uploadPath: string;
  allowedExtensions?: string[];
  maxFileSize?: number;
}

export interface EmailReceivedTriggerNodeData extends BaseNodeData {
  emailProvider: "gmail" | "outlook" | "imap";
  fromFilter?: string;
  subjectFilter?: string;
  pollInterval?: number;
}

export interface DatabaseChangeTriggerNodeData extends BaseNodeData {
  databaseType: "postgres" | "mysql" | "mongodb";
  connectionString: string;
  table: string;
  changeType: "insert" | "update" | "delete";
  pollInterval?: number;
}

export interface NewMessageTriggerNodeData extends BaseNodeData {
  platform: "slack" | "discord" | "telegram" | "whatsapp";
  channel?: string;
  keywordFilter?: string;
}

// ============ 4. AI NODES ============

export interface AIPromptNodeData extends BaseNodeData {
  model: "gpt-4" | "gpt-3.5-turbo" | "claude-3" | "gemini-pro";
  prompt: string;
  systemMessage?: string;
  temperature?: number;
  maxTokens?: number;
  stopSequences?: string[];
}

export interface AIClassifierNodeData extends BaseNodeData {
  model: "gpt-4" | "gpt-3.5-turbo" | "claude-3";
  input: string;
  categories: string[];
  outputVariable?: string;
}

export interface AITextGeneratorNodeData extends BaseNodeData {
  model: "gpt-4" | "gpt-3.5-turbo";
  taskType: "summary" | "translation" | "rewrite" | "expand" | "custom";
  input: string;
  instructions?: string;
  maxLength?: number;
}

export interface AIExtractorNodeData extends BaseNodeData {
  model: "gpt-4" | "gpt-3.5-turbo";
  input: string;
  schema: Record<string, any>;
  extractionRules?: string;
}

export interface AIDecisionMakerNodeData extends BaseNodeData {
  model: "gpt-4" | "gpt-3.5-turbo";
  decision: string;
  options: string[];
  context?: string;
  reasoning?: boolean;
}

export interface AIPlannerNodeData extends BaseNodeData {
  model: "gpt-4";
  goal: string;
  constraints?: string[];
  maxSteps?: number;
  outputFormat: "json" | "text";
}

export interface AIVisionNodeData extends BaseNodeData {
  model: "gpt-4-vision" | "claude-3-vision";
  imageUrl?: string;
  imageBase64?: string;
  prompt: string;
  detail?: "low" | "high";
}

export interface AISpeechNodeData extends BaseNodeData {
  action: "transcribe" | "synthesize";
  audioUrl?: string;
  text?: string;
  voice?: string;
  language?: string;
}

export interface AIVoiceCommandNodeData extends BaseNodeData {
  model: "whisper";
  audioSource: "microphone" | "file" | "url";
  audioUrl?: string;
  language?: string;
  commands?: string[];
}

export interface AITranslationNodeData extends BaseNodeData {
  sourceLanguage: string;
  targetLanguage: string;
  text: string;
  preserveFormatting?: boolean;
}

export interface OCRExtractorNodeData extends BaseNodeData {
  imageUrl?: string;
  imageBase64?: string;
  language?: string;
  outputFormat: "text" | "json";
}

export interface SentimentAnalysisNodeData extends BaseNodeData {
  text: string;
  outputFormat: "score" | "label" | "detailed";
}

export interface DataPredictionNodeData extends BaseNodeData {
  model: "regression" | "classification" | "timeseries";
  inputData: any;
  features?: string[];
  targetVariable?: string;
}

// ============ 5. DATA NODES ============

export interface MergeDataNodeData extends BaseNodeData {
  mergeType: "concat" | "union" | "intersect" | "leftJoin" | "rightJoin";
  input1: string;
  input2: string;
  joinKey?: string;
}

export interface SplitDataNodeData extends BaseNodeData {
  splitType: "chunk" | "condition" | "percentage";
  chunkSize?: number;
  condition?: string;
  percentage?: number;
}

export interface FilterNodeData extends BaseNodeData {
  conditions: Array<{
    field: string;
    operator: "equals" | "contains" | "gt" | "lt" | "exists" | "regex";
    value: any;
  }>;
  logic: "AND" | "OR";
}

export interface MapNodeData extends BaseNodeData {
  transformations: Array<{
    inputField: string;
    outputField: string;
    transformation?: string;
  }>;
}

export interface ReduceNodeData extends BaseNodeData {
  operation: "sum" | "average" | "count" | "min" | "max" | "custom";
  field?: string;
  customFunction?: string;
}

export interface SortNodeData extends BaseNodeData {
  sortBy: string;
  order: "asc" | "desc";
  sortType: "string" | "number" | "date";
}

export interface GroupByNodeData extends BaseNodeData {
  groupByField: string;
  aggregations?: Array<{
    field: string;
    operation: "sum" | "count" | "avg" | "min" | "max";
  }>;
}

export interface ConvertJSONNodeData extends BaseNodeData {
  action: "parse" | "stringify";
  input: string;
  pretty?: boolean;
  validateSchema?: boolean;
}

export interface ConvertCSVNodeData extends BaseNodeData {
  action: "parse" | "generate";
  input: string;
  delimiter?: string;
  hasHeaders?: boolean;
}

export interface ConvertXMLNodeData extends BaseNodeData {
  action: "parse" | "generate";
  input: string;
  rootElement?: string;
}

export interface EncodeDecodeNodeData extends BaseNodeData {
  action: "encode" | "decode";
  encoding: "base64" | "uri" | "hex" | "utf8";
  input: string;
}

export interface HashGeneratorNodeData extends BaseNodeData {
  algorithm: "md5" | "sha1" | "sha256" | "sha512";
  input: string;
  salt?: string;
}

export interface RegexExtractorNodeData extends BaseNodeData {
  pattern: string;
  input: string;
  flags?: string;
  captureGroups?: boolean;
  allMatches?: boolean;
}

// ============ 6. UTILITY NODES ============

export interface HTTPRequestNodeData extends BaseNodeData {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  url: string;
  headers?: Record<string, string>;
  body?: string;
  bodyType?: "json" | "form" | "raw" | "graphql";
  timeout?: number;
  retries?: number;
  authentication?: {
    type: "none" | "bearer" | "basic" | "oauth2" | "apiKey";
    token?: string;
    username?: string;
    password?: string;
    apiKey?: string;
    apiKeyHeader?: string;
  };
  responseVariable?: string;
  followRedirects?: boolean;
  validateSSL?: boolean;
}

export interface WebSocketNodeData extends BaseNodeData {
  action: "connect" | "send" | "receive" | "disconnect";
  url: string;
  message?: string;
  protocols?: string[];
  headers?: Record<string, string>;
}

export interface ExecuteShellCommandNodeData extends BaseNodeData {
  command: string;
  args?: string[];
  cwd?: string;
  env?: Record<string, string>;
  timeout?: number;
  shell?: boolean;
}

export interface RunPythonScriptNodeData extends BaseNodeData {
  script: string;
  pythonPath?: string;
  args?: Record<string, any>;
  timeout?: number;
}

export interface RunJavaScriptNodeData extends BaseNodeData {
  code: string;
  context?: Record<string, any>;
  timeout?: number;
}

export interface RunNodeFunctionNodeData extends BaseNodeData {
  functionName: string;
  parameters?: Record<string, any>;
}

export interface EnvironmentVariableNodeData extends BaseNodeData {
  action: "get" | "set" | "delete";
  variableName: string;
  value?: string;
  scope?: "process" | "workflow" | "global";
}

export interface ErrorLogNodeData extends BaseNodeData {
  logLevel: "error" | "warn" | "info" | "debug";
  message: string;
  metadata?: Record<string, any>;
}

// ============ 7. USER & PROJECT MANAGEMENT ============

export interface UserRegisterNodeData extends BaseNodeData {
  email: string;
  password: string;
  username?: string;
  metadata?: Record<string, any>;
}

export interface UserLoginNodeData extends BaseNodeData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface UpdateProfileNodeData extends BaseNodeData {
  userId: string;
  updates: Record<string, any>;
}

export interface SaveCredentialsNodeData extends BaseNodeData {
  service: string;
  credentials: Record<string, string>;
  encrypted?: boolean;
}

export interface CreateProjectNodeData extends BaseNodeData {
  projectName: string;
  description?: string;
  template?: string;
}

export interface SaveWorkflowNodeData extends BaseNodeData {
  workflowName: string;
  workflowData: Record<string, any>;
  version?: number;
}

export interface ExportWorkflowNodeData extends BaseNodeData {
  workflowId: string;
  format: "json" | "yaml";
  includeCredentials?: boolean;
}

export interface ImportWorkflowNodeData extends BaseNodeData {
  workflowData: string;
  format: "json" | "yaml";
  overwrite?: boolean;
}

export interface ShareWorkflowNodeData extends BaseNodeData {
  workflowId: string;
  shareWith: string[];
  permission: "view" | "edit" | "execute";
}

// ============ 8. SELF-HOSTED / SYSTEM CONTROL ============

export interface StartContainerNodeData extends BaseNodeData {
  containerName: string;
  image: string;
  ports?: string[];
  volumes?: string[];
  env?: Record<string, string>;
}

export interface StopContainerNodeData extends BaseNodeData {
  containerName: string;
  timeout?: number;
}

export interface RestartContainerNodeData extends BaseNodeData {
  containerName: string;
  timeout?: number;
}

export interface MonitorUsageNodeData extends BaseNodeData {
  metrics: Array<"cpu" | "memory" | "disk" | "network">;
  interval?: number;
  threshold?: Record<string, number>;
}

export interface BackupDataNodeData extends BaseNodeData {
  backupType: "full" | "incremental" | "differential";
  destination: string;
  compression?: boolean;
  encryption?: boolean;
}

export interface UpdateNodeNodeData extends BaseNodeData {
  packageName: string;
  version?: string;
  registry?: string;
}

export interface SystemHealthCheckNodeData extends BaseNodeData {
  checks: Array<"api" | "database" | "queue" | "storage">;
  timeout?: number;
}

// ============ 9. SECURITY & PRIVACY ============

export interface EncryptDataNodeData extends BaseNodeData {
  algorithm: "aes-256-gcm" | "rsa" | "chacha20";
  data: string;
  key?: string;
  iv?: string;
}

export interface DecryptDataNodeData extends BaseNodeData {
  algorithm: "aes-256-gcm" | "rsa" | "chacha20";
  encryptedData: string;
  key?: string;
  iv?: string;
}

export interface TokenizeSensitiveInfoNodeData extends BaseNodeData {
  data: string;
  tokenType: "alphanumeric" | "numeric" | "uuid";
  storeMapping?: boolean;
}

export interface SecureInputNodeData extends BaseNodeData {
  input: string;
  validationType: "email" | "url" | "phone" | "creditCard" | "ssn" | "custom";
  customPattern?: string;
  sanitize?: boolean;
}

export interface AccessPolicyNodeData extends BaseNodeData {
  resource: string;
  action: "read" | "write" | "delete" | "execute";
  userId?: string;
  roleRequired?: string;
}

export interface UserRolesNodeData extends BaseNodeData {
  action: "assign" | "revoke" | "check";
  userId: string;
  role: "admin" | "user" | "viewer" | "editor";
}

// ============ GENERAL UTILITY ============

export interface NotificationNodeData extends BaseNodeData {
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  duration?: number;
  sound?: boolean;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}

export interface NoteNodeData extends BaseNodeData {
  content: string;
  color?: string;
  fontSize?: number;
  collapsed?: boolean;
}

export interface SetVariableNodeData extends BaseNodeData {
  variableName: string;
  variableType: "string" | "number" | "boolean" | "object" | "array";
  value: string;
  scope?: "workflow" | "global" | "session";
  encrypted?: boolean;
}

export interface ExportDataNodeData extends BaseNodeData {
  format: "json" | "csv" | "xlsx" | "xml" | "txt";
  fileName: string;
  data: string;
  downloadToClient?: boolean;
  saveToServer?: boolean;
  serverPath?: string;
  includeTimestamp?: boolean;
  compression?: "none" | "zip" | "gzip";
}

export interface ClipboardNodeData extends BaseNodeData {
  action: "copy" | "paste" | "clear";
  content?: string;
  targetVariable?: string;
}

// ============ UNION TYPES ============

export type NodeType =
  // Core
  | "trigger"
  | "aiAgent"
  // Web Automation - Web Interaction
  | "openURL"
  | "clickElement"
  | "fillInput"
  | "selectDropdown"
  | "uploadFile"
  | "downloadFile"
  | "waitForElement"
  | "extractText"
  | "extractAttribute"
  | "takeScreenshot"
  | "scrollToElement"
  | "goBack"
  | "goForward"
  | "switchTab"
  | "closeTab"
  // Web Automation - Authentication
  | "loginViaForm"
  | "loginViaOAuth"
  | "handleCaptcha"
  | "cookieSave"
  | "cookieLoad"
  | "sessionRestore"
  | "logout"
  // Web Automation - Data Extraction
  | "scrapeTable"
  | "scrapeList"
  | "extractJSONFromHTML"
  | "extractMetadata"
  | "parseDOMTree"
  | "webSearch"
  | "rssFeedReader"
  // Web Automation - Navigation
  | "detectURLRedirect"
  | "handlePopup"
  | "handleIFrame"
  | "detectAndClickButton"
  | "scrollInfinitePage"
  | "detectFileDownloadLink"
  // App Integration - Communication
  | "gmail"
  | "outlook"
  | "slack"
  | "discord"
  | "telegram"
  | "whatsappBusiness"
  | "twilioSMS"
  // App Integration - Social Media
  | "twitter"
  | "instagram"
  | "facebook"
  | "linkedin"
  | "youtube"
  | "tiktok"
  // App Integration - Productivity
  | "googleDrive"
  | "googleSheets"
  | "notion"
  | "airtable"
  | "trello"
  | "asana"
  | "clickup"
  | "calendar"
  // App Integration - File Management
  | "dropbox"
  | "onedrive"
  | "awsS3"
  | "ftpSftp"
  // App Integration - Developer Tools
  | "github"
  | "gitlab"
  | "bitbucket"
  | "jira"
  | "postmanAPIRunner"
  | "swaggerAPI"
  // App Integration - E-commerce
  | "shopify"
  | "woocommerce"
  | "daraz"
  | "amazonSeller"
  | "stripe"
  | "paypal"
  // App Integration - Databases
  | "mongodb"
  | "mysql"
  | "postgresql"
  | "redis"
  | "firebase"
  | "supabase"
  // App Integration - Cloud & Infra
  | "aws"
  | "googleCloud"
  | "azure"
  | "docker"
  | "kubernetes"
  | "cicdWebhook"
  // Automation Logic - Control Flow
  | "ifElse"
  | "switch"
  | "loop"
  | "break"
  | "parallelRun"
  | "delay"
  | "retry"
  | "errorHandler"
  | "waitForEvent"
  // Automation Logic - Scheduling
  | "cronTrigger"
  | "timeDelay"
  | "intervalTrigger"
  | "dateTimeFilter"
  // Automation Logic - Event-Based
  | "webhookTrigger"
  | "apiTrigger"
  | "fileUploadTrigger"
  | "emailReceivedTrigger"
  | "databaseChangeTrigger"
  | "newMessageTrigger"
  // AI Nodes
  | "aiPrompt"
  | "aiClassifier"
  | "aiTextGenerator"
  | "aiExtractor"
  | "aiDecisionMaker"
  | "aiPlanner"
  | "aiVision"
  | "aiSpeech"
  | "aiVoiceCommand"
  | "aiTranslation"
  | "ocrExtractor"
  | "sentimentAnalysis"
  | "dataPrediction"
  // Data Nodes
  | "mergeData"
  | "splitData"
  | "filter"
  | "map"
  | "reduce"
  | "sort"
  | "groupBy"
  | "convertJSON"
  | "convertCSV"
  | "convertXML"
  | "encodeDecode"
  | "hashGenerator"
  | "regexExtractor"
  // Utility Nodes
  | "httpRequest"
  | "webSocket"
  | "executeShellCommand"
  | "runPythonScript"
  | "runJavaScript"
  | "runNodeFunction"
  | "environmentVariable"
  | "errorLog"
  // User & Project Management
  | "userRegister"
  | "userLogin"
  | "updateProfile"
  | "saveCredentials"
  | "createProject"
  | "saveWorkflow"
  | "exportWorkflow"
  | "importWorkflow"
  | "shareWorkflow"
  // Self-Hosted / System Control
  | "startContainer"
  | "stopContainer"
  | "restartContainer"
  | "monitorUsage"
  | "backupData"
  | "updateNode"
  | "systemHealthCheck"
  // Security & Privacy
  | "encryptData"
  | "decryptData"
  | "tokenizeSensitiveInfo"
  | "secureInput"
  | "accessPolicy"
  | "userRoles"
  // General Utility
  | "notification"
  | "note"
  | "setVariable"
  | "exportData"
  | "clipboard";

export type WorkflowNodeData =
  | OnClickNodeData
  | AIAgentNodeData
  | OpenURLNodeData
  | ClickElementNodeData
  | FillInputNodeData
  | SelectDropdownNodeData
  | UploadFileNodeData
  | DownloadFileNodeData
  | WaitForElementNodeData
  | ExtractTextNodeData
  | ExtractAttributeNodeData
  | TakeScreenshotNodeData
  | ScrollToElementNodeData
  | GoBackNodeData
  | GoForwardNodeData
  | SwitchTabNodeData
  | CloseTabNodeData
  | LoginViaFormNodeData
  | LoginViaOAuthNodeData
  | HandleCaptchaNodeData
  | CookieSaveNodeData
  | CookieLoadNodeData
  | SessionRestoreNodeData
  | LogoutNodeData
  | ScrapeTableNodeData
  | ScrapeListNodeData
  | ExtractJSONFromHTMLNodeData
  | ExtractMetadataNodeData
  | ParseDOMTreeNodeData
  | WebSearchNodeData
  | RSSFeedReaderNodeData
  | DetectURLRedirectNodeData
  | HandlePopupNodeData
  | HandleIFrameNodeData
  | DetectAndClickButtonNodeData
  | ScrollInfinitePageNodeData
  | DetectFileDownloadLinkNodeData
  | GmailNodeData
  | OutlookNodeData
  | SlackNodeData
  | DiscordNodeData
  | TelegramNodeData
  | WhatsAppBusinessNodeData
  | TwilioSMSNodeData
  | TwitterNodeData
  | InstagramNodeData
  | FacebookNodeData
  | LinkedInNodeData
  | YouTubeNodeData
  | TikTokNodeData
  | GoogleDriveNodeData
  | GoogleSheetsNodeData
  | NotionNodeData
  | AirtableNodeData
  | TrelloNodeData
  | AsanaNodeData
  | ClickUpNodeData
  | CalendarNodeData
  | DropboxNodeData
  | OneDriveNodeData
  | AWSS3NodeData
  | FTPSFTPNodeData
  | GitHubNodeData
  | GitLabNodeData
  | BitbucketNodeData
  | JiraNodeData
  | PostmanAPIRunnerNodeData
  | SwaggerAPINodeData
  | ShopifyNodeData
  | WooCommerceNodeData
  | DarazNodeData
  | AmazonSellerNodeData
  | StripeNodeData
  | PayPalNodeData
  | MongoDBNodeData
  | MySQLNodeData
  | PostgreSQLNodeData
  | RedisNodeData
  | FirebaseNodeData
  | SupabaseNodeData
  | AWSNodeData
  | GoogleCloudNodeData
  | AzureNodeData
  | DockerNodeData
  | KubernetesNodeData
  | CICDWebhookNodeData
  | IfElseNodeData
  | SwitchNodeData
  | LoopNodeData
  | BreakNodeData
  | ParallelRunNodeData
  | DelayNodeData
  | RetryNodeData
  | ErrorHandlerNodeData
  | WaitForEventNodeData
  | CronTriggerNodeData
  | TimeDelayNodeData
  | IntervalTriggerNodeData
  | DateTimeFilterNodeData
  | WebhookTriggerNodeData
  | APITriggerNodeData
  | FileUploadTriggerNodeData
  | EmailReceivedTriggerNodeData
  | DatabaseChangeTriggerNodeData
  | NewMessageTriggerNodeData
  | AIPromptNodeData
  | AIClassifierNodeData
  | AITextGeneratorNodeData
  | AIExtractorNodeData
  | AIDecisionMakerNodeData
  | AIPlannerNodeData
  | AIVisionNodeData
  | AISpeechNodeData
  | AIVoiceCommandNodeData
  | AITranslationNodeData
  | OCRExtractorNodeData
  | SentimentAnalysisNodeData
  | DataPredictionNodeData
  | MergeDataNodeData
  | SplitDataNodeData
  | FilterNodeData
  | MapNodeData
  | ReduceNodeData
  | SortNodeData
  | GroupByNodeData
  | ConvertJSONNodeData
  | ConvertCSVNodeData
  | ConvertXMLNodeData
  | EncodeDecodeNodeData
  | HashGeneratorNodeData
  | RegexExtractorNodeData
  | HTTPRequestNodeData
  | WebSocketNodeData
  | ExecuteShellCommandNodeData
  | RunPythonScriptNodeData
  | RunJavaScriptNodeData
  | RunNodeFunctionNodeData
  | EnvironmentVariableNodeData
  | ErrorLogNodeData
  | UserRegisterNodeData
  | UserLoginNodeData
  | UpdateProfileNodeData
  | SaveCredentialsNodeData
  | CreateProjectNodeData
  | SaveWorkflowNodeData
  | ExportWorkflowNodeData
  | ImportWorkflowNodeData
  | ShareWorkflowNodeData
  | StartContainerNodeData
  | StopContainerNodeData
  | RestartContainerNodeData
  | MonitorUsageNodeData
  | BackupDataNodeData
  | UpdateNodeNodeData
  | SystemHealthCheckNodeData
  | EncryptDataNodeData
  | DecryptDataNodeData
  | TokenizeSensitiveInfoNodeData
  | SecureInputNodeData
  | AccessPolicyNodeData
  | UserRolesNodeData
  | NotificationNodeData
  | NoteNodeData
  | SetVariableNodeData
  | ExportDataNodeData
  | ClipboardNodeData;

export interface WorkflowNode extends Node {
  type: NodeType;
  data: WorkflowNodeData;
}

export type DataEdge = Edge & {
  type?: "custom" | "default";
  animated?: boolean;
  markerEnd?: {
    type: MarkerType;
    color?: string;
  };
  data?: {
    isDashed?: boolean;
    label?: string;
    payload?: any;
    onAddNode?: (sourceNodeId: string, edgeId: string) => void;
  };
};
export interface WorkflowGraph {
  nodes: WorkflowNode[];
  edges: DataEdge[];
  variables?: Record<string, any>;
  version: number;
}

export interface WorkflowValidationError {
  nodeId?: string;
  edgeId?: string;
  type: "error" | "warning";
  message: string;
}
