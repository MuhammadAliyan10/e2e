import type { Node, Edge } from "reactflow";

// ============ BASE TYPES ============

export interface NodeOutput {
  data: any;
  metadata?: {
    timestamp: string;
    duration?: number;
    success: boolean;
    errorCode?: string;
    retryCount?: number;
  };
}

export interface BaseNodeData {
  label: string;
  description?: string;
  enabled?: boolean;
  executionState?: "idle" | "running" | "success" | "error" | "skipped";
  outputSchema?: Record<string, any>;
  errors?: string[];
  outputs?: NodeOutput;
  variables?: Record<string, any>;
  metadata?: {
    createdAt?: string;
    updatedAt?: string;
    version?: number;
  };
}

// ============ EXECUTION RESULTS ============

export interface NodeExecutionResult {
  success: boolean;
  executionTime: number;
  nodeId: string;
  nodeType: string;
  output?: any;
  error?: {
    message: string;
    code: string;
    stack?: string;
  };
  metadata?: {
    timestamp: string;
    retryCount?: number;
    screenshot?: string;
  };
}

// ============ TRIGGER NODES ============

export interface TriggerNodeData extends BaseNodeData {
  type:
    | "manual"
    | "schedule"
    | "webhook"
    | "email"
    | "fileUpload"
    | "database"
    | "message";
  schedule?: string; // Cron expression
  webhookUrl?: string;
  webhookSecret?: string;
  enabled?: boolean;
  lastTriggered?: string;
  triggerCount?: number;
}

// ============ AI NODES ============

export interface AIAgentNodeData extends BaseNodeData {
  prompt: string;
  context?: string;
  model: "gpt-4" | "gpt-3.5-turbo" | "claude-3" | "gemini-pro";
  maxSteps?: number;
  outputFormat?: "structured" | "text" | "json";
  url?: string;
  temperature?: number;
  maxTokens?: number;
  stopSequences?: string[];
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
    parameters?: Record<string, any>;
  }>;
}

export interface AIPromptNodeData extends BaseNodeData {
  model: "gpt-4" | "gpt-3.5-turbo" | "claude-3" | "gemini-pro";
  prompt: string;
  systemMessage?: string;
  temperature?: number;
  maxTokens?: number;
  stopSequences?: string[];
  responseFormat?: "text" | "json" | "function";
}

export interface AIClassifierNodeData extends BaseNodeData {
  model: "gpt-4" | "gpt-3.5-turbo" | "claude-3";
  input: string;
  categories: string[];
  confidence?: number;
  outputVariable?: string;
}

export interface AITextGeneratorNodeData extends BaseNodeData {
  model: "gpt-4" | "gpt-3.5-turbo";
  taskType: "summary" | "translation" | "rewrite" | "expand" | "custom";
  input: string;
  instructions?: string;
  maxLength?: number;
  style?: "formal" | "casual" | "technical";
}

export interface AIExtractorNodeData extends BaseNodeData {
  model: "gpt-4" | "gpt-3.5-turbo";
  input: string;
  schema: Record<string, any>;
  extractionRules?: string;
  validateOutput?: boolean;
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
  detail?: "low" | "high" | "auto";
}

export interface AISpeechNodeData extends BaseNodeData {
  action: "transcribe" | "synthesize";
  audioUrl?: string;
  audioBase64?: string;
  text?: string;
  voice?: string;
  language?: string;
  format?: "mp3" | "wav" | "opus";
}

export interface AITranslationNodeData extends BaseNodeData {
  sourceLanguage: string;
  targetLanguage: string;
  text: string;
  preserveFormatting?: boolean;
  glossary?: Record<string, string>;
}

export interface OCRExtractorNodeData extends BaseNodeData {
  imageUrl?: string;
  imageBase64?: string;
  language?: string;
  outputFormat: "text" | "json" | "hocr";
  preprocessImage?: boolean;
}

export interface SentimentAnalysisNodeData extends BaseNodeData {
  text: string;
  outputFormat: "score" | "label" | "detailed";
  aspects?: string[];
}

export interface DataPredictionNodeData extends BaseNodeData {
  model: "regression" | "classification" | "timeseries";
  inputData: any;
  features?: string[];
  targetVariable?: string;
  confidence?: number;
}

// ============ WEB AUTOMATION NODES ============

export interface OpenURLNodeData extends BaseNodeData {
  url: string;
  waitForSelector?: string;
  timeout?: number;
  userAgent?: string;
  viewport?: { width: number; height: number };
  waitForNavigation?: boolean;
  referer?: string;
}

export interface ClickElementNodeData extends BaseNodeData {
  selector: string;
  selectorType: "css" | "xpath" | "text" | "role";
  clickType: "single" | "double" | "right" | "middle";
  waitAfterClick?: number;
  retryCount?: number;
  timeout?: number;
  forceClick?: boolean;
  scrollIntoView?: boolean;
}

export interface FillInputNodeData extends BaseNodeData {
  selector: string;
  value: string;
  clearFirst?: boolean;
  pressEnter?: boolean;
  delay?: number;
  validateInput?: boolean;
  inputType?: "text" | "email" | "password" | "number";
}

export interface SelectDropdownNodeData extends BaseNodeData {
  selector: string;
  value: string;
  selectBy: "value" | "label" | "index";
  waitForOptions?: boolean;
  multiple?: boolean;
}

export interface UploadFileNodeData extends BaseNodeData {
  selector: string;
  filePath: string;
  fileSource: "local" | "url" | "base64";
  mimeType?: string;
  waitForUpload?: boolean;
  maxFileSize?: number;
}

export interface DownloadFileNodeData extends BaseNodeData {
  selector?: string;
  url?: string;
  savePath: string;
  filename?: string;
  overwrite?: boolean;
  waitForDownload?: boolean;
  timeout?: number;
  validateChecksum?: boolean;
}

export interface WaitForElementNodeData extends BaseNodeData {
  selector: string;
  state?: "visible" | "hidden" | "attached" | "detached";
  timeout?: number;
  throwOnTimeout?: boolean;
}

export interface ExtractTextNodeData extends BaseNodeData {
  selector: string;
  attribute?: "text" | "innerText" | "innerHTML" | "textContent";
  multiple?: boolean;
  trim?: boolean;
  regex?: string;
  sanitize?: boolean;
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
  clip?: { x: number; y: number; width: number; height: number };
}

export interface ScrollToElementNodeData extends BaseNodeData {
  selector?: string;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
  behavior?: "auto" | "smooth" | "instant";
  alignTo?: "start" | "center" | "end";
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
  closeAfter?: boolean;
}

export interface CloseTabNodeData extends BaseNodeData {
  tabIndex?: number;
  closeAll?: boolean;
  excludeCurrent?: boolean;
}

// ============ WEB AUTHENTICATION ============

export interface LoginViaFormNodeData extends BaseNodeData {
  usernameSelector: string;
  passwordSelector: string;
  submitSelector: string;
  username: string;
  password: string;
  waitForSelector?: string;
  saveCookies?: boolean;
  twoFactorSelector?: string;
}

export interface LoginViaOAuthNodeData extends BaseNodeData {
  provider: "google" | "facebook" | "github" | "microsoft" | "apple";
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope?: string[];
  state?: string;
}

export interface HandleCaptchaNodeData extends BaseNodeData {
  captchaType:
    | "recaptcha_v2"
    | "recaptcha_v3"
    | "hcaptcha"
    | "image"
    | "cloudflare";
  siteKey?: string;
  solverService?: "2captcha" | "anticaptcha" | "capsolver" | "manual";
  apiKey?: string;
  timeout?: number;
}

export interface CookieSaveNodeData extends BaseNodeData {
  savePath: string;
  cookieName?: string;
  domain?: string;
  encrypted?: boolean;
}

export interface CookieLoadNodeData extends BaseNodeData {
  loadPath: string;
  domain?: string;
  validateExpiry?: boolean;
}

export interface SessionRestoreNodeData extends BaseNodeData {
  sessionPath: string;
  includeLocalStorage?: boolean;
  includeCookies?: boolean;
}

export interface LogoutNodeData extends BaseNodeData {
  logoutSelector?: string;
  clearCookies?: boolean;
  clearLocalStorage?: boolean;
  clearSessionStorage?: boolean;
}

// ============ DATA EXTRACTION ============

export interface ScrapeTableNodeData extends BaseNodeData {
  tableSelector: string;
  includeHeaders?: boolean;
  rowSelector?: string;
  cellSelector?: string;
  outputFormat?: "array" | "json" | "csv";
  skipRows?: number;
}

export interface ScrapeListNodeData extends BaseNodeData {
  listSelector: string;
  itemSelector: string;
  extractFields: Array<{
    key: string;
    selector: string;
    attribute?: string;
    transform?: string;
  }>;
  pagination?: {
    enabled: boolean;
    nextButtonSelector?: string;
    maxPages?: number;
  };
}

export interface ExtractJSONFromHTMLNodeData extends BaseNodeData {
  scriptSelector?: string;
  scriptType?: "application/json" | "application/ld+json";
  jsonPath?: string;
  validateSchema?: boolean;
  schema?: Record<string, any>;
}

export interface ExtractMetadataNodeData extends BaseNodeData {
  fields: Array<
    | "title"
    | "description"
    | "keywords"
    | "author"
    | "og:image"
    | "og:title"
    | "canonical"
    | "viewport"
  >;
  customSelectors?: Record<string, string>;
}

export interface ParseDOMTreeNodeData extends BaseNodeData {
  rootSelector?: string;
  depth?: number;
  includeAttributes?: boolean;
  includeText?: boolean;
  outputFormat?: "json" | "xml";
}

export interface WebSearchNodeData extends BaseNodeData {
  searchEngine: "google" | "bing" | "duckduckgo" | "brave";
  query: string;
  resultCount?: number;
  language?: string;
  region?: string;
  safeSearch?: boolean;
}

export interface RSSFeedReaderNodeData extends BaseNodeData {
  feedUrl: string;
  itemCount?: number;
  parseContent?: boolean;
  filterBy?: {
    field: string;
    operator: "contains" | "equals" | "before" | "after";
    value: string;
  };
}

// ============ WEB NAVIGATION ============

export interface DetectURLRedirectNodeData extends BaseNodeData {
  followRedirects?: boolean;
  maxRedirects?: number;
  captureRedirectChain?: boolean;
}

export interface HandlePopupNodeData extends BaseNodeData {
  action: "accept" | "dismiss" | "interact";
  waitForPopup?: boolean;
  popupSelector?: string;
  timeout?: number;
}

export interface HandleIFrameNodeData extends BaseNodeData {
  iframeSelector: string;
  action: "enter" | "exit";
  waitForLoad?: boolean;
  nestedLevel?: number;
}

export interface DetectAndClickButtonNodeData extends BaseNodeData {
  buttonText?: string;
  buttonRole?: string;
  fallbackSelector?: string;
  fuzzyMatch?: boolean;
  caseSensitive?: boolean;
}

export interface ScrollInfinitePageNodeData extends BaseNodeData {
  maxScrolls?: number;
  scrollDelay?: number;
  scrollSelector?: string;
  stopCondition?: string;
  detectDuplicates?: boolean;
}

export interface DetectFileDownloadLinkNodeData extends BaseNodeData {
  linkSelector?: string;
  fileExtensions?: string[];
  downloadOnDetect?: boolean;
  minFileSize?: number;
  maxFileSize?: number;
}

// ============ COMMUNICATION ============

export interface GmailNodeData extends BaseNodeData {
  action: "send" | "read" | "search" | "delete" | "label";
  to?: string;
  cc?: string;
  bcc?: string;
  subject?: string;
  body?: string;
  bodyType?: "text" | "html";
  from?: string;
  query?: string;
  maxResults?: number;
  attachments?: string[];
  labelId?: string;
}

export interface OutlookNodeData extends BaseNodeData {
  action: "send" | "read" | "calendar" | "delete";
  to?: string;
  subject?: string;
  body?: string;
  bodyType?: "text" | "html";
  startDate?: string;
  endDate?: string;
  attendees?: string[];
}

export interface SlackNodeData extends BaseNodeData {
  action: "send" | "read" | "upload" | "react" | "createChannel";
  channel: string;
  message?: string;
  threadTs?: string;
  fileUrl?: string;
  emoji?: string;
}

export interface DiscordNodeData extends BaseNodeData {
  action: "send" | "read" | "embed" | "react";
  channelId: string;
  message?: string;
  embed?: {
    title?: string;
    description?: string;
    color?: string;
    fields?: Array<{ name: string; value: string; inline?: boolean }>;
    thumbnail?: string;
    image?: string;
  };
  emoji?: string;
}

export interface TelegramNodeData extends BaseNodeData {
  action: "send" | "read" | "sendPhoto" | "sendDocument";
  chatId: string;
  message?: string;
  photoUrl?: string;
  documentUrl?: string;
  parseMode?: "Markdown" | "HTML" | "MarkdownV2";
  replyToMessageId?: number;
}

export interface WhatsAppBusinessNodeData extends BaseNodeData {
  action: "send" | "sendTemplate" | "read";
  to: string;
  message?: string;
  templateName?: string;
  templateParams?: string[];
  mediaUrl?: string;
}

export interface TwilioSMSNodeData extends BaseNodeData {
  action: "send" | "receive";
  to?: string;
  from: string;
  body?: string;
  mediaUrl?: string;
  statusCallback?: string;
}

// ============ SOCIAL MEDIA ============

export interface TwitterNodeData extends BaseNodeData {
  action: "tweet" | "reply" | "retweet" | "like" | "follow" | "search" | "dm";
  text?: string;
  tweetId?: string;
  username?: string;
  query?: string;
  mediaUrls?: string[];
  poll?: {
    options: string[];
    durationMinutes: number;
  };
}

export interface InstagramNodeData extends BaseNodeData {
  action: "post" | "story" | "comment" | "like" | "follow" | "dm";
  imageUrl?: string;
  videoUrl?: string;
  caption?: string;
  postId?: string;
  comment?: string;
  userId?: string;
  location?: string;
}

export interface FacebookNodeData extends BaseNodeData {
  action: "post" | "comment" | "like" | "share" | "message";
  pageId?: string;
  message?: string;
  link?: string;
  imageUrl?: string;
  postId?: string;
  targeting?: Record<string, any>;
}

export interface LinkedInNodeData extends BaseNodeData {
  action: "post" | "comment" | "message" | "connect" | "share";
  text?: string;
  postId?: string;
  userId?: string;
  connectionMessage?: string;
  visibility?: "PUBLIC" | "CONNECTIONS";
}

export interface YouTubeNodeData extends BaseNodeData {
  action:
    | "upload"
    | "comment"
    | "like"
    | "subscribe"
    | "playlist"
    | "analytics";
  videoFile?: string;
  title?: string;
  description?: string;
  tags?: string[];
  categoryId?: string;
  privacy?: "public" | "private" | "unlisted";
  videoId?: string;
  playlistId?: string;
}

export interface TikTokNodeData extends BaseNodeData {
  action: "upload" | "like" | "comment" | "analytics";
  videoFile?: string;
  caption?: string;
  hashtags?: string[];
  videoId?: string;
  privacy?: "public" | "friends" | "private";
}

// ============ PRODUCTIVITY ============

export interface GoogleDriveNodeData extends BaseNodeData {
  action: "upload" | "download" | "delete" | "list" | "share" | "move";
  fileId?: string;
  fileName?: string;
  filePath?: string;
  folderId?: string;
  shareWith?: string;
  permission?: "view" | "edit" | "comment" | "owner";
  mimeType?: string;
}

export interface GoogleSheetsNodeData extends BaseNodeData {
  action: "read" | "write" | "append" | "clear" | "create" | "update";
  spreadsheetId: string;
  sheetName?: string;
  range?: string;
  values?: any[][];
  valueInputOption?: "RAW" | "USER_ENTERED";
}

export interface NotionNodeData extends BaseNodeData {
  action: "createPage" | "updatePage" | "query" | "createDatabase";
  databaseId?: string;
  pageId?: string;
  properties?: Record<string, any>;
  filter?: Record<string, any>;
  sorts?: Array<{ property: string; direction: "ascending" | "descending" }>;
}

export interface AirtableNodeData extends BaseNodeData {
  action: "create" | "read" | "update" | "delete" | "list";
  baseId: string;
  tableName: string;
  recordId?: string;
  fields?: Record<string, any>;
  filterByFormula?: string;
  sort?: Array<{ field: string; direction: "asc" | "desc" }>;
}

export interface TrelloNodeData extends BaseNodeData {
  action:
    | "createCard"
    | "moveCard"
    | "updateCard"
    | "deleteCard"
    | "listCards"
    | "addLabel";
  boardId?: string;
  listId?: string;
  cardId?: string;
  cardName?: string;
  description?: string;
  position?: number | "top" | "bottom";
  labels?: string[];
}

export interface AsanaNodeData extends BaseNodeData {
  action:
    | "createTask"
    | "updateTask"
    | "deleteTask"
    | "listTasks"
    | "addComment";
  projectId?: string;
  taskId?: string;
  taskName?: string;
  assignee?: string;
  dueDate?: string;
  notes?: string;
}

export interface ClickUpNodeData extends BaseNodeData {
  action: "createTask" | "updateTask" | "deleteTask" | "listTasks";
  listId?: string;
  taskId?: string;
  taskName?: string;
  status?: string;
  priority?: number;
  assignees?: string[];
}

export interface CalendarNodeData extends BaseNodeData {
  action: "create" | "update" | "delete" | "list";
  provider: "google" | "outlook" | "ical" | "apple";
  eventId?: string;
  summary?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  attendees?: string[];
  location?: string;
  reminders?: Array<{ method: string; minutes: number }>;
}

// ============ FILE MANAGEMENT ============

export interface DropboxNodeData extends BaseNodeData {
  action: "upload" | "download" | "delete" | "list" | "share" | "move";
  path: string;
  filePath?: string;
  recursive?: boolean;
  shareUrl?: string;
}

export interface OneDriveNodeData extends BaseNodeData {
  action: "upload" | "download" | "delete" | "list" | "share";
  path: string;
  filePath?: string;
  shareType?: "view" | "edit";
}

export interface AWSS3NodeData extends BaseNodeData {
  action: "upload" | "download" | "delete" | "list" | "copy" | "presignedUrl";
  bucket: string;
  key: string;
  filePath?: string;
  acl?: "private" | "public-read" | "public-read-write" | "authenticated-read";
  contentType?: string;
  metadata?: Record<string, string>;
  expiresIn?: number;
}

export interface FTPSFTPNodeData extends BaseNodeData {
  action: "upload" | "download" | "delete" | "list";
  protocol: "ftp" | "sftp" | "ftps";
  host: string;
  port: number;
  username: string;
  password?: string;
  privateKey?: string;
  remotePath: string;
  localPath?: string;
  passive?: boolean;
}

// ============ DEVELOPER TOOLS ============

export interface GitHubNodeData extends BaseNodeData {
  action:
    | "createRepo"
    | "createIssue"
    | "createPR"
    | "listRepos"
    | "commit"
    | "merge";
  owner: string;
  repo?: string;
  title?: string;
  body?: string;
  branch?: string;
  baseBranch?: string;
  headBranch?: string;
  issueNumber?: number;
  prNumber?: number;
}

export interface GitLabNodeData extends BaseNodeData {
  action: "createProject" | "createIssue" | "createMR" | "triggerPipeline";
  projectId?: string;
  title?: string;
  description?: string;
  sourceBranch?: string;
  targetBranch?: string;
  ref?: string;
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
    | "comment"
    | "search";
  projectKey: string;
  issueKey?: string;
  summary?: string;
  description?: string;
  issueType?: string;
  priority?: string;
  assignee?: string;
  transitionId?: string;
  jql?: string;
}

export interface PostmanAPIRunnerNodeData extends BaseNodeData {
  collectionId: string;
  environment?: string;
  variables?: Record<string, any>;
  iterationCount?: number;
}

export interface SwaggerAPINodeData extends BaseNodeData {
  swaggerUrl: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  parameters?: Record<string, any>;
  headers?: Record<string, string>;
}

// ============ E-COMMERCE ============

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
  fulfillmentData?: Record<string, any>;
}

export interface WooCommerceNodeData extends BaseNodeData {
  action: "createProduct" | "updateProduct" | "listOrders" | "updateOrder";
  storeUrl: string;
  productId?: string;
  orderId?: string;
  productData?: Record<string, any>;
  orderData?: Record<string, any>;
}

export interface DarazNodeData extends BaseNodeData {
  action: "listProducts" | "getOrder" | "updateOrder" | "updateInventory";
  productId?: string;
  orderId?: string;
  quantity?: number;
}

export interface AmazonSellerNodeData extends BaseNodeData {
  action: "listProducts" | "updateInventory" | "getOrder" | "fulfillOrder";
  marketplaceId: string;
  sellerId: string;
  productId?: string;
  orderId?: string;
  quantity?: number;
}

export interface StripeNodeData extends BaseNodeData {
  action:
    | "createPayment"
    | "createSubscription"
    | "refund"
    | "listCustomers"
    | "createCustomer";
  amount?: number;
  currency?: string;
  customerId?: string;
  paymentIntentId?: string;
  priceId?: string;
  metadata?: Record<string, string>;
}

export interface PayPalNodeData extends BaseNodeData {
  action: "createPayment" | "capturePayment" | "refund";
  amount?: number;
  currency?: string;
  orderId?: string;
  description?: string;
}

// ============ DATABASES ============

export interface MongoDBNodeData extends BaseNodeData {
  action: "find" | "insert" | "update" | "delete" | "aggregate";
  connectionString: string;
  database: string;
  collection: string;
  query?: Record<string, any>;
  document?: Record<string, any>;
  pipeline?: any[];
  options?: Record<string, any>;
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
  ssl?: boolean;
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
  ssl?: boolean;
}

export interface RedisNodeData extends BaseNodeData {
  action: "get" | "set" | "delete" | "expire" | "keys" | "incr" | "decr";
  host: string;
  port: number;
  password?: string;
  database?: number;
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
  startAt?: any;
  endAt?: any;
}

export interface SupabaseNodeData extends BaseNodeData {
  action: "select" | "insert" | "update" | "delete" | "rpc";
  table?: string;
  columns?: string[];
  filter?: Record<string, any>;
  data?: Record<string, any>;
  rpcFunction?: string;
  params?: Record<string, any>;
}

// ============ CLOUD & INFRA ============

export interface AWSNodeData extends BaseNodeData {
  service: "ec2" | "s3" | "lambda" | "dynamodb" | "sqs" | "sns" | "cloudwatch";
  action: string;
  region: string;
  parameters?: Record<string, any>;
}

export interface GoogleCloudNodeData extends BaseNodeData {
  service: "compute" | "storage" | "pubsub" | "functions" | "bigquery";
  action: string;
  projectId: string;
  parameters?: Record<string, any>;
}

export interface AzureNodeData extends BaseNodeData {
  service: "vm" | "storage" | "functions" | "database" | "servicebus";
  action: string;
  resourceGroup: string;
  parameters?: Record<string, any>;
}

export interface DockerNodeData extends BaseNodeData {
  action: "build" | "run" | "stop" | "remove" | "logs" | "ps" | "exec";
  image?: string;
  container?: string;
  dockerfile?: string;
  buildArgs?: Record<string, string>;
  ports?: string[];
  volumes?: string[];
  command?: string[];
  env?: Record<string, string>;
}

export interface KubernetesNodeData extends BaseNodeData {
  action: "apply" | "delete" | "get" | "scale" | "rollout" | "logs";
  resourceType:
    | "pod"
    | "deployment"
    | "service"
    | "configmap"
    | "secret"
    | "ingress";
  namespace?: string;
  name?: string;
  manifest?: string;
  replicas?: number;
}

export interface CICDWebhookNodeData extends BaseNodeData {
  provider:
    | "github-actions"
    | "gitlab-ci"
    | "jenkins"
    | "circleci"
    | "bitbucket-pipelines";
  webhookUrl: string;
  branch?: string;
  parameters?: Record<string, any>;
  authentication?: {
    type: "token" | "basic";
    credentials: Record<string, string>;
  };
}

// ============ CONTROL FLOW ============

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
  caseSensitive?: boolean;
}

export interface SwitchNodeData extends BaseNodeData {
  inputField: string;
  cases: Array<{
    value: any;
    label?: string;
    outputHandle?: string;
  }>;
  defaultCase?: boolean;
  strictMatch?: boolean;
}

export interface LoopNodeData extends BaseNodeData {
  loopType: "count" | "forEach" | "while";
  iterations?: number;
  arrayVariable?: string;
  condition?: string;
  maxIterations?: number;
  breakOnError?: boolean;
}

export interface BreakNodeData extends BaseNodeData {
  condition?: string;
  returnValue?: any;
}

export interface ParallelRunNodeData extends BaseNodeData {
  branches: number;
  waitForAll?: boolean;
  timeout?: number;
  maxConcurrency?: number;
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
  backoffMultiplier?: number;
  retryCondition?: string;
  retryableErrors?: string[];
}

export interface ErrorHandlerNodeData extends BaseNodeData {
  catchErrors?: boolean;
  errorVariable?: string;
  continueOnError?: boolean;
  fallbackValue?: any;
  notifyOnError?: boolean;
}

export interface WaitForEventNodeData extends BaseNodeData {
  eventType: "webhook" | "variable" | "time" | "custom";
  eventName?: string;
  timeout?: number;
  timeoutAction?: "error" | "continue" | "skip";
}

// ============ SCHEDULING ============

export interface CronTriggerNodeData extends BaseNodeData {
  cronExpression: string;
  timezone?: string;
  enabled?: boolean;
  nextRun?: string;
}

export interface TimeDelayNodeData extends BaseNodeData {
  delayMs: number;
  unit: "ms" | "s" | "m" | "h";
}

export interface IntervalTriggerNodeData extends BaseNodeData {
  intervalMs: number;
  maxExecutions?: number;
  enabled?: boolean;
  startImmediately?: boolean;
}

export interface DateTimeFilterNodeData extends BaseNodeData {
  filterType: "before" | "after" | "between" | "dayOfWeek" | "timeRange";
  dateField: string;
  startDate?: string;
  endDate?: string;
  daysOfWeek?: number[];
  timeRange?: { start: string; end: string };
}

// ============ EVENT-BASED ============

export interface WebhookTriggerNodeData extends BaseNodeData {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  authentication?: {
    type: "none" | "basic" | "bearer" | "apiKey" | "hmac";
    credentials?: Record<string, string>;
  };
  validateSignature?: boolean;
}

export interface APITriggerNodeData extends BaseNodeData {
  endpoint: string;
  method: "GET" | "POST";
  authentication?: {
    type: "none" | "apiKey" | "oauth";
    credentials?: Record<string, string>;
  };
  pollInterval?: number;
}

export interface FileUploadTriggerNodeData extends BaseNodeData {
  uploadPath: string;
  allowedExtensions?: string[];
  maxFileSize?: number;
  validateChecksum?: boolean;
}

export interface EmailReceivedTriggerNodeData extends BaseNodeData {
  emailProvider: "gmail" | "outlook" | "imap";
  fromFilter?: string;
  subjectFilter?: string;
  pollInterval?: number;
  markAsRead?: boolean;
}

export interface DatabaseChangeTriggerNodeData extends BaseNodeData {
  databaseType: "postgres" | "mysql" | "mongodb";
  connectionString: string;
  table: string;
  changeType: "insert" | "update" | "delete";
  pollInterval?: number;
  filter?: Record<string, any>;
}

export interface NewMessageTriggerNodeData extends BaseNodeData {
  platform: "slack" | "discord" | "telegram" | "whatsapp";
  channel?: string;
  keywordFilter?: string;
  caseSensitive?: boolean;
}

// ============ DATA PROCESSING ============

export interface MergeDataNodeData extends BaseNodeData {
  mergeType:
    | "concat"
    | "union"
    | "intersect"
    | "leftJoin"
    | "rightJoin"
    | "innerJoin";
  input1: string;
  input2: string;
  joinKey?: string;
  keepDuplicates?: boolean;
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
  initialValue?: any;
}

export interface SortNodeData extends BaseNodeData {
  sortBy: string;
  order: "asc" | "desc";
  sortType: "string" | "number" | "date";
  caseSensitive?: boolean;
}

export interface GroupByNodeData extends BaseNodeData {
  groupByField: string;
  aggregations?: Array<{
    field: string;
    operation: "sum" | "count" | "avg" | "min" | "max";
    alias?: string;
  }>;
}

export interface ConvertJSONNodeData extends BaseNodeData {
  action: "parse" | "stringify";
  input: string;
  pretty?: boolean;
  validateSchema?: boolean;
  schema?: Record<string, any>;
}

export interface ConvertCSVNodeData extends BaseNodeData {
  action: "parse" | "generate";
  input: string;
  delimiter?: string;
  hasHeaders?: boolean;
  quote?: string;
}

export interface ConvertXMLNodeData extends BaseNodeData {
  action: "parse" | "generate";
  input: string;
  rootElement?: string;
  attributePrefix?: string;
}

export interface EncodeDecodeNodeData extends BaseNodeData {
  action: "encode" | "decode";
  encoding: "base64" | "uri" | "hex" | "utf8";
  input: string;
}

export interface HashGeneratorNodeData extends BaseNodeData {
  algorithm: "md5" | "sha1" | "sha256" | "sha512" | "bcrypt";
  input: string;
  salt?: string;
  iterations?: number;
}

export interface RegexExtractorNodeData extends BaseNodeData {
  pattern: string;
  input: string;
  flags?: string;
  captureGroups?: boolean;
  allMatches?: boolean;
}

// ============ UTILITY ============

export interface HTTPRequestNodeData extends BaseNodeData {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";
  url: string;
  headers?: Record<string, string>;
  body?: string;
  bodyType?: "json" | "form" | "raw" | "graphql" | "multipart";
  timeout?: number;
  retries?: number;
  authentication?: {
    type: "none" | "bearer" | "basic" | "oauth2" | "apiKey" | "digest";
    token?: string;
    username?: string;
    password?: string;
    apiKey?: string;
    apiKeyHeader?: string;
  };
  responseVariable?: string;
  followRedirects?: boolean;
  validateSSL?: boolean;
  proxy?: string;
}

export interface WebSocketNodeData extends BaseNodeData {
  action: "connect" | "send" | "receive" | "disconnect";
  url: string;
  message?: string;
  protocols?: string[];
  headers?: Record<string, string>;
  reconnect?: boolean;
}

export interface ExecuteShellCommandNodeData extends BaseNodeData {
  command: string;
  args?: string[];
  cwd?: string;
  env?: Record<string, string>;
  timeout?: number;
  shell?: boolean;
  encoding?: string;
}

export interface RunPythonScriptNodeData extends BaseNodeData {
  script: string;
  pythonPath?: string;
  args?: Record<string, any>;
  timeout?: number;
  virtualEnv?: string;
}

export interface RunJavaScriptNodeData extends BaseNodeData {
  code: string;
  context?: Record<string, any>;
  timeout?: number;
  sandbox?: boolean;
}

export interface RunNodeFunctionNodeData extends BaseNodeData {
  functionName: string;
  parameters?: Record<string, any>;
  module?: string;
}

export interface EnvironmentVariableNodeData extends BaseNodeData {
  action: "get" | "set" | "delete" | "list";
  variableName: string;
  value?: string;
  scope?: "process" | "workflow" | "global";
}

export interface ErrorLogNodeData extends BaseNodeData {
  logLevel: "error" | "warn" | "info" | "debug" | "trace";
  message: string;
  metadata?: Record<string, any>;
  destination?: "console" | "file" | "database" | "external";
}

// ============ USER MANAGEMENT ============

export interface UserRegisterNodeData extends BaseNodeData {
  email: string;
  password: string;
  username?: string;
  metadata?: Record<string, any>;
  sendVerificationEmail?: boolean;
}

export interface UserLoginNodeData extends BaseNodeData {
  email: string;
  password: string;
  rememberMe?: boolean;
  twoFactorCode?: string;
}

export interface UpdateProfileNodeData extends BaseNodeData {
  userId: string;
  updates: Record<string, any>;
  validateChanges?: boolean;
}

export interface SaveCredentialsNodeData extends BaseNodeData {
  service: string;
  credentials: Record<string, string>;
  encrypted?: boolean;
  expiresAt?: string;
}

export interface CreateProjectNodeData extends BaseNodeData {
  projectName: string;
  description?: string;
  template?: string;
  visibility?: "private" | "public";
}

export interface SaveWorkflowNodeData extends BaseNodeData {
  workflowName: string;
  workflowData: Record<string, any>;
  version?: number;
  tags?: string[];
}

export interface ExportWorkflowNodeData extends BaseNodeData {
  workflowId: string;
  format: "json" | "yaml";
  includeCredentials?: boolean;
  compress?: boolean;
}

export interface ImportWorkflowNodeData extends BaseNodeData {
  workflowData: string;
  format: "json" | "yaml";
  overwrite?: boolean;
  validateSchema?: boolean;
}

export interface ShareWorkflowNodeData extends BaseNodeData {
  workflowId: string;
  shareWith: string[];
  permission: "view" | "edit" | "execute" | "admin";
  expiresAt?: string;
}

// ============ SYSTEM CONTROL ============

export interface StartContainerNodeData extends BaseNodeData {
  containerName: string;
  image: string;
  ports?: string[];
  volumes?: string[];
  env?: Record<string, string>;
  network?: string;
}

export interface StopContainerNodeData extends BaseNodeData {
  containerName: string;
  timeout?: number;
  force?: boolean;
}

export interface RestartContainerNodeData extends BaseNodeData {
  containerName: string;
  timeout?: number;
}

export interface MonitorUsageNodeData extends BaseNodeData {
  metrics: Array<"cpu" | "memory" | "disk" | "network" | "load">;
  interval?: number;
  threshold?: Record<string, number>;
  alertOn?: "warning" | "critical";
}

export interface BackupDataNodeData extends BaseNodeData {
  backupType: "full" | "incremental" | "differential";
  destination: string;
  compression?: boolean;
  compressionLevel?: number;
  encryption?: boolean;
  retentionDays?: number;
}

export interface UpdateNodeNodeData extends BaseNodeData {
  packageName: string;
  version?: string;
  registry?: string;
  preInstallScript?: string;
  postInstallScript?: string;
}

export interface SystemHealthCheckNodeData extends BaseNodeData {
  checks: Array<"api" | "database" | "queue" | "storage" | "cache">;
  timeout?: number;
  retries?: number;
}

// ============ SECURITY ============

export interface EncryptDataNodeData extends BaseNodeData {
  algorithm: "aes-256-gcm" | "rsa" | "chacha20" | "aes-128-cbc";
  data: string;
  key?: string;
  iv?: string;
  encoding?: "base64" | "hex";
}

export interface DecryptDataNodeData extends BaseNodeData {
  algorithm: "aes-256-gcm" | "rsa" | "chacha20" | "aes-128-cbc";
  encryptedData: string;
  key?: string;
  iv?: string;
  encoding?: "base64" | "hex";
}

export interface TokenizeSensitiveInfoNodeData extends BaseNodeData {
  data: string;
  tokenType: "alphanumeric" | "numeric" | "uuid" | "format-preserving";
  storeMapping?: boolean;
  reversible?: boolean;
}

export interface SecureInputNodeData extends BaseNodeData {
  input: string;
  validationType: "email" | "url" | "phone" | "creditCard" | "ssn" | "custom";
  customPattern?: string;
  sanitize?: boolean;
  allowedTags?: string[];
}

export interface AccessPolicyNodeData extends BaseNodeData {
  resource: string;
  action: "read" | "write" | "delete" | "execute" | "admin";
  userId?: string;
  roleRequired?: string;
  ipWhitelist?: string[];
}

export interface UserRolesNodeData extends BaseNodeData {
  action: "assign" | "revoke" | "check" | "list";
  userId: string;
  role: "admin" | "user" | "viewer" | "editor" | "custom";
  customRole?: string;
}

// ============ GENERAL UTILITY ============

export interface NotificationNodeData extends BaseNodeData {
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  duration?: number;
  sound?: boolean;
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "center";
  actions?: Array<{ label: string; action: string }>;
}

export interface NoteNodeData extends BaseNodeData {
  content: string;
  color?: string;
  fontSize?: number;
  collapsed?: boolean;
  tags?: string[];
}

export interface SetVariableNodeData extends BaseNodeData {
  variableName: string;
  variableType: "string" | "number" | "boolean" | "object" | "array";
  value: string;
  scope?: "workflow" | "global" | "session";
  encrypted?: boolean;
  ttl?: number;
}

export interface ExportDataNodeData extends BaseNodeData {
  format: "json" | "csv" | "xlsx" | "xml" | "txt" | "parquet";
  fileName: string;
  data: string;
  downloadToClient?: boolean;
  saveToServer?: boolean;
  serverPath?: string;
  includeTimestamp?: boolean;
  compression?: "none" | "zip" | "gzip" | "brotli";
}

export interface ClipboardNodeData extends BaseNodeData {
  action: "copy" | "paste" | "clear";
  content?: string;
  targetVariable?: string;
  format?: "text" | "html" | "image";
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
  // Communication
  | "gmail"
  | "outlook"
  | "slack"
  | "discord"
  | "telegram"
  | "whatsappBusiness"
  | "twilioSMS"
  // Social Media
  | "twitter"
  | "instagram"
  | "facebook"
  | "linkedin"
  | "youtube"
  | "tiktok"
  // Productivity
  | "googleDrive"
  | "googleSheets"
  | "notion"
  | "airtable"
  | "trello"
  | "asana"
  | "clickup"
  | "calendar"
  // File Management
  | "dropbox"
  | "onedrive"
  | "awsS3"
  | "ftpSftp"
  // Developer Tools
  | "github"
  | "gitlab"
  | "bitbucket"
  | "jira"
  | "postmanAPIRunner"
  | "swaggerAPI"
  // E-commerce
  | "shopify"
  | "woocommerce"
  | "daraz"
  | "amazonSeller"
  | "stripe"
  | "paypal"
  // Databases
  | "mongodb"
  | "mysql"
  | "postgresql"
  | "redis"
  | "firebase"
  | "supabase"
  // Cloud & Infra
  | "aws"
  | "googleCloud"
  | "azure"
  | "docker"
  | "kubernetes"
  | "cicdWebhook"
  // Control Flow
  | "ifElse"
  | "switch"
  | "loop"
  | "break"
  | "parallelRun"
  | "delay"
  | "retry"
  | "errorHandler"
  | "waitForEvent"
  // Scheduling
  | "cronTrigger"
  | "timeDelay"
  | "intervalTrigger"
  | "dateTimeFilter"
  // Event-Based
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
  | "aiTranslation"
  | "ocrExtractor"
  | "sentimentAnalysis"
  | "dataPrediction"
  // Data Processing
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
  // Utility
  | "httpRequest"
  | "webSocket"
  | "executeShellCommand"
  | "runPythonScript"
  | "runJavaScript"
  | "runNodeFunction"
  | "environmentVariable"
  | "errorLog"
  // User Management
  | "userRegister"
  | "userLogin"
  | "updateProfile"
  | "saveCredentials"
  | "createProject"
  | "saveWorkflow"
  | "exportWorkflow"
  | "importWorkflow"
  | "shareWorkflow"
  // System Control
  | "startContainer"
  | "stopContainer"
  | "restartContainer"
  | "monitorUsage"
  | "backupData"
  | "updateNode"
  | "systemHealthCheck"
  // Security
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
  | TriggerNodeData
  | AIAgentNodeData
  | AIPromptNodeData
  | AIClassifierNodeData
  | AITextGeneratorNodeData
  | AIExtractorNodeData
  | AIDecisionMakerNodeData
  | AIPlannerNodeData
  | AIVisionNodeData
  | AISpeechNodeData
  | AITranslationNodeData
  | OCRExtractorNodeData
  | SentimentAnalysisNodeData
  | DataPredictionNodeData
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
  animated?: boolean;
  label?: string;
  data?: {
    payload?: any;
    schema?: Record<string, any>;
    isDashed?: boolean;
    condition?: string;
  };
  markerEnd?: {
    type: string;
    color?: string;
  };
};

export interface WorkflowGraph {
  nodes: WorkflowNode[];
  edges: DataEdge[];
  variables?: Record<string, any>;
  version: number;
  metadata?: {
    createdAt?: string;
    updatedAt?: string;
    author?: string;
    description?: string;
    tags?: string[];
  };
}

export interface WorkflowValidationError {
  nodeId?: string;
  edgeId?: string;
  type: "error" | "warning" | "info";
  message: string;
  code?: string;
  field?: string;
}

export interface WorkflowExecutionContext {
  workflowId: string;
  executionId: string;
  variables: Record<string, any>;
  outputs: Record<string, any>;
  errors: WorkflowValidationError[];
  startedAt: string;
  completedAt?: string;
  status: "running" | "success" | "error" | "cancelled";
}
