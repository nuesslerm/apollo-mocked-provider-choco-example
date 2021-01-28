export const typeDefs = `
  """This directive allows results to be deferred during execution"""
directive @defer on FIELD

"""Tells the service which mutation triggers this subscription."""
directive @aws_subscribe(
  """
  List of mutations which will trigger this subscription when they are called.
  """
  mutations: [String]
) on FIELD_DEFINITION

"""
Tells the service this field/object has access authorized by a Cognito User Pools token.
"""
directive @aws_cognito_user_pools(
  """List of cognito user pool groups which have access on this field"""
  cognito_groups: [String]
) on OBJECT | FIELD_DEFINITION

"""Directs the schema to enforce authorization on a field"""
directive @aws_auth(
  """List of cognito user pool groups which have access on this field"""
  cognito_groups: [String]
) on FIELD_DEFINITION

"""
Tells the service which subscriptions will be published to when this mutation is called. This directive is deprecated use @aws_susbscribe directive instead.
"""
directive @aws_publish(
  """
  List of subscriptions which will be published to when this mutation is called.
  """
  subscriptions: [String]
) on FIELD_DEFINITION

"""
Tells the service this field/object has access authorized by an OIDC token.
"""
directive @aws_oidc on OBJECT | FIELD_DEFINITION

"""
Tells the service this field/object has access authorized by sigv4 signing.
"""
directive @aws_iam on OBJECT | FIELD_DEFINITION

"""
Tells the service this field/object has access authorized by an API key.
"""
directive @aws_api_key on OBJECT | FIELD_DEFINITION

type Query {
  broadcast(id: ID!): Broadcast!
  buyer(id: ID, googlePlaceId: String): Buyer
  buyerUsers(buyerId: ID, userId: ID, first: Int, after: String): [BuyerUser!]!
  buyerFacets: [BuyerFacetsResponse!]
  chat(id: ID, userIds: [ID]): Chat
  chats(userId: ID, after: String, before: String, first: Int, last: Int): UserChatConnection!
  supplierChatLabels(size: Int, after: String, asBotUser: Boolean): [ChatLabelsResult!]
  message(id: ID!): Message
  messages(chatId: ID!, after: String, before: String, first: Int, last: Int): ChatMessageConnection!
  order(id: ID, referenceId: String): Order
  chatProducts(chatId: ID!): [Product!]
  exportSupplierProducts(supplierId: ID!): [Product!]!
  categoryProducts(chatId: ID!): [CategoryProducts!]!
  user(id: ID, phone: String): User
  userSearch(first: Int, after: String, query: UserSearchInput!): UserSearchResponse!
  supplier(id: ID, referenceId: String, botUserId: String): Supplier
  search(query: SearchInput!): SearchResult!
  orderSearch(query: OrderSearchInput!): OrderSearchResult!
  isUserInChat(userId: ID!, chatId: ID!): Boolean!
  bulkOrderPdf(orderIds: [ID!]!, downloadable: Boolean): String!
  productListCategories(chatId: ID!): [ProductCategory!]
  countSupplierChats(supplierEntityId: String!, labels: [String!], userId: String): Int!
  sharedBroadcastProducts(broadcastId: ID!, chatId: ID!): SharedBroadcastProducts
  blockedEmail(email: String!): BlockedEmail
  blockedEmails(first: Int, after: String): BlockedEmailConnection
  getInviteeBuyers(phone: String!): GetInviteeBuyersResponse
  chatNotificationPreferences(id: ID!): ChatNotificationPreferences
  supplierDeliverySetting(id: ID!): SupplierDeliverySetting
  supplierNewOrderCheck(order: NewOrderInput!): SupplierNewOrderCheckResult!
  supplierDeliveryDateSettings(chatId: ID!): SupplierDeliveryDateSettingsResponse
  getUnconnectedBuyerIds(buyerIds: [String!]!, supplierId: String!): GetUnconnectedBuyerIdsResult!
  checkInviteeGooglePlace(googlePlaceId: String!): Boolean!
  metaLobby(after: String, first: Int): MetaLobbyResponse
  messagesNotSentViaEmailAndChat(chatId: ID!, isSupplier: Boolean!): [MessagesFromChatResult!]!
  getLastMessageFromChat(chatId: ID!): MessagesFromChatResult
  listSubCatalogProducts(input: ListSubCatalogProductsInput!): ListSubCatalogProductsResponse
  getSubCatalog(id: ID!): GetSubCatalogResponse
  listSubCatalogs(supplierEntityId: String, first: Int, after: String): ListSubCatalogsResponse
  userChats(after: String, before: String, first: Int, last: Int, buyerId: ID): UserChatsResponse!
  transmissionEvents(ofId: ID!): [TransmissionEvent!]!
  chatSubCatalogProducts(input: ChatSubCatalogProductsInput): ChatSubCatalogProductsResponse!
  getOrderPreference(id: ID!): OrderPreference
}

type Broadcast implements Node {
  id: ID!
  message: String
  chatIds: [ID!]
  chatLabels: [String!]
  productIds: [String!]
  products(offset: Int, size: Int): [Product!]
  chats(offset: Int, size: Int): [Chat!]
  createdAt: AWSTimestamp
  status: BroadcastStatus!
  senderUserId: ID
  sender: User
  supplierEntityId: ID
  recipientCount: Int
  attachment: Attachment
}

type Product implements Node {
  id: ID!
  name: String!
  unit: String
  enabled: Boolean!
  supplierId: ID
  externalId: String
  par: String
  price: String
  category: ProductCategory
  cost: Int
  currency: String
  primaryCatalogCategory: String
  createdAt: AWSTimestamp
  inProductList: Boolean
  leadTime: Int
  cutOffTime: AWSTime
  description: String
  subCatalogs: [String!]
}

type ProductCategory implements Node {
  id: ID!
  name: String
}

interface Node {
  id: ID!
}

"""
The \`AWSTimestamp\` scalar type provided by AWS AppSync, represents the number of seconds that have elapsed since \`1970-01-01T00:00Z\`. Negative values are also accepted and these represent the number of seconds till \`1970-01-01T00:00Z\`.  Timestamps are serialized and deserialized as integers. The minimum supported timestamp value is **\`-31557014167219200\`** which corresponds to \`-1000000000-01-01T00:00Z\`. The maximum supported timestamp value is **\`31556889864403199\`** which corresponds to \`1000000000-12-31T23:59:59.999999999Z\`.
"""
scalar AWSTimestamp

"""
The \`AWSTime\` scalar type provided by AWS AppSync, represents a valid ***extended*** [ISO 8601 Time](https://en.wikipedia.org/wiki/ISO_8601#Times) string. In other words, this scalar type accepts time strings of the form \`hh:mm:ss.SSS\`.  The field after the two digit seconds field is a nanoseconds field. It can accept between 1 and 9 digits. So, for example, "**12:00:00.2**", "**12:00:00.277**" and "**12:00:00.123456789**" are all valid time strings. The seconds and nanoseconds fields are optional (the seconds field must be specified if the nanoseconds field is to be used).  This scalar type can also accept an optional [time zone offset](https://en.wikipedia.org/wiki/ISO_8601#Time_zone_designators). For example, "**12:30**", "**12:30Z**", "**12:30:24-07:00**" and "**12:30:24.500+05:30**" are all valid time strings. The time zone offset must either be \`Z\` (representing the UTC time zone) or be in the format \`±hh:mm:ss\`. The seconds field in the timezone offset will be considered valid even though it is not part of the ISO 8601 standard.
"""
scalar AWSTime

type Chat implements Node {
  id: ID!
  chatName: String
  restaurantName: String
  deliveryAddress: String
  buyer: Buyer
  supplier: User
  customerNumber: String
  messages(after: String, before: String, first: Int, last: Int): ChatMessageConnection!
  users(first: Int, after: String): ChatUserConnection!
  products: [Product!]
  additionalEmails: [String]
  enabled: Boolean!
  salesforceId: String
  status: ChatStatus!
  type: ChatType
  labels: [String!]
  supplierCustomerName: String
  isUserInChat(userId: ID!): Boolean
  subCatalogId: ID
}

type Buyer implements Node {
  id: ID!
  name: String!
  displayName: String
  referenceId: String
  isTest: Boolean
  fullAddress: String!
  addressSource: AddressSource!
  googlePlaceId: String
  latitude: Float
  longitude: Float
  city: String
  country: String
  utcOffset: Int
  deliveryComment: String
  createdAt: AWSTimestamp!
  users(first: Int, after: String): BuyerUserConnection
  profileImage: ProfileImage
}

enum AddressSource {
  google
  custom
}

type BuyerUserConnection implements Connection {
  edges: [BuyerUserEdge!]!
}

type BuyerUserEdge implements Edge {
  cursor: String!
  node: User!
}

type User implements Node {
  id: ID!
  name: String
  locale: String
  phone: String!
  image: String
  email: String
  createdAt: AWSTimestamp
  hasAcceptedTermsAndConditions: Boolean!
  pending: Boolean
  buyers(first: Int, after: String): UserBuyerConnection
  chats(after: String, before: String, first: Int, last: Int): UserChatConnection!
  businessName: String
  cutOffTime: String
  deliveryCosts: String
  minOrderAmount: String
  position: String
  contacts: [User] @deprecated(reason: "use user { paginatedContacts } instead")
  supplier: Boolean!
  chocoUser: Boolean
  suppliers: [User]
  paginatedContacts(first: Int, after: String): UserUserConnection!
  paginatedSuppliers(first: Int, after: String): UserUserConnection!
  orderPreference: OrderPreference
  supplierId: String
  botUser: Boolean
  profileImage: ProfileImage
  role: [Role]
  linkedSupplier: Supplier
  isTest: Boolean
  inviteData: InviteInfo
  translationLanguage: String
}

type UserBuyerConnection implements Connection {
  edges: [UserBuyerEdge!]!
}

type UserBuyerEdge implements Edge {
  cursor: String!
  node: Buyer!
}

interface Edge {
  cursor: String!
  node: Node!
}

interface Connection {
  edges: [Edge!]
}

type UserChatConnection implements Connection {
  edges: [UserChatEdge!]
}

type UserChatEdge implements Edge {
  cursor: String!
  node: Chat!
}

type UserUserConnection implements Connection {
  edges: [UserUserEdge!]
}

type UserUserEdge implements Edge {
  cursor: String!
  node: User!
}

type OrderPreference {
  pdf: Boolean
  xlsx: Boolean
  fax: String
  sms: String
  whatsApp: String
  welcomeNotificationSent: AWSTimestamp
}

type ProfileImage {
  uploadUrl: String
  url: String
  smallSquare: String
  mediumSquare: String
  largeSquare: String
  smallThumbnail: String
  mediumThumbnail: String
  largeThumbnail: String
}

enum Role {
  supplierSalesReps
  supplierAdmins
}

type Supplier {
  id: ID!
  referenceId: String!
  name: String!
  botUserId: String!
  isTest: Boolean
  integration: [IntegrationOption!]!
  minOrderAmount: String
  cutOffTime: String @deprecated(reason: "use SupplierDeliverySetting { cutOffTime } instead")
  deliveryCosts: String
  locale: String!
  allowCustomProducts: Boolean!
  customerNumberMandatory: Boolean
  deliveryDateMandatory: Boolean!
  phone: String
  botUser: User
  orderExportFormat: OrderExportConfigFormat
  orderExportUpload: OrderExportUploadOption
  hasEnabledCatalogProducts: Boolean!
  users(after: String, before: String, first: Int): SupplierUserConnection
  timezone: String
  defaultSubCatalog: String
  noDefaultCatalog: Boolean
  description: String
  isDiscoverable: Boolean
  coverPhoto: ProfileImage
}

union IntegrationOption = IntegrationSmsOption | IntegrationEmailOption | IntegrationFaxOption | IntegrationWhatsAppOption

type IntegrationSmsOption {
  type: IntegrationType!
  phone: String!
}

enum IntegrationType {
  sms
  email
  fax
  whatsApp
}

type IntegrationEmailOption {
  type: IntegrationType!
  emailAddress: String!
  xlsx: Boolean!
  pdf: Boolean!
}

type IntegrationFaxOption {
  type: IntegrationType!
  phone: String!
}

type IntegrationWhatsAppOption {
  type: IntegrationType!
  phone: String!
}

union OrderExportConfigFormat = OrderExportConfigCsvFormat | OrderExportConfigEdiFormat | OrderExportConfigLobsterFormat

type OrderExportConfigCsvFormat {
  type: String!
  template: String
  quotedString: Boolean
  header: Boolean
  dateFormat: String
  delimiter: String
}

type OrderExportConfigEdiFormat {
  type: String!
  template: String
  choco: OrderExportChocoEdiFormat
  supplier: OrderExportSupplierEdiFormat
}

type OrderExportChocoEdiFormat {
  qualifier: String!
  value: String!
}

type OrderExportSupplierEdiFormat {
  qualifier: String!
  value: String!
  name: String
  productIdQualifier: String
  nameReferenceQualifier: String
}

type OrderExportConfigLobsterFormat {
  type: String!
}

union OrderExportUploadOption = OrderExportChocoSftpUpload | OrderExportExternalSftpUpload | OrderExportLobsterUpload

type OrderExportChocoSftpUpload {
  type: String!
  path: String!
}

type OrderExportExternalSftpUpload {
  type: String!
  host: String!
  username: String
  password: String
  path: String!
  port: Int
  forceIPv4: Boolean
  readyTimeout: Int
  forceIPv6: Boolean
  privateKey: String
  passphrase: String
}

type OrderExportLobsterUpload {
  type: String!
  path: String!
}

type SupplierUserConnection implements Connection {
  edges: [SupplierUserEdge!]
}

type SupplierUserEdge implements Edge {
  cursor: String!
  node: User!
}

type InviteInfo {
  googlePlaceId: String
  inviterUserId: String
  googlePlaceName: String
  googleFullAddress: String
  latitude: Float
  longitude: Float
  city: String
  country: String
}

type ChatMessageConnection implements Connection {
  edges: [ChatMessageEdge!]
}

type ChatMessageEdge implements Edge {
  cursor: String!
  node: Message!
}

type Message implements Node {
  id: ID!
  body: String!
  createdAt: AWSTimestamp!
  user: User!
  order: Order
  chat: Chat!
  attachment: Attachment
  broadcastId: ID
}

type Order implements Node {
  id: ID!
  referenceId: String
  chatId: String
  orderProducts: [OrderProduct]
  body: String
  orderSupplierStatus: String
  supplier: User
  supplierRefId: String
  user: User
  restaurant: OrderRestaurant
  deliveryDate: AWSTimestamp
  createdAt: AWSTimestamp!
  confirmationTime: AWSTimestamp
  pdf(downloadable: Boolean): String
  buyer: Buyer
  chat: Chat
}

type OrderProduct {
  product: Product!
  amount: Int!
}

type OrderRestaurant implements Node {
  id: ID!
  restaurantName: String
  deliveryAddress: String
  customerNumber: String
}

union Attachment = Event | Media | BroadcastAttachment

type Event {
  eventType: EventType!
  target: [EventTarget]
}

enum EventType {
  userRemovedFromChat
  userAddedToChat
  chatNameUpdated
  chatCreated
}

union EventTarget = EventUser | EventChat

type EventUser {
  id: ID
  phone: String
  name: String
}

type EventChat {
  chatId: ID
  restaurantName: String
  chatName: String
  supplier: EventUser
}

type Media {
  url: String
  uploadUrl: String
  contentType: String
}

type BroadcastAttachment {
  media: Media
  broadcastId: String
  chatId: String
  products: [Product!]
}

type ChatUserConnection implements Connection {
  edges: [ChatUserEdge!]
}

type ChatUserEdge implements Edge {
  cursor: String!
  node: User!
}

enum ChatStatus {
  active
  archived
  pending
}

enum ChatType {
  ordering
  support
}

enum BroadcastStatus {
  draft
  processing
  sent
  archived
}

type BuyerUser {
  buyerId: String!
  userId: String!
}

type BuyerFacetsResponse {
  country: String
  cities: [CityWithOffsets!]
}

type CityWithOffsets {
  city: String
  utcOffsets: [Int]
}

type ChatLabelsResult {
  label: String
  count: Int
}

type CategoryProducts implements Node {
  id: ID!
  name: String
  products: [Product!]
}

union UserSearchResponse = UserSearchConnection | InputValidationFailure | AuthorizationFailure

type UserSearchConnection implements Connection {
  total: Int!
  edges: [UserSearchEdge!]!
  pageInfo: PageInfo!
}

type UserSearchEdge implements Edge {
  cursor: String!
  node: User!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String!
  endCursor: String!
}

type InputValidationFailure implements AppsyncResponse & AppsyncError {
  responseType: ResponseType!
  message: String
  invalidFields: [FieldValidationError!]
}

enum ResponseType {
  success
  error
}

type FieldValidationError {
  fieldName: String!
  reason: String!
}

interface AppsyncResponse {
  responseType: ResponseType!
}

interface AppsyncError {
  responseType: ResponseType!
  message: String
}

type AuthorizationFailure implements AppsyncResponse & AppsyncError {
  responseType: ResponseType!
  message: String
}

input UserSearchInput {
  keywords: String
}

type SearchResult {
  total: Int!
  hits: [SearchItem!]!
}

type SearchItem {
  id: ID!
  type: SearchEntityType!
  title: String
  description: String
  entity: SearchEntity
}

enum SearchEntityType {
  user
  chat
  message
  order
  supplier
  product
  broadcast
  buyer
}

union SearchEntity = User | Chat | Message | Order | Supplier | Product | Broadcast | Buyer

input SearchInput {
  search: String!
  type: SearchEntityType
  offset: Int
  size: Int
  filter: SearchFilter
  sort: Sort
}

input SearchFilter {
  user: UserFilter
  product: ProductFilter
  chat: ChatFilter
  broadcast: BroadcastFilter
  order: OrderFilter
  buyer: BuyerFilter
}

input UserFilter {
  isSupplier: Boolean
}

input ProductFilter {
  supplierId: String
  catalogCategory: String
  enabled: Boolean
}

input ChatFilter {
  chatName: String
  restaurantName: String
  labels: [String!]
  supplierEntityId: String
  userId: String
  additionalEmail: String
  enabled: Boolean
  buyerId: String
}

input BroadcastFilter {
  status: [BroadcastStatus]
  senderUserId: ID
  supplierEntityId: ID
}

input OrderFilter {
  startDate: AWSTimestamp
  endDate: AWSTimestamp
  status: OrderStatus
}

enum OrderStatus {
  confirmed
  created
}

input BuyerFilter {
  country: String
  city: String
  utcOffset: Int
}

input Sort {
  field: String!
  order: SortOrder!
}

enum SortOrder {
  desc
  asc
}

type OrderSearchResult {
  total: Int!
  hits: [OrderResult!]!
}

type OrderResult implements Node {
  id: ID!
  referenceId: String
  orderProducts: [OrderProduct]
  body: String
  orderSupplierStatus: String
  createdAt: AWSTimestamp
  deliveryDate: AWSTimestamp
  supplierId: String!
  chatId: String!
  userId: String!
  restaurant: OrderRestaurant
  user: User
}

input OrderSearchInput {
  fromTime: AWSTimestamp
  toTime: AWSTimestamp
  offset: Int
  size: Int
}

type SharedBroadcastProducts {
  products: [Product!]
  categories: [ProductCategory!]
  productCountInProductList: Int
}

type BlockedEmail implements Node {
  id: ID!
  email: String!
  reason: String
  createdAt: AWSTimestamp
}

type BlockedEmailConnection implements Connection {
  edges: [BlockedEmailEdge!]
}

type BlockedEmailEdge implements Edge {
  cursor: String!
  node: BlockedEmail!
}

union GetInviteeBuyersResponse = InviteeNotFound | InviteeBuyers

type InviteeNotFound implements AppsyncResponse & AppsyncError {
  responseType: ResponseType!
  message: String
}

type InviteeBuyers {
  id: ID!
  unconnectedBuyers(first: Int, after: String): UserBuyerConnection!
}

type ChatNotificationPreferences {
  id: ID!
  newOrder: ChatNotificationUserLists
}

type ChatNotificationUserLists {
  deselectedUsersList: [ID!]!
  deselectedUsers: [User!]!
  extraUsersList: [ID!]
  extraUsers: [User!]
}

type SupplierDeliverySetting {
  id: ID!
  cutOffTime: CutOffTime
  deliveryDays: [Int!]
  type: SupplierDeliverySettingType!
}

type CutOffTime {
  type: CutOffTimeType!
  time: AWSTime!
}

enum CutOffTimeType {
  strict
  flexible
}

enum SupplierDeliverySettingType {
  supplier
  chat
}

type SupplierNewOrderCheckResult {
  accept: Boolean!
  reason: String!
}

input NewOrderInput {
  id: ID
  chatId: ID!
  supplierId: ID!
  userId: ID!
  supplierRefId: ID
  body: String
  deliveryDate: AWSTimestamp
  orderProducts: [OrderProductInput]
}

input OrderProductInput {
  product: ProductInput!
  amount: Int!
}

input ProductInput {
  id: ID!
  name: String!
  enabled: Boolean
  supplierId: ID
  externalId: String
  unit: String
  par: String
  category: CategoryInput
  price: String
  cost: Int
  currency: String
  primaryCatalogCategory: String
  leadTime: Int
  cutOffTime: AWSTime
  description: String
  subCatalogs: [ID!]
}

input CategoryInput {
  id: ID!
  name: String
}

union SupplierDeliveryDateSettingsResponse = SupplierDeliveryDateSettings | SupplierNotFound | SupplierDeliverySettingsNotFound

type SupplierDeliveryDateSettings {
  timezone: String!
  cutOffTime: CutOffTime
  deliveryDates: [AWSDate!]
}

"""
The \`AWSDate\` scalar type provided by AWS AppSync, represents a valid ***extended*** [ISO 8601 Date](https://en.wikipedia.org/wiki/ISO_8601#Calendar_dates) string. In other words, this scalar type accepts date strings of the form \`YYYY-MM-DD\`.  The scalar can also accept "negative years" of the form \`-YYYY\` which correspond to years before \`0000\`. For example, "**-2017-05-01**" and "**-9999-01-01**" are both valid dates.  This scalar type can also accept an optional [time zone offset](https://en.wikipedia.org/wiki/ISO_8601#Time_zone_designators). For example, "**1970-01-01**", "**1970-01-01Z**", "**1970-01-01-07:00**" and "**1970-01-01+05:30**" are all valid dates. The time zone offset must either be \`Z\` (representing the UTC time zone) or be in the format \`±hh:mm:ss\`. The seconds field in the timezone offset will be considered valid even though it is not part of the ISO 8601 standard.
"""
scalar AWSDate

type SupplierNotFound implements AppsyncResponse & AppsyncError {
  responseType: ResponseType!
  message: String
}

type SupplierDeliverySettingsNotFound implements AppsyncResponse & AppsyncError {
  responseType: ResponseType!
  message: String
}

union GetUnconnectedBuyerIdsResult = UnconnectedBuyers | NoUnconnectedBuyers

type UnconnectedBuyers {
  buyerIds: [String!]!
}

type NoUnconnectedBuyers implements AppsyncResponse & AppsyncError {
  responseType: ResponseType!
  message: String
}

union MetaLobbyResponse = MetaLobbyResult | InvalidCursor

type MetaLobbyResult {
  buyers: UserLobbyBuyerConnection!
  others: [String!]
}

type UserLobbyBuyerConnection implements Connection {
  edges: [UserLobbyBuyerEdge!]
}

type UserLobbyBuyerEdge implements Edge {
  cursor: String!
  node: LobbyBuyer!
}

type LobbyBuyer implements Node {
  id: ID!
  buyer: Buyer!
  chatIds: [String!]!
}

type InvalidCursor implements AppsyncResponse & AppsyncError {
  responseType: ResponseType!
  message: String
}

type MessagesFromChatResult {
  id: String!
  body: String!
  chatId: String!
  createdAt: AWSTimestamp!
  userId: String!
  orderId: String
  supplierOptIn: Boolean
  status: MessageStatus
  media: Boolean
  recipients: [String]
  mediaContentType: String
  type: MessageType
  event: MessageEvent
  broadcastId: String
}

enum MessageStatus {
  delivered
  readyForDelivery
  pendingAttachment
}

enum MessageType {
  text
  media
  orderConfirmation
  broadcast
  event
}

type MessageEvent {
  eventType: String!
  target: [EventTarget]
}

union ListSubCatalogProductsResponse = ProductSearchResult | ListSubCatalogProductsError

type ProductSearchResult {
  total: Int!
  hits: [Product!]!
}

type ListSubCatalogProductsError implements AppsyncResponse & AppsyncError {
  responseType: ResponseType!
  message: String
}

input ListSubCatalogProductsInput {
  subCatalogId: ID!
  search: String
  filter: ProductFilter
  sort: Sort
  offset: Int
  size: Int
}

union GetSubCatalogResponse = SubCatalog | NotFoundError

type SubCatalog implements Node {
  id: ID!
  name: String!
  supplierEntityId: String!
}

type NotFoundError implements AppsyncResponse & AppsyncError {
  responseType: ResponseType!
  message: String
}

union ListSubCatalogsResponse = SubCatalogConnection | ValidationError

type SubCatalogConnection implements Connection {
  edges: [SubCatalogEdge!]!
}

type SubCatalogEdge implements Edge {
  cursor: String!
  node: SubCatalog!
}

type ValidationError implements AppsyncResponse & AppsyncError {
  responseType: ResponseType!
  message: String
  invalidFields: [FieldValidationError!]
}

union UserChatsResponse = UserChatConnection | UserChatsError

type UserChatsError implements AppsyncResponse & AppsyncError {
  responseType: ResponseType!
  message: String
}

type TransmissionEvent implements Node {
  id: ID!
  ofId: ID!
  ofIdType: TransmissionOfType!
  to: String!
  toType: TransmissionToType!
  newState: String!
  isDeliveryEvent: Boolean
  isFailureEvent: Boolean
  timestamp: AWSDateTime!
  metaData: AWSJSON
}

enum TransmissionOfType {
  order
}

enum TransmissionToType {
  email
  sms
  whatsapp
}

"""
The \`AWSDateTime\` scalar type provided by AWS AppSync, represents a valid ***extended*** [ISO 8601 DateTime](https://en.wikipedia.org/wiki/ISO_8601#Combined_date_and_time_representations) string. In other words, this scalar type accepts datetime strings of the form \`YYYY-MM-DDThh:mm:ss.SSSZ\`.  The scalar can also accept "negative years" of the form \`-YYYY\` which correspond to years before \`0000\`. For example, "**-2017-01-01T00:00Z**" and "**-9999-01-01T00:00Z**" are both valid datetime strings.  The field after the two digit seconds field is a nanoseconds field. It can accept between 1 and 9 digits. So, for example, "**1970-01-01T12:00:00.2Z**", "**1970-01-01T12:00:00.277Z**" and "**1970-01-01T12:00:00.123456789Z**" are all valid datetime strings.  The seconds and nanoseconds fields are optional (the seconds field must be specified if the nanoseconds field is to be used).  The [time zone offset](https://en.wikipedia.org/wiki/ISO_8601#Time_zone_designators) is compulsory for this scalar. The time zone offset must either be \`Z\` (representing the UTC time zone) or be in the format \`±hh:mm:ss\`. The seconds field in the timezone offset will be considered valid even though it is not part of the ISO 8601 standard.
"""
scalar AWSDateTime

"""
The \`AWSJSON\` scalar type provided by AWS AppSync, represents a JSON string that complies with [RFC 8259](https://tools.ietf.org/html/rfc8259).  Maps like "**{\\"upvotes\\": 10}**", lists like "**[1,2,3]**", and scalar values like "**\\"AWSJSON example string\\"**", "**1**", and "**true**" are accepted as valid JSON and will automatically be parsed and loaded in the resolver mapping templates as Maps, Lists, or Scalar values rather than as the literal input strings.  Invalid JSON strings like "**{a: 1}**", "**{'a': 1}**" and "**Unquoted string**" will throw GraphQL validation errors.
"""
scalar AWSJSON

union ChatSubCatalogProductsResponse = ChatNotFoundError | ValidationError | ChatSubCatalogProductsError | ProductSearchResult

type ChatNotFoundError implements AppsyncResponse & AppsyncError {
  responseType: ResponseType!
  message: String
}

type ChatSubCatalogProductsError implements AppsyncResponse & AppsyncError {
  responseType: ResponseType!
  message: String
}

input ChatSubCatalogProductsInput {
  chatId: ID!
  search: String
  filter: ProductFilter
  sort: Sort
  offset: Int
  size: Int
}

type Mutation {
  addLabelToChats(label: String!, chatIds: [ID!]!): Boolean!
  removeLabelFromChats(label: String!, chatIds: [ID!]!): Boolean!
  broadcastCreate(broadcastInput: BroadcastInput!): Broadcast!
  broadcastUpdate(id: ID!, broadcastInput: BroadcastInput!): Broadcast!
  buyerCreate(buyer: BuyerCreateInput!): Buyer!
  buyerUpdate(id: ID!, buyer: BuyerUpdateInput!): Buyer!
  buyerAddUser(buyerId: ID!, userId: ID!): BuyerUser!
  buyerRemoveUser(buyerId: ID!, userId: ID!): BuyerUser!
  createProfile(user: CreateProfileInput!): CreateProfileResponse!
  batchUpdateOrderSupplier(input: BatchUpdateOrderSupplierInput!): BatchUpdateOrderSupplier
  chatUpdateMainSupplier(chatId: ID!, supplierId: ID!): Boolean!
  chatMainSupplierMigrate(chatId: ID!, supplierUserId: ID!): Boolean!
  chatCreate(chat: ChatCreateInput!): Chat!
  supplierInviteUsers(phoneNumbers: [String!]!, chat: ChatInviteInput!): SupplierInviteUserResponse!
  chatDisable(id: ID!): Boolean!
  updateChatEnabled(id: ID!, enabled: Boolean!): Boolean!
  chatInviteUsers(id: ID!, userIds: [ID]!): Chat!
  chatRemoveUsers(id: ID!, userIds: [ID!]!): Chat!
  chatLeave(id: ID!): ID
  chatUpdate(id: ID!, chat: ChatUpdateInput!): Chat!
  messageCreate(chatId: ID!, message: MessageInput!, order: OrderInput, senderId: String): Message!
  notificationCreate(userId: ID!, messageId: ID!): Notification
  notificationPreferencesUpdate(input: NotificationPreferencesInput): NotificationPreferences
  updateNotificationUserId(oldUserId: ID!, newUserId: ID!): NotificationPreferences
  createPushEndpoint(input: CreatePushEndpointInput): PushEndpointResponse
  orderConfirm(id: ID!): Message
  batchOrderConfirm(ids: [ID!]!): BatchOrderConfirmResponse
  orderCreate(chatId: ID!, order: OrderInput!): Order!
  productCreate(chatId: ID!, product: ProductInput!): Product!
  createSupplierProduct(product: ProductInput!): Product!
  deleteSupplierProduct(ids: [ID!]): [ID!]
  deleteEntireSupplierProduct(id: ID!): Int
  updateSupplierProduct(id: ID!, fieldName: String!, fieldValue: String!): Product!
  productSort(chatId: ID!, ids: [ID]!): [ID]!
  productDelete(chatId: ID, ids: [ID]!): [ID]!
  productUpdate(chatId: ID, id: ID!, fieldName: String!, fieldValue: String!): Product!
  productUpdateExternalId(id: ID!, externalId: String!, chatId: String): Product!
  productBatchCreate(chatId: ID!, products: [AdminProductInput!], dryRun: Boolean, enableCatalogProducts: Boolean): String!
  importSupplierProducts(supplierId: ID!, products: [AdminProductInput!], csv: String, dryRun: Boolean!): ImportSupplierProductsReport!
  contactsCreate(numbers: [String]): [User]
  userCreate(user: UserCreateInput!): User
  userUpdate(user: UserUpdateInput!): User
  userLeadCreate(userLead: UserLeadInput!): UserLead
  userAddRole(userId: String!, role: Role!): User
  deleteProfileImage(userId: ID!): User
  userRemoveRole(userId: String!, role: Role!): User
  inviteNonChocoUserToChat(phoneNumbers: [String!]!, chatId: ID!): Chat
  inviteUsers(phoneNumbers: [String!]!, chat: ChatInviteInput!): [String] @deprecated(reason: "use supplierInviteUsers mutation instead")
  categoryCreate(chatId: ID!, category: CategoryInput!): ProductCategory!
  categoryProductSort(chatId: ID!, categorizedProductList: [ProductsCategoryInput!]!): [CategoryProducts!]!
  categoryDelete(chatId: ID!, categoryIds: [ID!]!): [ID]!
  supplierCreate(supplier: SupplierCreateInput!): Supplier!
  supplierUpdate(supplier: SupplierUpdateInput!): Supplier!
  productUpdateCategory(chatId: ID!, productId: ID!, categoryId: ID!): UpdatedCategoryProduct!
  categoryUpdate(chatId: ID!, category: CategoryInput!): ProductCategory!
  addCatalogProductsToProductList(chatId: ID!, supplierId: ID, catalogProductList: [ProductsCategoryInput!]!): [CategoryProducts!]!
  shortenUrl(longUrl: String!): String!
  orderExportConfigCreate(supplierId: ID!, orderConfig: OrderExportConfigCreateInput!): OrderExportConfig!
  orderExportConfigUpdate(supplierId: ID!, orderConfig: OrderExportConfigUpdateInput!): OrderExportConfig!
  supplierRemoveUser(userId: String!): User!
  addUserToChats(userId: ID!, chatIds: [ID!]!): Boolean!
  activateChat(chatId: ID!, buyerId: ID!): ActivateChatResponse!
  removeCCEmailFromChats(email: AWSEmail!): RemoveCCEmailFromChatsReport!
  removeBlockedEmail(email: String!): Int
  updateChatNotificationPreferences(input: ChatNotificationInput): ChatNotificationPreferences
  updateSupplierDeliverySetting(input: SupplierDeliverySettingInput!): SupplierDeliverySetting
  orderCreateV2(chatId: ID!, order: OrderInput!): OrderCreatedResponse
  removeUserFromChats(userId: ID!, chatIds: [ID!]!): Boolean!
  updateSubCatalog(id: ID!, name: String!): updateSubCatalogResponse
  createSubCatalog(name: String!, supplierEntityId: String): createSubCatalogResponse
  userConfirm(phone: String!, newUserPool: Boolean!): Boolean!
  uploadSubCatalogProducts(subCatalogId: ID!, csv: String!): UploadSubCatalogProductsResponse!
}

input BroadcastInput {
  message: String
  chatIds: [ID!]
  chatLabels: [String!]
  productIds: [String!]
  sendToAll: Boolean
  status: BroadcastStatus!
  media: Boolean
  mediaContentType: String
}

input BuyerCreateInput {
  name: String!
  displayName: String
  fullAddress: String!
  addressSource: AddressSource!
  googlePlaceId: String
  latitude: Float
  longitude: Float
  city: String
  country: String
  utcOffset: Int
  deliveryComment: String
  isTest: Boolean
}

input BuyerUpdateInput {
  name: String
  displayName: String
  fullAddress: String
  addressSource: AddressSource
  googlePlaceId: String
  latitude: Float
  longitude: Float
  city: String
  country: String
  utcOffset: Int
  deliveryComment: String
  isTest: Boolean
}

union CreateProfileResponse = User | BuyerExists | CreateProfileError

type BuyerExists {
  message: String
}

type CreateProfileError implements AppsyncResponse & AppsyncError {
  responseType: ResponseType!
  message: String
}

input CreateProfileInput {
  id: String!
  phone: String
  email: String
  name: String
  businessName: String
  position: String
}

type BatchUpdateOrderSupplier {
  chatId: String
  supplierId: String
  orderCount: Int
}

input BatchUpdateOrderSupplierInput {
  chatId: String!
  supplierId: String!
  supplierRefId: String!
  supplierPhone: String!
}

input ChatCreateInput {
  userIds: [ID]!
  chatName: String
  restaurantName: String
  deliveryAddress: String
  buyerId: ID
  supplierId: ID
  customerNumber: String
  additionalEmails: [String]
  status: ChatStatus
  salesforceId: String
  type: ChatType
  products: [AdminProductInput!]
  supplierCustomerName: String
  labels: [String!]
  subCatalogId: ID
}

input AdminProductInput {
  name: String
  enabled: Boolean
  supplierId: ID
  externalId: ID
  unit: String
  par: String
  category: String
  price: String
  cost: String
  currency: String
  primaryCatalogCategory: String
  leadTime: Int
  cutOffTime: AWSTime
  description: String
  subCatalogs: [ID!]
}

type SupplierInviteUserResponse {
  chatUsers: [ChatUser]!
  inviteResponse: [SupplierInviteResponseEntity]!
}

type ChatUser {
  userId: String
  chatId: String
}

union SupplierInviteResponseEntity = User | Chat | InvalidInvitedPhoneNumber

type InvalidInvitedPhoneNumber implements AppsyncResponse & AppsyncError {
  responseType: ResponseType!
  message: String
}

input ChatInviteInput {
  userName: String
  smsMessage: String
  restaurantName: String
  deliveryAddress: String
  customerNumber: String
  googlePlaceId: String
  googlePlaceName: String
  googlefullAddress: String
  latitude: Float
  longitude: Float
  city: String
  country: String
  state: String
  street: String
  postalCode: String
  utcOffset: Int
  products: [AdminProductInput!]
  labels: [String!]
  teamMembers: [String!]
  subCatalogId: ID
}

input ChatUpdateInput {
  chatName: String
  restaurantName: String
  deliveryAddress: String
  supplierId: ID
  customerNumber: String
  additionalEmails: [String]
  status: ChatStatus
  salesforceId: String
  labels: [String!]
  subCatalogId: ID
  buyerId: ID
}

input MessageInput {
  id: ID!
  body: String!
  supplierOptIn: Boolean
  media: Boolean
  mediaContentType: String
  type: String
  broadcastId: String
}

input OrderInput {
  id: ID
  body: String
  deliveryDate: AWSTimestamp
  orderProducts: [OrderProductInput]
}

type Notification implements Node {
  id: ID!
  userId: ID!
  message: Message!
}

type NotificationPreferences {
  message: Boolean
  order: Boolean
}

input NotificationPreferencesInput {
  type: String!
  token: String!
  message: Boolean!
  order: Boolean!
}

union PushEndpointResponse = NotificationPreferences

input CreatePushEndpointInput {
  type: PushNotificationPlatform!
  token: String!
  message: Boolean!
  order: Boolean!
}

enum PushNotificationPlatform {
  android
  ios
}

union BatchOrderConfirmResponse = BatchOrderConfirmSuccess | BatchOrderConfirmError

type BatchOrderConfirmSuccess implements AppsyncResponse {
  responseType: ResponseType!
}

type BatchOrderConfirmError implements AppsyncResponse & AppsyncError {
  responseType: ResponseType!
  message: String
}

type ImportSupplierProductsReport {
  new: Int
  disabled: Int
  invalid: Int
  updated: Int
  unchanged: Int
}

input UserCreateInput {
  id: String!
  phone: String!
  name: String!
  email: String
  image: String
  businessName: String
  cutOffTime: String
  deliveryCosts: String
  minOrderAmount: String
  position: String
  chocoUser: Boolean!
  supplier: Boolean!
  locale: String
  orderPreference: OrderPreferenceInput
  supplierId: String
  botUser: Boolean
  isTest: Boolean
  pending: Boolean
  translationLanguage: String
}

input OrderPreferenceInput {
  pdf: Boolean
  xlsx: Boolean
  fax: String
  sms: String
  whatsApp: String
  welcomeNotificationSent: AWSTimestamp
}

input UserUpdateInput {
  id: String!
  phone: String
  email: String
  name: String
  image: String
  businessName: String
  cutOffTime: String
  deliveryCosts: String
  minOrderAmount: String
  position: String
  chocoUser: Boolean
  supplier: Boolean
  locale: String
  hasAcceptedTermsAndConditions: Boolean
  orderPreference: OrderPreferenceInput
  supplierId: String
  isTest: Boolean
  translationLanguage: String
}

type UserLead {
  phoneNumber: String!
  requests: [UserLeadRequest]
  requestCount: Int
}

type UserLeadRequest {
  createdAt: AWSTimestamp!
  name: String
  companyName: String
  role: String
  email: String
  referrer: String
}

input UserLeadInput {
  phoneNumber: String!
  name: String
  companyName: String
  role: String
  email: String
  referrer: String
}

input ProductsCategoryInput {
  id: ID!
  name: String
  productIds: [ID!]!
}

input SupplierCreateInput {
  id: String!
  name: String!
  integration: [IntegrationOptionInput!]!
  locale: String!
  cutOffTime: String
  deliveryCosts: String
  isTest: Boolean
  minOrderAmount: String
  allowCustomProducts: Boolean
  customerNumberMandatory: Boolean
  deliveryDateMandatory: Boolean
  phone: String
  timezone: String
  defaultSubCatalog: String
  noDefaultCatalog: Boolean
  description: String
  isDiscoverable: Boolean
}

input IntegrationOptionInput {
  sms: IntegrationSmsOptionInput
  email: IntegrationEmailOptionInput
  fax: IntegrationFaxOptionInput
  whatsApp: IntegrationWhatsAppOptionInput
}

input IntegrationSmsOptionInput {
  type: IntegrationType!
  phone: String!
}

input IntegrationEmailOptionInput {
  type: IntegrationType!
  emailAddress: String!
  xlsx: Boolean!
  pdf: Boolean!
}

input IntegrationFaxOptionInput {
  type: IntegrationType!
  phone: String!
}

input IntegrationWhatsAppOptionInput {
  type: IntegrationType!
  phone: String!
}

input SupplierUpdateInput {
  id: String!
  name: String!
  integration: [IntegrationOptionInput!]!
  locale: String!
  cutOffTime: String
  deliveryCosts: String
  isTest: Boolean
  minOrderAmount: String
  allowCustomProducts: Boolean
  customerNumberMandatory: Boolean
  deliveryDateMandatory: Boolean
  phone: String
  timezone: String
  defaultSubCatalog: String
  noDefaultCatalog: Boolean
  description: String
  isDiscoverable: Boolean
}

type UpdatedCategoryProduct {
  categoryId: ID!
  productId: ID!
}

type OrderExportConfig {
  orderExportFormat: OrderExportConfigFormat!
  orderExportUpload: OrderExportUploadOption!
}

input OrderExportConfigCreateInput {
  orderExportFormat: OrderExportFormatInput!
  orderExportUpload: OrderExportUploadInput
}

input OrderExportFormatInput {
  edi: OrderExportEdiFormatInput
  csv: OrderExportCsvFormatInput
  lobster: OrderExportLobsterFormatInput
}

input OrderExportEdiFormatInput {
  template: OrderExportEdiTemplateOptions!
  choco: OrderExportChocoEdiFormatInput
  supplier: OrderExportSupplierEdiFormatInput
}

enum OrderExportEdiTemplateOptions {
  CharliceProduceEdi
  UsFoodsEdi
  CustomEdi
}

input OrderExportChocoEdiFormatInput {
  qualifier: String!
  value: String!
}

input OrderExportSupplierEdiFormatInput {
  qualifier: String!
  value: String!
  name: String
  productIdQualifier: String
  nameReferenceQualifier: String
}

input OrderExportCsvFormatInput {
  template: OrderExportCsvTemplateOptions!
}

enum OrderExportCsvTemplateOptions {
  StandardCsv
  NECSCsv
}

input OrderExportLobsterFormatInput {
  path: String!
}

input OrderExportUploadInput {
  chocoSftp: OrderExportChocoSftpUploadInput
  externalSftp: OrderExportExternalSftpUploadInput
}

input OrderExportChocoSftpUploadInput {
  path: String!
}

input OrderExportExternalSftpUploadInput {
  host: String!
  username: String!
  password: String
  path: String!
  port: Int
  forceIPv4: Boolean
  readyTimeout: Int
  forceIPv6: Boolean
  privateKey: String
  passphrase: String
}

input OrderExportConfigUpdateInput {
  orderExportFormat: OrderExportFormatInput
  orderExportUpload: OrderExportUploadInput
}

union ActivateChatResponse = Chat

type RemoveCCEmailFromChatsReport {
  numberOfChatsUpdated: Int!
}

"""
The \`AWSEmail\` scalar type provided by AWS AppSync, represents an Email address string that complies with [RFC 822](https://www.ietf.org/rfc/rfc822.txt). For example, "**username@example.com**" is a valid Email address.
"""
scalar AWSEmail

input ChatNotificationInput {
  id: ID!
  newOrder: ChatNotificationUserListsInput
}

input ChatNotificationUserListsInput {
  deselectedUsersList: [ID!]!
  extraUsersList: [ID!]
}

input SupplierDeliverySettingInput {
  id: ID!
  cutOffTime: CutOffTimeInput
  deliveryDays: [Int!]
  type: SupplierDeliverySettingType!
}

input CutOffTimeInput {
  type: CutOffTimeType!
  time: AWSTime!
}

union OrderCreatedResponse = Order | OrderCreatedError

type OrderCreatedError implements AppsyncResponse & AppsyncError {
  responseType: ResponseType!
  message: String
}

union updateSubCatalogResponse = SubCatalog | UpdateSubCatalogError

type UpdateSubCatalogError implements AppsyncResponse & AppsyncError {
  responseType: ResponseType!
  message: String
}

union createSubCatalogResponse = SubCatalog | CreateSubCatalogError

type CreateSubCatalogError implements AppsyncResponse & AppsyncError {
  responseType: ResponseType!
  message: String
}

union UploadSubCatalogProductsResponse = UploadSubCatalogProductsResult | UploadSubCatalogProductsError

type UploadSubCatalogProductsResult {
  success: Boolean!
  submittedProductsCount: Int!
}

type UploadSubCatalogProductsError implements AppsyncResponse & AppsyncError {
  responseType: ResponseType!
  message: String
}

type Subscription {
  onNotificationCreate(userId: ID): Notification
}

type Contact {
  phone: String!
  ownerId: ID!
  user: User!
  Image: String
}

type ProductConnection implements Connection {
  edges: [ProductEdge!]!
}

type ProductEdge implements Edge {
  cursor: String!
  node: Product!
}
`