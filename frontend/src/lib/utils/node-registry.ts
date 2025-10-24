import type {
  NodeType,
  WorkflowNodeData,
  AIAgentNodeData,
  OpenURLNodeData,
  ClickElementNodeData,
  FillInputNodeData,
  SelectDropdownNodeData,
  UploadFileNodeData,
  DownloadFileNodeData,
  WaitForElementNodeData,
  ExtractTextNodeData,
  ExtractAttributeNodeData,
  TakeScreenshotNodeData,
  ScrollToElementNodeData,
  GoBackNodeData,
  GoForwardNodeData,
  SwitchTabNodeData,
  CloseTabNodeData,
  LoginViaFormNodeData,
  LoginViaOAuthNodeData,
  HandleCaptchaNodeData,
  CookieSaveNodeData,
  CookieLoadNodeData,
  SessionRestoreNodeData,
  LogoutNodeData,
  ScrapeTableNodeData,
  ScrapeListNodeData,
  ExtractJSONFromHTMLNodeData,
  ExtractMetadataNodeData,
  ParseDOMTreeNodeData,
  WebSearchNodeData,
  RSSFeedReaderNodeData,
  DetectURLRedirectNodeData,
  HandlePopupNodeData,
  HandleIFrameNodeData,
  DetectAndClickButtonNodeData,
  ScrollInfinitePageNodeData,
  DetectFileDownloadLinkNodeData,
  GmailNodeData,
  SlackNodeData,
  DiscordNodeData,
  TelegramNodeData,
  TwitterNodeData,
  InstagramNodeData,
  FacebookNodeData,
  LinkedInNodeData,
  YouTubeNodeData,
  GoogleDriveNodeData,
  GoogleSheetsNodeData,
  NotionNodeData,
  AirtableNodeData,
  TrelloNodeData,
  DropboxNodeData,
  AWSS3NodeData,
  GitHubNodeData,
  JiraNodeData,
  ShopifyNodeData,
  StripeNodeData,
  MongoDBNodeData,
  MySQLNodeData,
  PostgreSQLNodeData,
  RedisNodeData,
  FirebaseNodeData,
  DockerNodeData,
  KubernetesNodeData,
  IfElseNodeData,
  SwitchNodeData,
  LoopNodeData,
  BreakNodeData,
  ParallelRunNodeData,
  DelayNodeData,
  RetryNodeData,
  ErrorHandlerNodeData,
  WaitForEventNodeData,
  CronTriggerNodeData,
  WebhookTriggerNodeData,
  APITriggerNodeData,
  FileUploadTriggerNodeData,
  EmailReceivedTriggerNodeData,
  DatabaseChangeTriggerNodeData,
  NewMessageTriggerNodeData,
  AIPromptNodeData,
  AIClassifierNodeData,
  AITextGeneratorNodeData,
  AIExtractorNodeData,
  AIVisionNodeData,
  AITranslationNodeData,
  OCRExtractorNodeData,
  SentimentAnalysisNodeData,
  MergeDataNodeData,
  SplitDataNodeData,
  FilterNodeData,
  MapNodeData,
  ReduceNodeData,
  SortNodeData,
  GroupByNodeData,
  ConvertJSONNodeData,
  ConvertCSVNodeData,
  ConvertXMLNodeData,
  EncodeDecodeNodeData,
  HashGeneratorNodeData,
  RegexExtractorNodeData,
  HTTPRequestNodeData,
  WebSocketNodeData,
  ExecuteShellCommandNodeData,
  RunPythonScriptNodeData,
  RunJavaScriptNodeData,
  EnvironmentVariableNodeData,
  ErrorLogNodeData,
  UserRegisterNodeData,
  UserLoginNodeData,
  CreateProjectNodeData,
  SaveWorkflowNodeData,
  ExportWorkflowNodeData,
  StartContainerNodeData,
  StopContainerNodeData,
  MonitorUsageNodeData,
  BackupDataNodeData,
  EncryptDataNodeData,
  DecryptDataNodeData,
  SecureInputNodeData,
  AccessPolicyNodeData,
  NotificationNodeData,
  NoteNodeData,
  SetVariableNodeData,
  ExportDataNodeData,
  ClipboardNodeData,
} from "@/lib/types/workflow-nodes.types";

// ============ CONSTANTS ============
export const NODE_BG_COLOR = "#282828";
export const EDGE_COLOR = "#C2C8D5";

export type NodeCategory =
  | "Web Automation"
  | "Communication"
  | "Social Media"
  | "Productivity"
  | "File Management"
  | "Developer Tools"
  | "E-commerce"
  | "Databases"
  | "Cloud & Infra"
  | "Control Flow"
  | "Scheduling"
  | "Event-Based"
  | "AI"
  | "Data Processing"
  | "Utility"
  | "User Management"
  | "System Control"
  | "Security"
  | "General";

export interface NodeDefinition {
  type: NodeType;
  label: string;
  category: NodeCategory;
  icon: string;
  color: string;
  description: string;
  defaultData: Partial<WorkflowNodeData>;
  outputSchema?: Record<string, string>;
  inputSchema?: Record<string, string>;
  tags?: string[];
  deprecated?: boolean;
  experimental?: boolean;
}

// ============ NODE REGISTRY ============
export const NODE_REGISTRY: Record<NodeType, NodeDefinition> = {
  // ============ CORE ============
  trigger: {
    type: "trigger",
    label: "Trigger",
    category: "Event-Based",
    icon: "Play",
    color: EDGE_COLOR,
    description:
      "Start workflow execution manually, on schedule, or via webhook",
    defaultData: {
      label: "Trigger",
      type: "manual",
      enabled: true,
    } as TriggerNodeData,
    outputSchema: {
      timestamp: "string",
      source: "string",
      payload: "object",
    },
  },

  aiAgent: {
    type: "aiAgent",
    label: "AI Agent",
    category: "AI",
    icon: "Sparkles",
    color: EDGE_COLOR,
    description: "AI-powered autonomous agent for complex browser automation",
    defaultData: {
      label: "AI Agent",
      prompt: "",
      model: "gpt-4",
      maxSteps: 10,
      outputFormat: "structured",
    } as AIAgentNodeData,
    outputSchema: {
      success: "boolean",
      steps: "array",
      result: "object",
    },
  },

  // ============ WEB AUTOMATION - INTERACTION ============
  openURL: {
    type: "openURL",
    label: "Open URL",
    category: "Web Automation",
    icon: "ExternalLink",
    color: EDGE_COLOR,
    description: "Navigate to a URL and wait for page load",
    defaultData: {
      label: "Open URL",
      url: "",
      timeout: 30000,
      waitForNavigation: true,
    } as OpenURLNodeData,
    outputSchema: { url: "string", title: "string" },
  },

  clickElement: {
    type: "clickElement",
    label: "Click Element",
    category: "Web Automation",
    icon: "MousePointer",
    color: EDGE_COLOR,
    description: "Click on page elements using CSS/XPath selectors",
    defaultData: {
      label: "Click Element",
      selector: "",
      selectorType: "css",
      clickType: "single",
    } as ClickElementNodeData,
    outputSchema: { clicked: "boolean", selector: "string" },
  },

  fillInput: {
    type: "fillInput",
    label: "Fill Input",
    category: "Web Automation",
    icon: "Keyboard",
    color: EDGE_COLOR,
    description: "Type text into input fields or textareas",
    defaultData: {
      label: "Fill Input",
      selector: "",
      value: "",
      clearFirst: true,
    } as FillInputNodeData,
    outputSchema: { typed: "string" },
  },

  selectDropdown: {
    type: "selectDropdown",
    label: "Select Dropdown",
    category: "Web Automation",
    icon: "ChevronDown",
    color: EDGE_COLOR,
    description: "Select option from dropdown menus",
    defaultData: {
      label: "Select Option",
      selector: "",
      value: "",
      selectBy: "value",
    } as SelectDropdownNodeData,
    outputSchema: { selected: "string" },
  },

  uploadFile: {
    type: "uploadFile",
    label: "Upload File",
    category: "Web Automation",
    icon: "Upload",
    color: EDGE_COLOR,
    description: "Upload files to file input elements",
    defaultData: {
      label: "Upload File",
      selector: "",
      filePath: "",
      fileSource: "local",
    } as UploadFileNodeData,
    outputSchema: { uploaded: "boolean" },
  },

  downloadFile: {
    type: "downloadFile",
    label: "Download File",
    category: "Web Automation",
    icon: "Download",
    color: EDGE_COLOR,
    description: "Download files from links or buttons",
    defaultData: {
      label: "Download File",
      savePath: "./downloads",
    } as DownloadFileNodeData,
    outputSchema: { downloaded: "boolean", path: "string" },
  },

  waitForElement: {
    type: "waitForElement",
    label: "Wait For Element",
    category: "Web Automation",
    icon: "Clock",
    color: EDGE_COLOR,
    description: "Wait until element appears or changes state",
    defaultData: {
      label: "Wait For Element",
      selector: "",
      state: "visible",
      timeout: 10000,
    } as WaitForElementNodeData,
    outputSchema: { found: "boolean" },
  },

  extractText: {
    type: "extractText",
    label: "Extract Text",
    category: "Web Automation",
    icon: "FileText",
    color: EDGE_COLOR,
    description: "Extract text content from page elements",
    defaultData: {
      label: "Extract Text",
      selector: "",
      attribute: "text",
      multiple: false,
    } as ExtractTextNodeData,
    outputSchema: { text: "string" },
  },

  extractAttribute: {
    type: "extractAttribute",
    label: "Extract Attribute",
    category: "Web Automation",
    icon: "Tag",
    color: EDGE_COLOR,
    description: "Extract HTML attributes (href, src, class, etc.)",
    defaultData: {
      label: "Extract Attribute",
      selector: "",
      attribute: "href",
    } as ExtractAttributeNodeData,
    outputSchema: { value: "string" },
  },

  takeScreenshot: {
    type: "takeScreenshot",
    label: "Take Screenshot",
    category: "Web Automation",
    icon: "Camera",
    color: EDGE_COLOR,
    description: "Capture full page or element screenshots",
    defaultData: {
      label: "Take Screenshot",
      fullPage: false,
      format: "png",
    } as TakeScreenshotNodeData,
    outputSchema: { screenshot: "string", url: "string" },
  },

  scrollToElement: {
    type: "scrollToElement",
    label: "Scroll To Element",
    category: "Web Automation",
    icon: "ArrowDown",
    color: EDGE_COLOR,
    description: "Scroll page to bring element into view",
    defaultData: {
      label: "Scroll To Element",
      behavior: "smooth",
    } as ScrollToElementNodeData,
    outputSchema: { scrolled: "boolean" },
  },

  goBack: {
    type: "goBack",
    label: "Go Back",
    category: "Web Automation",
    icon: "ArrowLeft",
    color: EDGE_COLOR,
    description: "Navigate to previous page in history",
    defaultData: {
      label: "Go Back",
      waitForNavigation: true,
    } as GoBackNodeData,
    outputSchema: { navigated: "boolean" },
  },

  goForward: {
    type: "goForward",
    label: "Go Forward",
    category: "Web Automation",
    icon: "ArrowRight",
    color: EDGE_COLOR,
    description: "Navigate to next page in history",
    defaultData: {
      label: "Go Forward",
      waitForNavigation: true,
    } as GoForwardNodeData,
    outputSchema: { navigated: "boolean" },
  },

  switchTab: {
    type: "switchTab",
    label: "Switch Tab",
    category: "Web Automation",
    icon: "Layers",
    color: EDGE_COLOR,
    description: "Switch between browser tabs",
    defaultData: {
      label: "Switch Tab",
      tabIndex: 0,
    } as SwitchTabNodeData,
    outputSchema: { switched: "boolean" },
  },

  closeTab: {
    type: "closeTab",
    label: "Close Tab",
    category: "Web Automation",
    icon: "X",
    color: EDGE_COLOR,
    description: "Close active or specific browser tab",
    defaultData: {
      label: "Close Tab",
      closeAll: false,
    } as CloseTabNodeData,
    outputSchema: { closed: "boolean" },
  },

  // ============ WEB AUTHENTICATION ============
  loginViaForm: {
    type: "loginViaForm",
    label: "Login Via Form",
    category: "Web Automation",
    icon: "LogIn",
    color: EDGE_COLOR,
    description: "Automated form-based login with credentials",
    defaultData: {
      label: "Login Via Form",
      usernameSelector: "",
      passwordSelector: "",
      submitSelector: "",
      username: "",
      password: "",
    } as LoginViaFormNodeData,
    outputSchema: { loggedIn: "boolean" },
  },

  loginViaOAuth: {
    type: "loginViaOAuth",
    label: "Login Via OAuth",
    category: "Web Automation",
    icon: "Shield",
    color: EDGE_COLOR,
    description: "OAuth 2.0 authentication flow",
    defaultData: {
      label: "OAuth Login",
      provider: "google",
      clientId: "",
      clientSecret: "",
      redirectUri: "",
    } as LoginViaOAuthNodeData,
    outputSchema: { accessToken: "string" },
  },

  handleCaptcha: {
    type: "handleCaptcha",
    label: "Handle CAPTCHA",
    category: "Web Automation",
    icon: "ShieldCheck",
    color: EDGE_COLOR,
    description: "Detect and solve CAPTCHA challenges",
    defaultData: {
      label: "Handle CAPTCHA",
      captchaType: "recaptcha_v2",
    } as HandleCaptchaNodeData,
    outputSchema: { solved: "boolean" },
  },

  cookieSave: {
    type: "cookieSave",
    label: "Save Cookies",
    category: "Web Automation",
    icon: "Cookie",
    color: EDGE_COLOR,
    description: "Save browser cookies for session persistence",
    defaultData: {
      label: "Save Cookies",
      savePath: "./cookies",
    } as CookieSaveNodeData,
    outputSchema: { saved: "boolean" },
  },

  cookieLoad: {
    type: "cookieLoad",
    label: "Load Cookies",
    category: "Web Automation",
    icon: "FileInput",
    color: EDGE_COLOR,
    description: "Load saved cookies to restore session",
    defaultData: {
      label: "Load Cookies",
      loadPath: "./cookies",
    } as CookieLoadNodeData,
    outputSchema: { loaded: "boolean" },
  },

  sessionRestore: {
    type: "sessionRestore",
    label: "Restore Session",
    category: "Web Automation",
    icon: "RefreshCw",
    color: EDGE_COLOR,
    description: "Restore full browser session state",
    defaultData: {
      label: "Restore Session",
      sessionPath: "",
      includeLocalStorage: true,
    } as SessionRestoreNodeData,
    outputSchema: { restored: "boolean" },
  },

  logout: {
    type: "logout",
    label: "Logout",
    category: "Web Automation",
    icon: "LogOut",
    color: EDGE_COLOR,
    description: "Log out and clear session data",
    defaultData: {
      label: "Logout",
      clearCookies: true,
      clearLocalStorage: true,
    } as LogoutNodeData,
    outputSchema: { loggedOut: "boolean" },
  },

  // ============ DATA EXTRACTION ============
  scrapeTable: {
    type: "scrapeTable",
    label: "Scrape Table",
    category: "Web Automation",
    icon: "Table",
    color: EDGE_COLOR,
    description: "Extract data from HTML tables",
    defaultData: {
      label: "Scrape Table",
      tableSelector: "table",
      includeHeaders: true,
      outputFormat: "json",
    } as ScrapeTableNodeData,
    outputSchema: { data: "array" },
  },

  scrapeList: {
    type: "scrapeList",
    label: "Scrape List",
    category: "Web Automation",
    icon: "List",
    color: EDGE_COLOR,
    description: "Extract structured data from lists",
    defaultData: {
      label: "Scrape List",
      listSelector: "ul",
      itemSelector: "li",
      extractFields: [],
    } as ScrapeListNodeData,
    outputSchema: { items: "array" },
  },

  extractJSONFromHTML: {
    type: "extractJSONFromHTML",
    label: "Extract JSON",
    category: "Web Automation",
    icon: "Braces",
    color: EDGE_COLOR,
    description: "Parse JSON-LD or embedded JSON from HTML",
    defaultData: {
      label: "Extract JSON",
      scriptSelector: 'script[type="application/ld+json"]',
    } as ExtractJSONFromHTMLNodeData,
    outputSchema: { data: "object" },
  },

  extractMetadata: {
    type: "extractMetadata",
    label: "Extract Metadata",
    category: "Web Automation",
    icon: "Info",
    color: EDGE_COLOR,
    description: "Extract page metadata (title, description, OG tags)",
    defaultData: {
      label: "Extract Metadata",
      fields: ["title", "description", "og:image"],
    } as ExtractMetadataNodeData,
    outputSchema: { metadata: "object" },
  },

  parseDOMTree: {
    type: "parseDOMTree",
    label: "Parse DOM Tree",
    category: "Web Automation",
    icon: "TreeDeciduous",
    color: EDGE_COLOR,
    description: "Parse HTML DOM structure into traversable tree",
    defaultData: {
      label: "Parse DOM",
      depth: 5,
      includeAttributes: true,
    } as ParseDOMTreeNodeData,
    outputSchema: { tree: "object" },
  },

  webSearch: {
    type: "webSearch",
    label: "Web Search",
    category: "Web Automation",
    icon: "Search",
    color: EDGE_COLOR,
    description: "Perform web searches and extract results",
    defaultData: {
      label: "Web Search",
      searchEngine: "google",
      query: "",
      resultCount: 10,
    } as WebSearchNodeData,
    outputSchema: { results: "array" },
  },

  rssFeedReader: {
    type: "rssFeedReader",
    label: "RSS Feed Reader",
    category: "Web Automation",
    icon: "Rss",
    color: EDGE_COLOR,
    description: "Fetch and parse RSS/Atom feeds",
    defaultData: {
      label: "RSS Reader",
      feedUrl: "",
      itemCount: 20,
    } as RSSFeedReaderNodeData,
    outputSchema: { items: "array" },
  },

  // ============ WEB NAVIGATION ============
  detectURLRedirect: {
    type: "detectURLRedirect",
    label: "Detect Redirect",
    category: "Web Automation",
    icon: "Repeat",
    color: EDGE_COLOR,
    description: "Track and capture URL redirects",
    defaultData: {
      label: "Detect Redirect",
      followRedirects: true,
      maxRedirects: 5,
    } as DetectURLRedirectNodeData,
    outputSchema: { redirectChain: "array" },
  },

  handlePopup: {
    type: "handlePopup",
    label: "Handle Popup",
    category: "Web Automation",
    icon: "MessageSquare",
    color: EDGE_COLOR,
    description: "Handle browser popups and dialogs",
    defaultData: {
      label: "Handle Popup",
      action: "accept",
    } as HandlePopupNodeData,
    outputSchema: { handled: "boolean" },
  },

  handleIFrame: {
    type: "handleIFrame",
    label: "Handle iFrame",
    category: "Web Automation",
    icon: "Maximize",
    color: EDGE_COLOR,
    description: "Switch context to interact with iframes",
    defaultData: {
      label: "Handle iFrame",
      iframeSelector: "iframe",
      action: "enter",
    } as HandleIFrameNodeData,
    outputSchema: { entered: "boolean" },
  },

  detectAndClickButton: {
    type: "detectAndClickButton",
    label: "Smart Button Click",
    category: "Web Automation",
    icon: "Zap",
    color: EDGE_COLOR,
    description: "Intelligently find and click buttons by text/role",
    defaultData: {
      label: "Smart Click",
      buttonText: "",
      fuzzyMatch: true,
    } as DetectAndClickButtonNodeData,
    outputSchema: { clicked: "boolean" },
  },

  scrollInfinitePage: {
    type: "scrollInfinitePage",
    label: "Infinite Scroll",
    category: "Web Automation",
    icon: "ArrowDownCircle",
    color: EDGE_COLOR,
    description: "Handle infinite scroll pages",
    defaultData: {
      label: "Infinite Scroll",
      maxScrolls: 10,
      scrollDelay: 1000,
    } as ScrollInfinitePageNodeData,
    outputSchema: { scrollCount: "number" },
  },

  detectFileDownloadLink: {
    type: "detectFileDownloadLink",
    label: "Detect Download Link",
    category: "Web Automation",
    icon: "Link",
    color: EDGE_COLOR,
    description: "Find and validate file download links",
    defaultData: {
      label: "Detect Download",
      fileExtensions: ["pdf", "docx", "xlsx"],
    } as DetectFileDownloadLinkNodeData,
    outputSchema: { downloadUrl: "string" },
  },

  // ============ COMMUNICATION ============
  gmail: {
    type: "gmail",
    label: "Gmail",
    category: "Communication",
    icon: "Mail",
    color: EDGE_COLOR,
    description: "Send, read, and manage Gmail emails",
    defaultData: {
      label: "Gmail",
      action: "send",
      to: "",
      subject: "",
      body: "",
    } as GmailNodeData,
    outputSchema: { messageId: "string" },
  },

  slack: {
    type: "slack",
    label: "Slack",
    category: "Communication",
    icon: "Hash",
    color: EDGE_COLOR,
    description: "Send messages and interact with Slack",
    defaultData: {
      label: "Slack",
      action: "send",
      channel: "",
      message: "",
    } as SlackNodeData,
    outputSchema: { messageTs: "string" },
  },

  discord: {
    type: "discord",
    label: "Discord",
    category: "Communication",
    icon: "MessageCircle",
    color: EDGE_COLOR,
    description: "Send messages and embeds to Discord",
    defaultData: {
      label: "Discord",
      action: "send",
      channelId: "",
      message: "",
    } as DiscordNodeData,
    outputSchema: { messageId: "string" },
  },

  telegram: {
    type: "telegram",
    label: "Telegram",
    category: "Communication",
    icon: "Send",
    color: EDGE_COLOR,
    description: "Send Telegram messages and media",
    defaultData: {
      label: "Telegram",
      action: "send",
      chatId: "",
      message: "",
    } as TelegramNodeData,
    outputSchema: { messageId: "number" },
  },

  // ============ SOCIAL MEDIA ============
  twitter: {
    type: "twitter",
    label: "Twitter/X",
    category: "Social Media",
    icon: "Twitter",
    color: EDGE_COLOR,
    description: "Post tweets and interact with Twitter API",
    defaultData: {
      label: "Twitter",
      action: "tweet",
      text: "",
    } as TwitterNodeData,
    outputSchema: { tweetId: "string" },
  },

  instagram: {
    type: "instagram",
    label: "Instagram",
    category: "Social Media",
    icon: "Instagram",
    color: EDGE_COLOR,
    description: "Post images and manage Instagram content",
    defaultData: {
      label: "Instagram",
      action: "post",
      imageUrl: "",
      caption: "",
    } as InstagramNodeData,
    outputSchema: { postId: "string" },
  },

  facebook: {
    type: "facebook",
    label: "Facebook",
    category: "Social Media",
    icon: "Facebook",
    color: EDGE_COLOR,
    description: "Post to Facebook pages and groups",
    defaultData: {
      label: "Facebook",
      action: "post",
      message: "",
    } as FacebookNodeData,
    outputSchema: { postId: "string" },
  },

  linkedin: {
    type: "linkedin",
    label: "LinkedIn",
    category: "Social Media",
    icon: "Linkedin",
    color: EDGE_COLOR,
    description: "Share LinkedIn posts and updates",
    defaultData: {
      label: "LinkedIn",
      action: "post",
      text: "",
    } as LinkedInNodeData,
    outputSchema: { postId: "string" },
  },

  youtube: {
    type: "youtube",
    label: "YouTube",
    category: "Social Media",
    icon: "Youtube",
    color: EDGE_COLOR,
    description: "Upload videos and manage YouTube content",
    defaultData: {
      label: "YouTube",
      action: "upload",
      title: "",
      description: "",
    } as YouTubeNodeData,
    outputSchema: { videoId: "string" },
  },

  // ============ PRODUCTIVITY ============
  googleDrive: {
    type: "googleDrive",
    label: "Google Drive",
    category: "Productivity",
    icon: "HardDrive",
    color: EDGE_COLOR,
    description: "Upload, download, and manage Google Drive files",
    defaultData: {
      label: "Google Drive",
      action: "upload",
      fileName: "",
      filePath: "",
    } as GoogleDriveNodeData,
    outputSchema: { fileId: "string" },
  },

  googleSheets: {
    type: "googleSheets",
    label: "Google Sheets",
    category: "Productivity",
    icon: "Sheet",
    color: EDGE_COLOR,
    description: "Read and write Google Sheets data",
    defaultData: {
      label: "Google Sheets",
      action: "read",
      spreadsheetId: "",
      range: "A1:Z",
    } as GoogleSheetsNodeData,
    outputSchema: { values: "array" },
  },

  notion: {
    type: "notion",
    label: "Notion",
    category: "Productivity",
    icon: "FileText",
    color: EDGE_COLOR,
    description: "Create and query Notion databases",
    defaultData: {
      label: "Notion",
      action: "createPage",
      databaseId: "",
    } as NotionNodeData,
    outputSchema: { pageId: "string" },
  },

  airtable: {
    type: "airtable",
    label: "Airtable",
    category: "Productivity",
    icon: "Database",
    color: EDGE_COLOR,
    description: "Manage Airtable records and bases",
    defaultData: {
      label: "Airtable",
      action: "create",
      baseId: "",
      tableName: "",
    } as AirtableNodeData,
    outputSchema: { recordId: "string" },
  },

  trello: {
    type: "trello",
    label: "Trello",
    category: "Productivity",
    icon: "Trello",
    color: EDGE_COLOR,
    description: "Create and move Trello cards",
    defaultData: {
      label: "Trello",
      action: "createCard",
      listId: "",
      cardName: "",
    } as TrelloNodeData,
    outputSchema: { cardId: "string" },
  },

  // ============ FILE MANAGEMENT ============
  dropbox: {
    type: "dropbox",
    label: "Dropbox",
    category: "File Management",
    icon: "Cloud",
    color: EDGE_COLOR,
    description: "Upload and manage Dropbox files",
    defaultData: {
      label: "Dropbox",
      action: "upload",
      path: "",
      filePath: "",
    } as DropboxNodeData,
    outputSchema: { fileId: "string" },
  },

  awsS3: {
    type: "awsS3",
    label: "AWS S3",
    category: "File Management",
    icon: "CloudUpload",
    color: EDGE_COLOR,
    description: "Manage files in AWS S3 buckets",
    defaultData: {
      label: "AWS S3",
      action: "upload",
      bucket: "",
      key: "",
    } as AWSS3NodeData,
    outputSchema: { url: "string" },
  },

  // ============ DEVELOPER TOOLS ============
  github: {
    type: "github",
    label: "GitHub",
    category: "Developer Tools",
    icon: "Github",
    color: EDGE_COLOR,
    description: "Manage GitHub repos, issues, and PRs",
    defaultData: {
      label: "GitHub",
      action: "createIssue",
      owner: "",
      repo: "",
      title: "",
    } as GitHubNodeData,
    outputSchema: { issueNumber: "number" },
  },

  jira: {
    type: "jira",
    label: "Jira",
    category: "Developer Tools",
    icon: "Ticket",
    color: EDGE_COLOR,
    description: "Create and manage Jira issues",
    defaultData: {
      label: "Jira",
      action: "createIssue",
      projectKey: "",
      summary: "",
    } as JiraNodeData,
    outputSchema: { issueKey: "string" },
  },

  // ============ E-COMMERCE ============
  shopify: {
    type: "shopify",
    label: "Shopify",
    category: "E-commerce",
    icon: "ShoppingCart",
    color: EDGE_COLOR,
    description: "Manage Shopify products and orders",
    defaultData: {
      label: "Shopify",
      action: "createProduct",
      shopDomain: "",
    } as ShopifyNodeData,
    outputSchema: { productId: "string" },
  },

  stripe: {
    type: "stripe",
    label: "Stripe",
    category: "E-commerce",
    icon: "CreditCard",
    color: EDGE_COLOR,
    description: "Process Stripe payments and subscriptions",
    defaultData: {
      label: "Stripe",
      action: "createPayment",
      amount: 0,
      currency: "usd",
    } as StripeNodeData,
    outputSchema: { paymentIntentId: "string" },
  },

  // ============ DATABASES ============
  mongodb: {
    type: "mongodb",
    label: "MongoDB",
    category: "Databases",
    icon: "Database",
    color: EDGE_COLOR,
    description: "Query and update MongoDB collections",
    defaultData: {
      label: "MongoDB",
      action: "find",
      connectionString: "",
      database: "",
      collection: "",
    } as MongoDBNodeData,
    outputSchema: { documents: "array" },
  },

  mysql: {
    type: "mysql",
    label: "MySQL",
    category: "Databases",
    icon: "Database",
    color: EDGE_COLOR,
    description: "Execute MySQL queries",
    defaultData: {
      label: "MySQL",
      action: "query",
      host: "",
      database: "",
      query: "",
    } as MySQLNodeData,
    outputSchema: { rows: "array" },
  },

  postgresql: {
    type: "postgresql",
    label: "PostgreSQL",
    category: "Databases",
    icon: "Database",
    color: EDGE_COLOR,
    description: "Execute PostgreSQL queries",
    defaultData: {
      label: "PostgreSQL",
      action: "query",
      host: "",
      database: "",
      query: "",
    } as PostgreSQLNodeData,
    outputSchema: { rows: "array" },
  },

  redis: {
    type: "redis",
    label: "Redis",
    category: "Databases",
    icon: "Zap",
    color: EDGE_COLOR,
    description: "Get and set Redis cache values",
    defaultData: {
      label: "Redis",
      action: "get",
      host: "",
      key: "",
    } as RedisNodeData,
    outputSchema: { value: "string" },
  },

  firebase: {
    type: "firebase",
    label: "Firebase",
    category: "Databases",
    icon: "Flame",
    color: EDGE_COLOR,
    description: "Read and write Firebase Realtime Database",
    defaultData: {
      label: "Firebase",
      action: "read",
      path: "",
    } as FirebaseNodeData,
    outputSchema: { data: "object" },
  },

  // ============ CLOUD & INFRA ============
  docker: {
    type: "docker",
    label: "Docker",
    category: "Cloud & Infra",
    icon: "Box",
    color: EDGE_COLOR,
    description: "Build and run Docker containers",
    defaultData: {
      label: "Docker",
      action: "run",
      image: "",
    } as DockerNodeData,
    outputSchema: { containerId: "string" },
  },

  kubernetes: {
    type: "kubernetes",
    label: "Kubernetes",
    category: "Cloud & Infra",
    icon: "Cpu",
    color: EDGE_COLOR,
    description: "Deploy and manage Kubernetes resources",
    defaultData: {
      label: "Kubernetes",
      action: "apply",
      resourceType: "deployment",
      namespace: "default",
    } as KubernetesNodeData,
    outputSchema: { resourceName: "string" },
  },

  // ============ CONTROL FLOW ============
  ifElse: {
    type: "ifElse",
    label: "If / Else",
    category: "Control Flow",
    icon: "GitBranch",
    color: EDGE_COLOR,
    description: "Branch workflow based on condition",
    defaultData: {
      label: "If Condition",
      condition: "",
      operator: "equals",
    } as IfElseNodeData,
    outputSchema: { matched: "boolean" },
  },

  switch: {
    type: "switch",
    label: "Switch",
    category: "Control Flow",
    icon: "LayoutGrid",
    color: EDGE_COLOR,
    description: "Route to multiple branches by value",
    defaultData: {
      label: "Switch",
      inputField: "",
      cases: [],
    } as SwitchNodeData,
    outputSchema: { matched: "string" },
  },

  loop: {
    type: "loop",
    label: "Loop",
    category: "Control Flow",
    icon: "Repeat",
    color: EDGE_COLOR,
    description: "Iterate over array or repeat N times",
    defaultData: {
      label: "Loop",
      loopType: "forEach",
      maxIterations: 100,
    } as LoopNodeData,
    outputSchema: { iteration: "number" },
  },

  break: {
    type: "break",
    label: "Break",
    category: "Control Flow",
    icon: "StopCircle",
    color: EDGE_COLOR,
    description: "Exit loop or stop execution",
    defaultData: {
      label: "Break",
    } as BreakNodeData,
    outputSchema: { stopped: "boolean" },
  },

  parallelRun: {
    type: "parallelRun",
    label: "Parallel Run",
    category: "Control Flow",
    icon: "Workflow",
    color: EDGE_COLOR,
    description: "Execute multiple branches concurrently",
    defaultData: {
      label: "Parallel Run",
      branches: 2,
      waitForAll: true,
    } as ParallelRunNodeData,
    outputSchema: { results: "array" },
  },

  delay: {
    type: "delay",
    label: "Delay",
    category: "Control Flow",
    icon: "Clock",
    color: EDGE_COLOR,
    description: "Wait for specified duration",
    defaultData: {
      label: "Delay",
      delayType: "fixed",
      delayMs: 1000,
      unit: "ms",
    } as DelayNodeData,
    outputSchema: { waited: "number" },
  },

  retry: {
    type: "retry",
    label: "Retry",
    category: "Control Flow",
    icon: "RotateCcw",
    color: EDGE_COLOR,
    description: "Retry failed operations with backoff",
    defaultData: {
      label: "Retry",
      maxRetries: 3,
      retryDelay: 1000,
      exponentialBackoff: true,
    } as RetryNodeData,
    outputSchema: { retryCount: "number" },
  },

  errorHandler: {
    type: "errorHandler",
    label: "Error Handler",
    category: "Control Flow",
    icon: "AlertTriangle",
    color: EDGE_COLOR,
    description: "Catch and handle errors gracefully",
    defaultData: {
      label: "Error Handler",
      catchErrors: true,
      continueOnError: false,
    } as ErrorHandlerNodeData,
    outputSchema: { error: "object" },
  },

  waitForEvent: {
    type: "waitForEvent",
    label: "Wait For Event",
    category: "Control Flow",
    icon: "Hourglass",
    color: EDGE_COLOR,
    description: "Pause until external event occurs",
    defaultData: {
      label: "Wait For Event",
      eventType: "webhook",
      timeout: 300000,
    } as WaitForEventNodeData,
    outputSchema: { event: "object" },
  },

  // ============ SCHEDULING ============
  cronTrigger: {
    type: "cronTrigger",
    label: "Cron Trigger",
    category: "Scheduling",
    icon: "CalendarClock",
    color: EDGE_COLOR,
    description: "Schedule workflow with cron expression",
    defaultData: {
      label: "Cron Trigger",
      cronExpression: "0 * * * *",
      timezone: "UTC",
      enabled: true,
    } as CronTriggerNodeData,
    outputSchema: { nextRun: "string" },
  },

  // ============ EVENT-BASED ============
  webhookTrigger: {
    type: "webhookTrigger",
    label: "Webhook Trigger",
    category: "Event-Based",
    icon: "Webhook",
    color: EDGE_COLOR,
    description: "Receive HTTP webhooks to start workflow",
    defaultData: {
      label: "Webhook Trigger",
      method: "POST",
      path: "/webhook",
    } as WebhookTriggerNodeData,
    outputSchema: { body: "object", headers: "object" },
  },

  apiTrigger: {
    type: "apiTrigger",
    label: "API Trigger",
    category: "Event-Based",
    icon: "Server",
    color: EDGE_COLOR,
    description: "Trigger workflow from external API",
    defaultData: {
      label: "API Trigger",
      endpoint: "",
      method: "POST",
    } as APITriggerNodeData,
    outputSchema: { response: "object" },
  },

  fileUploadTrigger: {
    type: "fileUploadTrigger",
    label: "File Upload Trigger",
    category: "Event-Based",
    icon: "FileUp",
    color: EDGE_COLOR,
    description: "Trigger on file upload",
    defaultData: {
      label: "File Upload Trigger",
      uploadPath: "./uploads",
    } as FileUploadTriggerNodeData,
    outputSchema: { filePath: "string" },
  },

  emailReceivedTrigger: {
    type: "emailReceivedTrigger",
    label: "Email Trigger",
    category: "Event-Based",
    icon: "MailOpen",
    color: EDGE_COLOR,
    description: "Trigger when email received",
    defaultData: {
      label: "Email Trigger",
      emailProvider: "gmail",
      pollInterval: 60000,
    } as EmailReceivedTriggerNodeData,
    outputSchema: { email: "object" },
  },

  databaseChangeTrigger: {
    type: "databaseChangeTrigger",
    label: "Database Trigger",
    category: "Event-Based",
    icon: "DatabaseZap",
    color: EDGE_COLOR,
    description: "Trigger on database changes",
    defaultData: {
      label: "Database Trigger",
      databaseType: "postgres",
      table: "",
      changeType: "insert",
    } as DatabaseChangeTriggerNodeData,
    outputSchema: { change: "object" },
  },

  newMessageTrigger: {
    type: "newMessageTrigger",
    label: "Message Trigger",
    category: "Event-Based",
    icon: "MessageSquareText",
    color: EDGE_COLOR,
    description: "Trigger on new chat message",
    defaultData: {
      label: "Message Trigger",
      platform: "slack",
    } as NewMessageTriggerNodeData,
    outputSchema: { message: "object" },
  },

  // ============ AI NODES ============
  aiPrompt: {
    type: "aiPrompt",
    label: "AI Prompt",
    category: "AI",
    icon: "MessageSquare",
    color: EDGE_COLOR,
    description: "Send prompt to LLM and get response",
    defaultData: {
      label: "AI Prompt",
      model: "gpt-4",
      prompt: "",
      temperature: 0.7,
    } as AIPromptNodeData,
    outputSchema: { response: "string" },
  },

  aiClassifier: {
    type: "aiClassifier",
    label: "AI Classifier",
    category: "AI",
    icon: "ListFilter",
    color: EDGE_COLOR,
    description: "Classify text into categories",
    defaultData: {
      label: "AI Classifier",
      model: "gpt-4",
      input: "",
      categories: [],
    } as AIClassifierNodeData,
    outputSchema: { category: "string", confidence: "number" },
  },

  aiTextGenerator: {
    type: "aiTextGenerator",
    label: "AI Text Generator",
    category: "AI",
    icon: "PenTool",
    color: EDGE_COLOR,
    description: "Generate text summaries or content",
    defaultData: {
      label: "AI Text Generator",
      model: "gpt-4",
      taskType: "summary",
      input: "",
    } as AITextGeneratorNodeData,
    outputSchema: { generatedText: "string" },
  },

  aiExtractor: {
    type: "aiExtractor",
    label: "AI Extractor",
    category: "AI",
    icon: "Extract",
    color: EDGE_COLOR,
    description: "Extract structured data using AI",
    defaultData: {
      label: "AI Extractor",
      model: "gpt-4",
      input: "",
      schema: {},
    } as AIExtractorNodeData,
    outputSchema: { extracted: "object" },
  },

  aiVision: {
    type: "aiVision",
    label: "AI Vision",
    category: "AI",
    icon: "Eye",
    color: EDGE_COLOR,
    description: "Analyze images with AI vision",
    defaultData: {
      label: "AI Vision",
      model: "gpt-4-vision",
      prompt: "",
    } as AIVisionNodeData,
    outputSchema: { analysis: "string" },
  },

  aiTranslation: {
    type: "aiTranslation",
    label: "AI Translation",
    category: "AI",
    icon: "Languages",
    color: EDGE_COLOR,
    description: "Translate text between languages",
    defaultData: {
      label: "AI Translation",
      sourceLanguage: "en",
      targetLanguage: "es",
      text: "",
    } as AITranslationNodeData,
    outputSchema: { translatedText: "string" },
  },

  ocrExtractor: {
    type: "ocrExtractor",
    label: "OCR Extractor",
    category: "AI",
    icon: "ScanText",
    color: EDGE_COLOR,
    description: "Extract text from images (OCR)",
    defaultData: {
      label: "OCR",
      outputFormat: "text",
    } as OCRExtractorNodeData,
    outputSchema: { text: "string" },
  },

  sentimentAnalysis: {
    type: "sentimentAnalysis",
    label: "Sentiment Analysis",
    category: "AI",
    icon: "Smile",
    color: EDGE_COLOR,
    description: "Analyze sentiment of text",
    defaultData: {
      label: "Sentiment Analysis",
      text: "",
      outputFormat: "score",
    } as SentimentAnalysisNodeData,
    outputSchema: { sentiment: "string", score: "number" },
  },

  // ============ DATA PROCESSING ============
  mergeData: {
    type: "mergeData",
    label: "Merge Data",
    category: "Data Processing",
    icon: "Merge",
    color: EDGE_COLOR,
    description: "Combine multiple data sources",
    defaultData: {
      label: "Merge Data",
      mergeType: "concat",
      input1: "",
      input2: "",
    } as MergeDataNodeData,
    outputSchema: { merged: "array" },
  },

  splitData: {
    type: "splitData",
    label: "Split Data",
    category: "Data Processing",
    icon: "Split",
    color: EDGE_COLOR,
    description: "Split data into chunks",
    defaultData: {
      label: "Split Data",
      splitType: "chunk",
      chunkSize: 10,
    } as SplitDataNodeData,
    outputSchema: { chunks: "array" },
  },

  filter: {
    type: "filter",
    label: "Filter",
    category: "Data Processing",
    icon: "Filter",
    color: EDGE_COLOR,
    description: "Filter array by conditions",
    defaultData: {
      label: "Filter",
      conditions: [],
      logic: "AND",
    } as FilterNodeData,
    outputSchema: { filtered: "array" },
  },

  map: {
    type: "map",
    label: "Map",
    category: "Data Processing",
    icon: "Map",
    color: EDGE_COLOR,
    description: "Transform each array element",
    defaultData: {
      label: "Map",
      transformations: [],
    } as MapNodeData,
    outputSchema: { mapped: "array" },
  },

  reduce: {
    type: "reduce",
    label: "Reduce",
    category: "Data Processing",
    icon: "Minimize2",
    color: EDGE_COLOR,
    description: "Aggregate array into single value",
    defaultData: {
      label: "Reduce",
      operation: "sum",
    } as ReduceNodeData,
    outputSchema: { result: "any" },
  },

  sort: {
    type: "sort",
    label: "Sort",
    category: "Data Processing",
    icon: "ArrowUpDown",
    color: EDGE_COLOR,
    description: "Sort array by field",
    defaultData: {
      label: "Sort",
      sortBy: "",
      order: "asc",
      sortType: "string",
    } as SortNodeData,
    outputSchema: { sorted: "array" },
  },

  groupBy: {
    type: "groupBy",
    label: "Group By",
    category: "Data Processing",
    icon: "Layers",
    color: EDGE_COLOR,
    description: "Group array by field",
    defaultData: {
      label: "Group By",
      groupByField: "",
    } as GroupByNodeData,
    outputSchema: { grouped: "object" },
  },

  convertJSON: {
    type: "convertJSON",
    label: "Convert JSON",
    category: "Data Processing",
    icon: "Braces",
    color: EDGE_COLOR,
    description: "Parse or stringify JSON",
    defaultData: {
      label: "Convert JSON",
      action: "parse",
      input: "",
    } as ConvertJSONNodeData,
    outputSchema: { output: "any" },
  },

  convertCSV: {
    type: "convertCSV",
    label: "Convert CSV",
    category: "Data Processing",
    icon: "FileSpreadsheet",
    color: EDGE_COLOR,
    description: "Parse or generate CSV",
    defaultData: {
      label: "Convert CSV",
      action: "parse",
      input: "",
      delimiter: ",",
    } as ConvertCSVNodeData,
    outputSchema: { output: "any" },
  },

  convertXML: {
    type: "convertXML",
    label: "Convert XML",
    category: "Data Processing",
    icon: "FileCode",
    color: EDGE_COLOR,
    description: "Parse or generate XML",
    defaultData: {
      label: "Convert XML",
      action: "parse",
      input: "",
    } as ConvertXMLNodeData,
    outputSchema: { output: "object" },
  },

  encodeDecode: {
    type: "encodeDecode",
    label: "Encode/Decode",
    category: "Data Processing",
    icon: "Binary",
    color: EDGE_COLOR,
    description: "Encode or decode data (base64, URI, etc.)",
    defaultData: {
      label: "Encode/Decode",
      action: "encode",
      encoding: "base64",
      input: "",
    } as EncodeDecodeNodeData,
    outputSchema: { output: "string" },
  },

  hashGenerator: {
    type: "hashGenerator",
    label: "Hash Generator",
    category: "Data Processing",
    icon: "Hash",
    color: EDGE_COLOR,
    description: "Generate cryptographic hashes",
    defaultData: {
      label: "Hash Generator",
      algorithm: "sha256",
      input: "",
    } as HashGeneratorNodeData,
    outputSchema: { hash: "string" },
  },

  regexExtractor: {
    type: "regexExtractor",
    label: "Regex Extractor",
    category: "Data Processing",
    icon: "Regex",
    color: EDGE_COLOR,
    description: "Extract data using regex patterns",
    defaultData: {
      label: "Regex Extractor",
      pattern: "",
      input: "",
      allMatches: false,
    } as RegexExtractorNodeData,
    outputSchema: { matches: "array" },
  },

  // ============ UTILITY ============
  httpRequest: {
    type: "httpRequest",
    label: "HTTP Request",
    category: "Utility",
    icon: "Globe",
    color: EDGE_COLOR,
    description: "Make HTTP/REST API calls",
    defaultData: {
      label: "HTTP Request",
      method: "GET",
      url: "",
      headers: {},
    } as HTTPRequestNodeData,
    outputSchema: { status: "number", data: "object" },
  },

  webSocket: {
    type: "webSocket",
    label: "WebSocket",
    category: "Utility",
    icon: "Radio",
    color: EDGE_COLOR,
    description: "Connect to WebSocket streams",
    defaultData: {
      label: "WebSocket",
      action: "connect",
      url: "",
    } as WebSocketNodeData,
    outputSchema: { message: "string" },
  },

  executeShellCommand: {
    type: "executeShellCommand",
    label: "Shell Command",
    category: "Utility",
    icon: "Terminal",
    color: EDGE_COLOR,
    description: "Execute system shell commands",
    defaultData: {
      label: "Shell Command",
      command: "",
    } as ExecuteShellCommandNodeData,
    outputSchema: { stdout: "string", stderr: "string" },
  },

  runPythonScript: {
    type: "runPythonScript",
    label: "Python Script",
    category: "Utility",
    icon: "Code",
    color: EDGE_COLOR,
    description: "Run Python code inline",
    defaultData: {
      label: "Python Script",
      script: "",
    } as RunPythonScriptNodeData,
    outputSchema: { result: "any" },
  },

  runJavaScript: {
    type: "runJavaScript",
    label: "JavaScript",
    category: "Utility",
    icon: "Code2",
    color: EDGE_COLOR,
    description: "Execute JavaScript code",
    defaultData: {
      label: "JavaScript",
      code: "",
    } as RunJavaScriptNodeData,
    outputSchema: { result: "any" },
  },

  environmentVariable: {
    type: "environmentVariable",
    label: "Environment Variable",
    category: "Utility",
    icon: "Settings",
    color: EDGE_COLOR,
    description: "Get or set environment variables",
    defaultData: {
      label: "Env Variable",
      action: "get",
      variableName: "",
    } as EnvironmentVariableNodeData,
    outputSchema: { value: "string" },
  },

  errorLog: {
    type: "errorLog",
    label: "Error Log",
    category: "Utility",
    icon: "AlertOctagon",
    color: EDGE_COLOR,
    description: "Log errors and warnings",
    defaultData: {
      label: "Error Log",
      logLevel: "error",
      message: "",
    } as ErrorLogNodeData,
    outputSchema: { logged: "boolean" },
  },

  // ============ USER MANAGEMENT ============
  userRegister: {
    type: "userRegister",
    label: "User Register",
    category: "User Management",
    icon: "UserPlus",
    color: EDGE_COLOR,
    description: "Register new user account",
    defaultData: {
      label: "User Register",
      email: "",
      password: "",
    } as UserRegisterNodeData,
    outputSchema: { userId: "string" },
  },

  userLogin: {
    type: "userLogin",
    label: "User Login",
    category: "User Management",
    icon: "LogIn",
    color: EDGE_COLOR,
    description: "Authenticate user login",
    defaultData: {
      label: "User Login",
      email: "",
      password: "",
    } as UserLoginNodeData,
    outputSchema: { token: "string" },
  },

  createProject: {
    type: "createProject",
    label: "Create Project",
    category: "User Management",
    icon: "FolderPlus",
    color: EDGE_COLOR,
    description: "Create new automation project",
    defaultData: {
      label: "Create Project",
      projectName: "",
    } as CreateProjectNodeData,
    outputSchema: { projectId: "string" },
  },

  saveWorkflow: {
    type: "saveWorkflow",
    label: "Save Workflow",
    category: "User Management",
    icon: "Save",
    color: EDGE_COLOR,
    description: "Save workflow to database",
    defaultData: {
      label: "Save Workflow",
      workflowName: "",
      workflowData: {},
    } as SaveWorkflowNodeData,
    outputSchema: { workflowId: "string" },
  },

  exportWorkflow: {
    type: "exportWorkflow",
    label: "Export Workflow",
    category: "User Management",
    icon: "FileDown",
    color: EDGE_COLOR,
    description: "Export workflow as JSON/YAML",
    defaultData: {
      label: "Export Workflow",
      workflowId: "",
      format: "json",
    } as ExportWorkflowNodeData,
    outputSchema: { exported: "string" },
  },

  // ============ SYSTEM CONTROL ============
  startContainer: {
    type: "startContainer",
    label: "Start Container",
    category: "System Control",
    icon: "Play",
    color: EDGE_COLOR,
    description: "Start Docker container",
    defaultData: {
      label: "Start Container",
      containerName: "",
      image: "",
    } as StartContainerNodeData,
    outputSchema: { containerId: "string" },
  },

  stopContainer: {
    type: "stopContainer",
    label: "Stop Container",
    category: "System Control",
    icon: "Square",
    color: EDGE_COLOR,
    description: "Stop running container",
    defaultData: {
      label: "Stop Container",
      containerName: "",
    } as StopContainerNodeData,
    outputSchema: { stopped: "boolean" },
  },

  monitorUsage: {
    type: "monitorUsage",
    label: "Monitor Usage",
    category: "System Control",
    icon: "Activity",
    color: EDGE_COLOR,
    description: "Monitor system resource usage",
    defaultData: {
      label: "Monitor Usage",
      metrics: ["cpu", "memory"],
    } as MonitorUsageNodeData,
    outputSchema: { metrics: "object" },
  },

  backupData: {
    type: "backupData",
    label: "Backup Data",
    category: "System Control",
    icon: "HardDrive",
    color: EDGE_COLOR,
    description: "Create data backup",
    defaultData: {
      label: "Backup Data",
      backupType: "full",
      destination: "",
    } as BackupDataNodeData,
    outputSchema: { backupPath: "string" },
  },

  // ============ SECURITY ============
  encryptData: {
    type: "encryptData",
    label: "Encrypt Data",
    category: "Security",
    icon: "Lock",
    color: EDGE_COLOR,
    description: "Encrypt sensitive data",
    defaultData: {
      label: "Encrypt Data",
      algorithm: "aes-256-gcm",
      data: "",
    } as EncryptDataNodeData,
    outputSchema: { encrypted: "string" },
  },

  decryptData: {
    type: "decryptData",
    label: "Decrypt Data",
    category: "Security",
    icon: "Unlock",
    color: EDGE_COLOR,
    description: "Decrypt encrypted data",
    defaultData: {
      label: "Decrypt Data",
      algorithm: "aes-256-gcm",
      encryptedData: "",
    } as DecryptDataNodeData,
    outputSchema: { decrypted: "string" },
  },

  secureInput: {
    type: "secureInput",
    label: "Secure Input",
    category: "Security",
    icon: "ShieldCheck",
    color: EDGE_COLOR,
    description: "Validate and sanitize user input",
    defaultData: {
      label: "Secure Input",
      input: "",
      validationType: "email",
    } as SecureInputNodeData,
    outputSchema: { validated: "boolean", sanitized: "string" },
  },

  accessPolicy: {
    type: "accessPolicy",
    label: "Access Policy",
    category: "Security",
    icon: "Shield",
    color: EDGE_COLOR,
    description: "Enforce access control policies",
    defaultData: {
      label: "Access Policy",
      resource: "",
      action: "read",
    } as AccessPolicyNodeData,
    outputSchema: { allowed: "boolean" },
  },

  // ============ GENERAL ============
  notification: {
    type: "notification",
    label: "Notification",
    category: "General",
    icon: "Bell",
    color: EDGE_COLOR,
    description: "Send in-app or system notifications",
    defaultData: {
      label: "Notification",
      type: "info",
      title: "",
      message: "",
      duration: 5000,
    } as NotificationNodeData,
    outputSchema: { sent: "boolean" },
  },

  note: {
    type: "note",
    label: "Note",
    category: "General",
    icon: "StickyNote",
    color: EDGE_COLOR,
    description: "Add documentation notes to workflow",
    defaultData: {
      label: "Note",
      content: "",
      color: "#fbbf24",
    } as NoteNodeData,
    outputSchema: {},
  },

  setVariable: {
    type: "setVariable",
    label: "Set Variable",
    category: "General",
    icon: "Variable",
    color: EDGE_COLOR,
    description: "Store or update workflow variables",
    defaultData: {
      label: "Set Variable",
      variableName: "",
      variableType: "string",
      value: "",
      scope: "workflow",
    } as SetVariableNodeData,
    outputSchema: { variableName: "string", value: "any" },
  },

  exportData: {
    type: "exportData",
    label: "Export Data",
    category: "General",
    icon: "FileDown",
    color: EDGE_COLOR,
    description: "Export workflow data to file",
    defaultData: {
      label: "Export Data",
      format: "json",
      fileName: "export",
      data: "",
      downloadToClient: true,
    } as ExportDataNodeData,
    outputSchema: { filePath: "string" },
  },

  clipboard: {
    type: "clipboard",
    label: "Clipboard",
    category: "General",
    icon: "Clipboard",
    color: EDGE_COLOR,
    description: "Copy or paste from clipboard",
    defaultData: {
      label: "Clipboard",
      action: "copy",
      content: "",
    } as ClipboardNodeData,
    outputSchema: { content: "string" },
  },
};

// ============ HELPER FUNCTIONS ============

/**
 * Get node definition by type with error handling
 * @throws Error if node type not found
 */
export function getNodeDefinition(type: NodeType): NodeDefinition {
  const definition = NODE_REGISTRY[type];

  if (!definition) {
    const availableTypes = Object.keys(NODE_REGISTRY).join(", ");
    console.error(
      `[NodeRegistry] Node type "${type}" not found. Available: ${availableTypes.slice(
        0,
        200
      )}...`
    );
    throw new Error(
      `Node definition not found for type: "${type}". Check NODE_REGISTRY.`
    );
  }

  return definition;
}

/**
 * Get nodes by category
 */
export function getNodesByCategory(category: NodeCategory): NodeDefinition[] {
  return Object.values(NODE_REGISTRY).filter(
    (node) => node.category === category
  );
}

/**
 * Get all categories with node counts
 */
export function getCategoryStats(): Record<NodeCategory, number> {
  const stats: Partial<Record<NodeCategory, number>> = {};

  Object.values(NODE_REGISTRY).forEach((node) => {
    stats[node.category] = (stats[node.category] || 0) + 1;
  });

  return stats as Record<NodeCategory, number>;
}

/**
 * Check if node type exists in registry
 */
export function isValidNodeType(type: string): type is NodeType {
  return type in NODE_REGISTRY;
}

/**
 * Get all registered node types
 */
export function getAllNodeTypes(): NodeType[] {
  return Object.keys(NODE_REGISTRY) as NodeType[];
}

/**
 * Search nodes by label or description
 */
export function searchNodes(query: string): NodeDefinition[] {
  const lowerQuery = query.toLowerCase();
  return Object.values(NODE_REGISTRY).filter(
    (node) =>
      node.label.toLowerCase().includes(lowerQuery) ||
      node.description.toLowerCase().includes(lowerQuery) ||
      node.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Get fallback node definition for error recovery
 */
export function getFallbackNode(): NodeDefinition {
  return NODE_REGISTRY.trigger;
}

/**
 * Get nodes by tags
 */
export function getNodesByTags(tags: string[]): NodeDefinition[] {
  return Object.values(NODE_REGISTRY).filter((node) =>
    tags.some((tag) => node.tags?.includes(tag))
  );
}

/**
 * Get experimental nodes
 */
export function getExperimentalNodes(): NodeDefinition[] {
  return Object.values(NODE_REGISTRY).filter((node) => node.experimental);
}

/**
 * Get deprecated nodes
 */
export function getDeprecatedNodes(): NodeDefinition[] {
  return Object.values(NODE_REGISTRY).filter((node) => node.deprecated);
}

/**
 * Validate node data against schema
 */
export function validateNodeData(
  type: NodeType,
  data: Partial<WorkflowNodeData>
): { valid: boolean; errors: string[] } {
  const definition = getNodeDefinition(type);
  const errors: string[] = [];

  // Check required label
  if (!data.label || data.label.trim().length === 0) {
    errors.push("Node label is required");
  }

  // Type-specific validation can be added here
  // For now, basic validation

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Create default node data for type
 */
export function createDefaultNodeData(type: NodeType): WorkflowNodeData {
  const definition = getNodeDefinition(type);
  return {
    ...definition.defaultData,
    label: definition.label,
    enabled: true,
    executionState: "idle",
  } as WorkflowNodeData;
}

/**
 * Get node color (for consistent theming)
 */
export function getNodeColor(type: NodeType): string {
  try {
    return getNodeDefinition(type).color;
  } catch {
    return EDGE_COLOR;
  }
}

/**
 * Get node icon name
 */
export function getNodeIcon(type: NodeType): string {
  try {
    return getNodeDefinition(type).icon;
  } catch {
    return "HelpCircle";
  }
}

/**
 * Get category color (for UI grouping)
 */
export function getCategoryColor(category: NodeCategory): string {
  const categoryColors: Record<NodeCategory, string> = {
    "Web Automation": "#3b82f6",
    Communication: "#10b981",
    "Social Media": "#ec4899",
    Productivity: "#8b5cf6",
    "File Management": "#06b6d4",
    "Developer Tools": "#f59e0b",
    "E-commerce": "#22c55e",
    Databases: "#6366f1",
    "Cloud & Infra": "#0ea5e9",
    "Control Flow": "#f43f5e",
    Scheduling: "#d946ef",
    "Event-Based": "#22c55e",
    AI: "#a855f7",
    "Data Processing": "#0891b2",
    Utility: "#64748b",
    "User Management": "#84cc16",
    "System Control": "#f97316",
    Security: "#ef4444",
    General: "#94a3b8",
  };

  return categoryColors[category] || EDGE_COLOR;
}

/**
 * Get all categories
 */
export function getAllCategories(): NodeCategory[] {
  return Array.from(
    new Set(Object.values(NODE_REGISTRY).map((node) => node.category))
  );
}

/**
 * Export registry metadata for documentation
 */
export function exportRegistryMetadata() {
  return {
    totalNodes: Object.keys(NODE_REGISTRY).length,
    categories: getCategoryStats(),
    experimentalCount: getExperimentalNodes().length,
    deprecatedCount: getDeprecatedNodes().length,
    lastUpdated: new Date().toISOString(),
  };
}
