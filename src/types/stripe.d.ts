export interface Subscription {
    id: string;
    object: "subscription";
    application: null;
    application_fee_percent: null;
    automatic_tax: {
      enabled: boolean;
      liability: null;
    };
    billing_cycle_anchor: number;
    billing_cycle_anchor_config: null;
    billing_thresholds: null;
    cancel_at: null;
    cancel_at_period_end: boolean;
    canceled_at: null;
    cancellation_details: {
      comment: null;
      feedback: null;
      reason: null;
    };
    collection_method: "charge_automatically";
    created: number;
    currency: string;
    current_period_end: number;
    current_period_start: number;
    customer: string;
    days_until_due: null;
    default_payment_method: null;
    default_source: null;
    default_tax_rates: never[];
    description: null;
    discount: null;
    discounts: never[];
    ended_at: null;
    invoice_settings: {
      account_tax_ids: null;
      issuer: {
        type: "self";
      };
    };
    items: {
      object: "list";
      data: SubscriptionItem[];
      has_more: boolean;
      total_count: number;
      url: string;
    };
    latest_invoice: string;
    livemode: boolean;
    metadata: Record<string, never>;
    next_pending_invoice_item_invoice: null;
    on_behalf_of: null;
    pause_collection: null;
    payment_settings: {
      payment_method_options: null;
      payment_method_types: null;
      save_default_payment_method: "off";
    };
    pending_invoice_item_interval: null;
    pending_setup_intent: string;
    pending_update: null;
    plan: Plan;
    quantity: number;
    schedule: null;
    start_date: number;
    status: "active";
    test_clock: null;
    transfer_data: null;
    trial_end: null;
    trial_settings: {
      end_behavior: {
        missing_payment_method: "create_invoice";
      };
    };
    trial_start: null;
  }
  
  interface SubscriptionItem {
    id: string;
    object: "subscription_item";
    billing_thresholds: null;
    created: number;
    discounts: never[];
    metadata: Record<string, never>;
    plan: Plan;
    price: Price;
    quantity: number;
    subscription: string;
    tax_rates: never[];
  }
  
  interface Plan {
    id: string;
    object: "plan";
    active: boolean;
    aggregate_usage: null;
    amount: number;
    amount_decimal: string;
    billing_scheme: "per_unit";
    created: number;
    currency: string;
    interval: "month";
    interval_count: number;
    livemode: boolean;
    metadata: Record<string, never>;
    meter: null;
    nickname: null;
    product: string;
    tiers_mode: null;
    transform_usage: null;
    trial_period_days: null;
    usage_type: "licensed";
  }
  
  interface Price {
    id: string;
    object: "price";
    active: boolean;
    billing_scheme: "per_unit";
    created: number;
    currency: string;
    custom_unit_amount: null;
    livemode: boolean;
    lookup_key: null;
    metadata: Record<string, never>;
    nickname: null;
    product: string;
    recurring: {
      aggregate_usage: null;
      interval: "month";
      interval_count: number;
      meter: null;
      trial_period_days: null;
      usage_type: "licensed";
    };
    tax_behavior: "unspecified";
    tiers_mode: null;
    transform_quantity: null;
    type: "recurring";
    unit_amount: number;
    unit_amount_decimal: string;
  }
  
  export interface Product {
    id: string;
    object: "product";
    active: boolean;
    attributes: never[];
    created: number;
    default_price: string;
    description: string;
    images: never[];
    livemode: boolean;
    marketing_features: never[];
    metadata: Record<string, never>;
    name: string;
    package_dimensions: null;
    shippable: null;
    statement_descriptor: null;
    tax_code: null;
    type: "service";
    unit_label: null;
    updated: number;
    url: null;
  }
  
  export interface BillingPortalSession {
    id: string;
    object: "billing_portal.session";
    configuration: string;
    created: number;
    customer: string;
    flow: null;
    livemode: boolean;
    locale: null;
    on_behalf_of: null;
    return_url: string;
    url: string;
  }
  
  export interface InvoiceList {
    object: "list";
    url: string;
    has_more: boolean;
    data: Invoice[];
  }
  
  interface Invoice {
    id: string;
    object: string;
    account_country: string;
    account_name: string;
    account_tax_ids: null;
    amount_due: number;
    amount_paid: number;
    amount_remaining: number;
    amount_shipping: number;
    application: null;
    application_fee_amount: null;
    attempt_count: number;
    attempted: boolean;
    auto_advance: boolean;
    automatic_tax: {
      enabled: boolean;
      liability: null;
      status: null;
    };
    automatically_finalizes_at: null;
    billing_reason: string;
    charge: null;
    collection_method: string;
    created: number;
    currency: string;
    custom_fields: null;
    customer: string;
    customer_address: null;
    customer_email: string;
    customer_name: string;
    customer_phone: null;
    customer_shipping: null;
    customer_tax_exempt: string;
    customer_tax_ids: any[];
    default_payment_method: null;
    default_source: null;
    default_tax_rates: any[];
    description: null;
    discount: null;
    discounts: any[];
    due_date: null;
    effective_at: number;
    ending_balance: number;
    footer: null;
    from_invoice: null;
    hosted_invoice_url: string;
    invoice_pdf: string;
    issuer: {
      type: string;
    };
    last_finalization_error: null;
    latest_revision: null;
    lines: {
      object: string;
      data: Array<{
        id: string;
        object: string;
        amount: number;
        amount_excluding_tax: number;
        currency: string;
        description: string;
        discount_amounts: any[];
        discountable: boolean;
        discounts: any[];
        invoice: string;
        livemode: boolean;
        metadata: Record<string, any>;
        period: {
          end: number;
          start: number;
        };
        plan: {
          id: string;
          object: string;
          active: boolean;
          aggregate_usage: null;
          amount: number;
          amount_decimal: string;
          billing_scheme: string;
          created: number;
          currency: string;
          interval: string;
          interval_count: number;
          livemode: boolean;
          metadata: Record<string, any>;
          meter: null;
          nickname: null;
          product: string;
          tiers_mode: null;
          transform_usage: null;
          trial_period_days: null;
          usage_type: string;
        };
        price: {
          id: string;
          object: string;
          active: boolean;
          billing_scheme: string;
          created: number;
          currency: string;
          custom_unit_amount: null;
          livemode: boolean;
          lookup_key: null;
          metadata: Record<string, any>;
          nickname: null;
          product: string;
          recurring: {
            aggregate_usage: null;
            interval: string;
            interval_count: number;
            meter: null;
            trial_period_days: null;
            usage_type: string;
          };
          tax_behavior: string;
          tiers_mode: null;
          transform_quantity: null;
          type: string;
          unit_amount: number;
          unit_amount_decimal: string;
        };
        proration: boolean;
        proration_details: {
          credited_items: null;
        };
        quantity: number;
        subscription: string;
        subscription_item: string;
        tax_amounts: any[];
        tax_rates: any[];
        type: string;
        unit_amount_excluding_tax: string;
      }>;
      has_more: boolean;
      total_count: number;
      url: string;
    };
    livemode: boolean;
    metadata: Record<string, any>;
    next_payment_attempt: null;
    number: string;
    on_behalf_of: null;
    paid: boolean;
    paid_out_of_band: boolean;
    payment_intent: null;
    payment_settings: {
      default_mandate: null;
      payment_method_options: null;
      payment_method_types: null;
    };
    period_end: number;
    period_start: number;
    post_payment_credit_notes_amount: number;
    pre_payment_credit_notes_amount: number;
    quote: null;
    receipt_number: null;
    rendering: null;
    shipping_cost: null;
    shipping_details: null;
    starting_balance: number;
    statement_descriptor: null;
    status: string;
    status_transitions: {
      finalized_at: number;
      marked_uncollectible_at: null;
      paid_at: number;
      voided_at: null;
    };
    subscription: string;
    subscription_details: {
      metadata: Record<string, any>;
    };
    subtotal: number;
    subtotal_excluding_tax: number;
    tax: null;
    test_clock: null;
    total: number;
    total_discount_amounts: any[];
    total_excluding_tax: number;
    total_tax_amounts: any[];
    transfer_data: null;
    webhooks_delivered_at: number;
  }
  
  export interface PaymentMethodList {
    object: "list";
    url: string;
    has_more: boolean;
    data: PaymentMethod[];
  }
  
  interface PaymentMethod {
    id: string;
    object: "payment_method";
    billing_details: BillingDetails;
    card: Card;
    created: number;
    customer: string;
    livemode: boolean;
    metadata: Record<string, never>;
    redaction: null;
    type: "card";
  }
  
  interface BillingDetails {
    address: object | null;
    email: string | null;
    name: string | null;
    phone: string | null;
  }
  
  interface Card {
    brand: string;
    checks: Checks;
    country: string;
    exp_month: number;
    exp_year: number;
    fingerprint: string;
    funding: string;
    generated_from: null;
    last4: string;
    networks: object;
    three_d_secure_usage: object;
    wallet: null;
  }
  
  interface Checks {
    address_line1_check: string | null;
    address_postal_code_check: string | null;
    cvc_check: string;
  }
  