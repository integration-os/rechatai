export const baseCaveats = {
  activecampaign: [
    "ActiveCampaign currently has a bug where any limit other than 20 does not work.",
    "ActiveCampaign currently has a bug where any limit other than 20 does not work.",
    "Pagination through the cursor query parameter must be handled by the client. You must handle the offset manually (?cursor=20,{{offset}}).",
    "ActiveCampaign does not support filters for this endpoint.",
    "ActiveCampaign currently has a bug where any limit other than 20 does not work.",
    "Pagination through the cursor query parameter must be handled by the client. You must handle the offset manually (?cursor=20,{{offset}}).",
  ],
  airtable: [
    "Databases - GetMany: Limit is fixed at 1000 for pagination.",
    "Tables - GetMany: databaseId needs to be passed as a queryParameter.",
    "Tables - Create: databaseId needs to be passed as a queryParameter.",
    "Tables - Update: databaseId needs to be passed as a queryParameter.",
    "Attributes - Create: databaseId & tableId needs to be passed as a queryParameter.",
    "Attributes - Update: databaseId & tableId needs to be passed as a queryParameter.",
    "Records - GetMany: databaseId & tableId needs to be passed as a queryParameter.",
    "Records - GetOne: databaseId & tableId needs to be passed as a queryParameter.",
    "Records - Create: databaseId & tableId needs to be passed as a queryParameter.",
    "Records - Update: databaseId & tableId needs to be passed as a queryParameter.",
    "Records - Delete: databaseId & tableId needs to be passed as a queryParameter.",
    "Webhooks - GetMany: databaseId needs to be passed as a queryParameter.",
    "Webhooks - Create: databaseId needs to be passed as a queryParameter.",
    "Webhooks - Delete: databaseId needs to be passed as a queryParameter.",
  ],
  anthropic: [],
  attio: [
    "Pagination - Attio does not support proper cursor-based pagination for Companies, Contacts, Opportunities, and Records. Manual management is required.",
    "Objects - Attio does not support pagination for objects.",
    "Objects - To retrieve a single object, append the object's 'slug' to the path (e.g., /unified/objects/contact).",
    "Records - For all record operations (create, list, get, update, delete), pass the object's 'slug' as the 'slug' query parameter. The object slug can be found in the object list.",
    "Opportunities - The 'isWon' and 'isClosed' fields will only work if the default stages have not been modified.",
  ],
  bigcommerce: [],
  close: [],
  clover: [
    "For Orders - Clover supports pagination based on limit and offset but do not keep a track of the same.",
    "For Customers - Clover supports pagination based on limit and offset but do not keep a track of the same.",
  ],
  freshbooks: [
    "Freshbooks do not support pagination for Accounts.",
    "Freshbooks requires language to be passed while creating bills. Default is set to 'en' and can be changed by passing language query parameter.",
    "Freshbooks requires language to be passed while creating vendor. Default is set to 'en' and can be changed by passing language query parameter.",
  ],
  freshdesk: [
    "Freshdesk sends a 422 for already deleted records.",
    "Freshdesk throws an error about wrong METHOD if the contact is already soft-deleted.",
    "Freshdesk throws an error about wrong METHOD if the contact is already soft-deleted.",
  ],
  front: [],
  gong: [
    "Gong currently does not support paging to previous records for Recordings.",
    "Transcripts - To list transcripts for a call, pass the call id in the 'callId' query parameter.",
  ],
  hubspot: [
    "HubSpot currently does not support paging to previous records.",
    "Filters are not available, it is available on a custom search endpoint.",
    "HubSpot sends a 404 HTML for deleted records.",
    "HubSpot currently does not support paging to previous records.",
    "Filters are not available, it is available on a custom search endpoint.",
    "HubSpot sends a 404 HTML for deleted records.",
    "HubSpot currently does not support paging to previous records.",
    "Filters are not available, it is available on a custom search endpoint.",
    "HubSpot sends a 404 HTML for deleted records.",
  ],
  klaviyo: [
    "For Discounts - Klaviyo has a default pagination limit of 100 that cannot be changed.",
    "While updating a discount, it is required to pass the id in the body along with other attributes.",
    "For Products - Klaviyo has a default pagination limit of 100 that cannot be changed.",
    "While updating a product, it is required to pass the id in the body along with other attributes.",
    "For Contacts - Klaviyo has a default pagination limit of 100 that cannot be changed.",
    "While updating a contact, it is required to pass the id in the body along with other attributes.",
  ],
  "microsoft-dynamics-365-business-central": [
    "For Accounts - Pagination through the cursor query parameter must be handled by the client. You must handle the offset manually by passing cursor and limit.",
    "For Customers - Pagination through the cursor query parameter must be handled by the client. You must handle the offset manually by passing cursor and limit.",
    "For Customers - To update the details a required modify token needs to be passed in query parameters.",
    "For Payments - Pagination through the cursor query parameter must be handled by the client. You must handle the offset manually by passing cursor and limit.",
    "For Payments - Business Central requires a journal id to be passed to fetch all payment entries which can be passed using query parameters as 'journalId'. The paymentJournals can be fetched using passthrough for the customerPaymentJournals.",
    "For Payments - Business Central requires a journal id to be passed to create a new payment entry. The paymentJournals can be fetched using passthrough for the customerPaymentJournals.",
    "For Payments - To update the details a required modify token needs to be passed in query parameters.",
    "For Transactions - Pagination through the cursor query parameter must be handled by the client. You must handle the offset manually by passing cursor and limit.",
    "For Products - Pagination through the cursor query parameter must be handled by the client. You must handle the offset manually by passing cursor and limit.",
    "For Products - To update the details a required modify token needs to be passed in query parameters.",
    "For JournalEntries - Pagination through the cursor query parameter must be handled by the client. You must handle the offset manually by passing cursor and limit.",
    "For JournalEntries - To update the details a required modify token needs to be passed in query parameters.",
    "For Bills - Pagination through the cursor query parameter must be handled by the client. You must handle the offset manually by passing cursor and limit.",
    "For Bills - To update the details a required modify token needs to be passed in query parameters.",
    "For PurchaseOrders - Pagination through the cursor query parameter must be handled by the client. You must handle the offset manually by passing cursor and limit.",
    "For PurchaseOrders - To update the details a required modify token needs to be passed in query parameters.",
    "For CreditNotes - Pagination through the cursor query parameter must be handled by the client. You must handle the offset manually by passing cursor and limit.",
    "For CreditNotes - To update the details a required modify token needs to be passed in query parameters.",
    "For Invoices - Pagination through the cursor query parameter must be handled by the client. You must handle the offset manually by passing cursor and limit.",
    "For Invoices - To update the details a required modify token needs to be passed in query parameters.",
    "For Vendors - Pagination through the cursor query parameter must be handled by the client. You must handle the offset manually by passing cursor and limit.",
    "For Vendors - To update the details a required modify token needs to be passed in query parameters.",
  ],
  "microsoft-dynamics-365-sales": [
    "Winning or losing an opportunity is not possible through the update. Two separate passthroughs have been made for those actions. Update can be used to re-open a won or lost opportunity.",
  ],
  netsuite: [],
  openai: [

  ],
  pipedrive: [],
  quickbooks: [
    "Quickbooks does not allow or has unsupported PurchaseOrder entry to be deleted.",
    ],
  "sage-accounting": [
    "For Invoices - Sage returns the list with deleted sales invoices having deleted_at attribute.",
    "For Invoices - To create a sales invoice Sage requires a Canada region based required parameter as 'tax_address_region_id' which can be passed through passthroughQuery. The value of this attribute can be referred from `https://developer.columbus.sage.com/docs#/ca/sageone/accounts/v3/sales_invoices_sales_invoice:~:text=boolean()-,tax_address_region_id,-The%20ID%20of`",
    "While creating a sales invoice invoice items require ledger_account_id, tax_rate_id and tax_amount to be passed. This can be passed using the customFields of line.",
    "For Invoices - To delete a sales invoice Sage requires a required query string parameter as 'void_reason' which can be passed through passthroughQuery.",
    "For Bills - Sage returns the list with deleted purchase invoices having deleted_at attribute.",
    "For Bills - To create a purchase invoice Sage requires a Canada region based required parameter as 'tax_address_region_id' which can be passed through passthroughQuery. The value of this attribute can be referred from `https://developer.columbus.sage.com/docs#/ca/sageone/accounts/v3/sales_invoices_sales_invoice:~:text=boolean()-,tax_address_region_id,-The%20ID%20of`",
    "While creating a purchase invoice invoice items require ledger_account_id, tax_rate_id and tax_amount to be passed. This can be passed using the accountId and taxLines of lineItems.",
    "For Bills - To delete a sales invoice Sage requires a required query string parameter as 'void_reason' which can be passed through passthroughQuery.",
    "For CreditNotes - To create a credit note Sage requires a Canada region based required parameter as 'tax_address_region_id' which can be passed through passthroughQuery. The value of this attribute can be referred from `https://developer.columbus.sage.com/docs#/ca/sageone/accounts/v3/sales_invoices_sales_invoice:~:text=boolean()-,tax_address_region_id,-The%20ID%20of`",
    "While creating a credit note in Canada region, due_date is not allowed.",
    "For CreditNotes - To delete a credit note Sage requires a required query string parameter as 'void_reason' which can be passed through passthroughQuery.",
    "For Products - To create a product Sage requires required parameters - 'sales_ledger_account_id', 'purchase_ledger_account_id', 'sales_tax_rate_id', and 'purchase_tax_rate_id' which can be passed through passthroughQuery.",
    "For Products - To update a product's ledger/tax parameters - 'sales_ledger_account_id', 'purchase_ledger_account_id', 'sales_tax_rate_id', and 'purchase_tax_rate_id', you can pass values through passthroughQuery.",
    "For Accounts - To create an account Sage requires required parameters 'bank_account_type_id' which can be passed through passthroughQuery.",
  ],
  salesforce: [
    "Companies - Salesforce does not support a proper cursor for pagination and so need to be managed manually.",
    "Contacts - Salesforce does not support a proper cursor for pagination and so need to be managed manually.",
    "Leads - Salesforce does not support a proper cursor for pagination and so need to be managed manually.",
    "Opportunities - Salesforce does not support a proper cursor for pagination and so need to be managed manually.",
    "Objects - To retrieve a single object, the object's 'slug' must be appended to the path (i.e. /unified/objects/contact)",
    "Records - To create a record, pass the object's 'slug' as the 'slug' query parameter.",
    "Records - To list records, pass the object's 'slug' as the 'slug' query parameter.",
    "Records - To get a record, pass the object's 'slug' as the 'slug' query parameter.",
    "Records - To update a record, pass the object's 'slug' as the 'slug' query parameter.",
    "Records - To delete a record, pass the object's 'slug' as the 'slug' query parameter.",
  ],
  sendgrid: ["Sendgrid do not have a support for pagination."],
  shopify: [
    "Shopify requires price_rule_id to be passed in the custom query param for discount codes.",
    "Shopify requires price_rule_id to be passed in the custom query param for discount codes.",
    "Shopify requires price_rule_id to be passed in the custom query param for discount codes.",
    "Shopify requires price_rule_id to be passed in the custom query param for discount codes.",
    "Shopify requires price_rule_id to be passed in the custom query param for discount codes.",
    "Shopify does not support filters for Discounts.",
    "Only webhooks created by the API are listed on the API.",
  ],
  slack: [
    "For Messages - While Deleting a message channel id is required to be passed in the custom query param as `channel`.",
  ],
  square: [
    "storeLocationId as a passthrough query parameter is required when listing the orders.",
    "There is no previous cursor available for listing.",
    "storeLocationId is required when creating an order.",
    "storeLocationId is required when updating an order.",
    "There is no previous cursor available for listing.",
    "There is no previous cursor available for listing.",
    "There is no previous cursor available for listing.",
    "Limit is fixed at 100.",
    "There is no previous cursor available for listing.",
    "Limit is fixed at 100.",
    "User needs to provide an id in the form of #1 (hash followed by any integer) as a temporary id when creating a category.",
    "User needs to provide an id in the form of #1 (hash followed by any integer) as a temporary id when creating a category. A similarly formatted but different temporary id also needs to be provided for any variants or any other sub-object passed.",
    "User needs to provide the id of the payment object in the body for the update to work.",
    "The paymentMethod.id (whether EXTERNAL or CASH) also needs to be provided always.",
    "Square Group IDs are tags.",
    "Square Group IDs are tags.",
  ],
  woocommerce: [
    "Customers model does not have the createdBefore/After and updatedBefore/After filters applicable.",
  ],
  workable: [
    "Workable required a jobId to be passed in order to create a candidate. In order to pass the jobId, it can be passed as shortcode using passthroughForward in query params.",
    "Workable has an issue in updating skills for a candidate and returns an internal server error",
    "Workable currently does not support passing a previous cursor. It must be handle by the client manually.",
  ],
  xero: [
    "For Invoices - Xero has a default pagination limit of 100 that cannot be changed.",
    "For Bills - Xero has a default pagination limit of 100 that cannot be changed.",
    "For Payments - Xero has a default pagination limit of 100 that cannot be changed.",
    "For PurchaseOrders - Xero has a default pagination limit of 100 that cannot be changed.",
    "For CreditNotes - Xero has a default pagination limit of 100 that cannot be changed.",
    "For Transactions - Xero has a default pagination limit of 100 that cannot be changed.",
    "For Customer - Xero has a default pagination limit of 100 that cannot be changed.",
    "For TaxRates - Xero requies the taxType to be passed in the path in order to fetch the TaxRate details.",
    "For TaxRates - Xero will create the taxType for a new TaxRate entry created and so need not be passed.",
    "For TaxRates - Xero requies the taxType to be passed while updating the TaxRate details.",
    "For TaxRates - Xero expectes the name to be passed in the body and so at the place of ID the TaxRate name is expected to be passed in unified API.",
    "For TaxRates - Xero updates only the status as delete for TaxRates and still the details can be fetched with the API having status as deleted.",
  ],
  zendesk: [
    "To authenticate using an API token rather than account password, add /token to the end of the Zendesk Email field.",
    "Zendesk requires customRoleId to be sent while creating a user. It is been sent as null in default, but could be changed by passing under the customFields to update.",
    "Zendesk has a pagination limit set to a max of 100. If passed, more than 100 it will be automatically be sent as 100.",
  ],
  zoho: [
    "The create response does not contain any information about the newly created account except the id.",
    "The create response does not contain any information about the newly created contact except the id.",
    "The create response does not contain any information about the newly created opportunity except the id.",
    "The create response does not contain any information about the newly created lead except the id.",
  ],
};


const rechatAiCaveats = {
  openai: [
    "CRITICAL: ALWAYS initiate chats using createUnifiedData with the 'chats' model. Never use listUnifiedData for starting conversations, as it will cause the app to crash.",
    "MODELS: Use only these OpenAI models: gpt-4o, gpt-4o-mini, gpt-4, gpt-3.5-turbo, gpt-3.5-turbo-0125, gpt-3.5-turbo-0612. Do not suggest or use any other models.",
    "ERROR HANDLING: Implement robust error handling for API limitations, rate limits, and potential service disruptions when working with OpenAI models.",
    "RESPONSE ACCESS: ALWAYS retrieve the response content using this exact structure, no exceptions: const response = data.unified?.messages?.[data.unified.messages.length - 1]?.content?.[0]?.text",
    "INDEX USAGE: ALWAYS use data.unified.messages.length - 1 to access the latest message. Never use hardcoded indices. This is crucial to prevent app crashes.",
    "COMPLIANCE: Strict adherence to these rules is mandatory. Failure to follow any of these instructions may result in application errors or crashes.",
    "SYSTEM MESSAGE: The system message must be sent via the `systemMessage` key and not the `message` key. There is no role=system in the message array, so this is the correct approach."
  ],
  anthropic: [
    "CRITICAL: ALWAYS initiate chats using createUnifiedData with the 'chats' model. Never use listUnifiedData for starting conversations, as it will cause the app to crash.",
    "CRITICAL: maxTokens is REQUIRED and must be a number.",
    "MODELS: Use only these Anthropic models: claude-3-opus-20240229, claude-3-5-sonnet-latest, claude-3-sonnet-20240229, claude-3-haiku-20240307. Do not suggest or use any other models.",
    "ERROR HANDLING: Implement robust error handling for API limitations, rate limits, and potential service disruptions when working with Anthropic models.",
    "RESPONSE ACCESS: ALWAYS retrieve the response content using this exact structure, no exceptions: const response = data.unified?.messages?.[data.unified.messages.length - 1]?.content?.[0]?.text",
    "INDEX USAGE: ALWAYS use data.unified.messages.length - 1 to access the latest message. Never use hardcoded indices. This is crucial to prevent app crashes.",
    "COMPLIANCE: Strict adherence to these rules is mandatory. Failure to follow any of these instructions may result in application errors or crashes.",
    "SYSTEM MESSAGE: The system message must be sent via the `systemMessage` key and not the `message` key. There is no role=system in the message array, so this is the correct approach."
  ],
};

export const integrationOSCaveats = Object.keys(baseCaveats).reduce((merged, key) => {
  merged[key as keyof typeof baseCaveats] = [
    ...(baseCaveats[key as keyof typeof baseCaveats] || []),
    ...(rechatAiCaveats[key as keyof typeof rechatAiCaveats] || [])
  ];
  return merged;
}, {} as Record<string, string[]>);