export const LOCALES = ['en', 'he'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

export function dirOf(locale: Locale): 'ltr' | 'rtl' {
  return locale === 'he' ? 'rtl' : 'ltr';
}

const en = {
  brand: {
    name: 'Arba Minim',
    tagline: 'The Four Species, delivered',
  },
  nav: {
    collection: 'The Collection',
    story: 'Our Story',
    delivery: 'Delivery',
    contact: 'Contact',
    cart: 'Cart',
    admin: 'Dashboard',
  },
  home: {
    eyebrow: 'Sukkot in Israel',
    title: 'The Four Species, chosen by hand.',
    subtitle:
      'Lulav, etrog, hadassim and aravot — inspected, certified, and delivered to your hotel room or your door anywhere in Israel.',
    ctaPrimary: 'View the collection',
    ctaSecondary: 'How delivery works',
    trust1: 'Rabbinic certification on every set',
    trust2: 'Same-day delivery, Jerusalem & Tel Aviv',
    trust3: 'English-speaking concierge, 7 days',
    collectionEyebrow: 'Three tiers',
    collectionTitle: 'Choose your set',
    collectionSubtitle:
      'Every set is checked by our sofer the morning it ships. Choose the level of hiddur that suits you.',
    storyEyebrow: 'Since 1998',
    storyTitle: 'A family of growers, not a warehouse',
    storyBody:
      'We grow in the Galilee and select in Bnei Brak. Each etrog is examined under natural light for skin, shape and pitom before it earns a place in one of our sets. Nothing is boxed by machine.',
    deliveryEyebrow: 'Delivery',
    deliveryTitle: 'To your room, or to your door',
    deliveryHotel: 'Staying at a partner hotel? Scan the QR code in your room and charge the set directly to your room account.',
    deliveryPrivate: 'Anywhere else in Israel, we deliver to your address the day before Sukkot, with Bit or cash on delivery.',
  },
  product: {
    from: 'From',
    limited: 'Limited stock',
    onlyLeft: 'Only {count} left',
    soldOut: 'Sold out',
    add: 'Add to cart',
    added: 'Added',
    includes: 'What is included',
    select: 'Select',
  },
  cart: {
    title: 'Your cart',
    empty: 'Your cart is empty.',
    emptyCta: 'Browse the collection',
    subtotal: 'Subtotal',
    delivery: 'Delivery',
    free: 'Complimentary',
    total: 'Total',
    checkout: 'Proceed to checkout',
    remove: 'Remove',
    quantity: 'Quantity',
    continue: 'Continue shopping',
    itemCount: '{count} item(s)',
  },
  checkout: {
    title: 'Checkout',
    contactHeading: 'Your details',
    deliveryHeading: 'Delivery address',
    paymentHeading: 'Payment',
    fullName: 'Full name',
    roomNumber: 'Room number',
    phone: 'Phone number',
    email: 'Email address',
    addressLine1: 'Street and number',
    addressLine2: 'Apartment, floor, entrance',
    city: 'City',
    postalCode: 'Postal code',
    notes: 'Delivery notes (optional)',
    payBit: 'Pay with Bit',
    payBitHint: 'We send a Bit request to your phone once the order is confirmed.',
    payCash: 'Cash on delivery',
    payCashHint: 'Pay the courier in cash when your set arrives.',
    roomCharge: 'Your order will be charged directly to your hotel room.',
    roomChargeHint: 'No card needed now. The amount appears on your room folio at checkout.',
    placeOrder: 'Place order',
    placing: 'Placing your order…',
    orderSummary: 'Order summary',
    required: 'This field is required',
    invalidEmail: 'Enter a valid email address',
    invalidPhone: 'Enter a valid phone number',
    agree: 'By placing this order you agree to our delivery terms.',
  },
  confirmation: {
    title: 'Thank you, your order is confirmed',
    subtitle: 'Order {number}',
    hotelBody:
      'Your set will be delivered to room {room} at {hotel}. The amount has been charged to your room account.',
    privateBody: 'Your set will be delivered to {address}. We will call before we arrive.',
    emailed: 'A confirmation has been sent to {email}.',
    backHome: 'Back to the collection',
  },
  hotel: {
    welcome: 'Welcome, {hotel} guest',
    subtitle: 'A private selection of the Four Species, delivered to your room.',
    charge: 'Charged to your room — no payment needed now.',
    orderNow: 'Order for your room',
    concierge: 'Arranged with the concierge desk at {hotel}.',
    notFound: 'This hotel link is not active.',
    notFoundBody: 'Check the QR code in your room, or order for private delivery instead.',
  },
  footer: {
    rights: 'All rights reserved.',
    hours: 'Sun–Thu 9:00–19:00 · Fri 9:00–13:00',
    partner: 'Hotel partnerships',
  },
  admin: {
    title: 'Dashboard',
    orders: 'Orders',
    hotels: 'Hotels',
    products: 'Products',
    signOut: 'Sign out',
    signIn: 'Sign in',
    today: 'Today',
    ordersToday: "Today's orders",
    revenueToday: "Today's revenue",
    hotelOrders: 'Hotel orders',
    privateOrders: 'Private orders',
    pending: 'Awaiting packing',
    recentOrders: 'Recent orders',
    noOrders: 'No orders yet.',
    filterHotel: 'All hotels',
    filterChannel: 'All channels',
    filterStatus: 'All statuses',
    search: 'Search name, email, order no.',
    order: 'Order',
    customer: 'Customer',
    channel: 'Channel',
    total: 'Total',
    status: 'Status',
    placed: 'Placed',
    actions: 'Actions',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    add: 'Add',
    copyLink: 'Copy link',
    copied: 'Copied',
    stock: 'Stock',
    price: 'Price',
    active: 'Active',
    inactive: 'Inactive',
    confirmDelete: 'Delete this record? This cannot be undone.',
  },
  status: {
    received: 'Received',
    packing: 'Packing',
    out_for_delivery: 'Out for delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  },
  channel: {
    hotel: 'Hotel',
    private: 'Private',
  },
  payment: {
    room_charge: 'Room charge',
    bit: 'Bit',
    cash_on_delivery: 'Cash on delivery',
  },
  errors: {
    generic: 'Something went wrong. Please try again.',
    outOfStock: 'One of the sets in your cart just sold out.',
    emptyCart: 'Your cart is empty.',
    signInFailed: 'Wrong email or password.',
    notStaff: 'This account does not have dashboard access.',
  },
} as const;

const he: Dictionary = {
  brand: {
    name: 'ארבעת המינים',
    tagline: 'ארבעת המינים, עד אליכם',
  },
  nav: {
    collection: 'הקולקציה',
    story: 'הסיפור שלנו',
    delivery: 'משלוחים',
    contact: 'צור קשר',
    cart: 'סל',
    admin: 'ניהול',
  },
  home: {
    eyebrow: 'סוכות בישראל',
    title: 'ארבעת המינים, נבחרים ביד.',
    subtitle:
      'לולב, אתרוג, הדסים וערבות — נבדקים, מאושרים, ומגיעים לחדר במלון או עד הדלת בכל רחבי הארץ.',
    ctaPrimary: 'לצפייה בקולקציה',
    ctaSecondary: 'איך עובד המשלוח',
    trust1: 'תעודת כשרות לכל סט',
    trust2: 'משלוח באותו יום בירושלים ובתל אביב',
    trust3: 'שירות לקוחות בעברית ובאנגלית, כל ימות השבוע',
    collectionEyebrow: 'שלוש רמות',
    collectionTitle: 'בחרו את הסט שלכם',
    collectionSubtitle:
      'כל סט נבדק על ידי הרב שלנו בבוקר המשלוח. בחרו את רמת ההידור המתאימה לכם.',
    storyEyebrow: 'משנת 1998',
    storyTitle: 'משפחת מגדלים, לא מחסן',
    storyBody:
      'אנחנו מגדלים בגליל ובוררים בבני ברק. כל אתרוג נבדק באור טבעי — עור, צורה ופיטם — לפני שהוא נכנס לאחד הסטים שלנו. שום דבר לא נארז במכונה.',
    deliveryEyebrow: 'משלוחים',
    deliveryTitle: 'לחדר, או עד הדלת',
    deliveryHotel: 'שוהים באחד ממלונות השותפים? סרקו את קוד ה-QR בחדר וחייבו ישירות את חשבון החדר.',
    deliveryPrivate: 'בכל מקום אחר בארץ, אנחנו מגיעים עד אליכם ערב סוכות, בתשלום ביט או מזומן.',
  },
  product: {
    from: 'החל מ-',
    limited: 'מלאי מוגבל',
    onlyLeft: 'נותרו {count} בלבד',
    soldOut: 'אזל המלאי',
    add: 'הוספה לסל',
    added: 'נוסף',
    includes: 'מה כלול',
    select: 'בחירה',
  },
  cart: {
    title: 'הסל שלכם',
    empty: 'הסל ריק.',
    emptyCta: 'לצפייה בקולקציה',
    subtotal: 'סכום ביניים',
    delivery: 'משלוח',
    free: 'ללא עלות',
    total: 'סה"כ',
    checkout: 'מעבר לתשלום',
    remove: 'הסרה',
    quantity: 'כמות',
    continue: 'המשך קנייה',
    itemCount: '{count} פריטים',
  },
  checkout: {
    title: 'תשלום',
    contactHeading: 'הפרטים שלכם',
    deliveryHeading: 'כתובת למשלוח',
    paymentHeading: 'תשלום',
    fullName: 'שם מלא',
    roomNumber: 'מספר חדר',
    phone: 'טלפון',
    email: 'דוא"ל',
    addressLine1: 'רחוב ומספר',
    addressLine2: 'דירה, קומה, כניסה',
    city: 'עיר',
    postalCode: 'מיקוד',
    notes: 'הערות למשלוח (לא חובה)',
    payBit: 'תשלום בביט',
    payBitHint: 'נשלח בקשת ביט לטלפון שלכם לאחר אישור ההזמנה.',
    payCash: 'מזומן במשלוח',
    payCashHint: 'שלמו לשליח במזומן עם קבלת הסט.',
    roomCharge: 'ההזמנה תחויב ישירות לחשבון החדר במלון.',
    roomChargeHint: 'אין צורך בכרטיס אשראי כעת. הסכום יופיע בחשבון החדר בעת העזיבה.',
    placeOrder: 'שליחת הזמנה',
    placing: 'שולח את ההזמנה…',
    orderSummary: 'סיכום הזמנה',
    required: 'שדה חובה',
    invalidEmail: 'נא להזין כתובת דוא"ל תקינה',
    invalidPhone: 'נא להזין מספר טלפון תקין',
    agree: 'שליחת ההזמנה מהווה אישור לתנאי המשלוח.',
  },
  confirmation: {
    title: 'תודה, ההזמנה אושרה',
    subtitle: 'הזמנה {number}',
    hotelBody: 'הסט יימסר לחדר {room} במלון {hotel}. הסכום חויב לחשבון החדר.',
    privateBody: 'הסט יימסר לכתובת {address}. נתקשר לפני ההגעה.',
    emailed: 'אישור נשלח לכתובת {email}.',
    backHome: 'חזרה לקולקציה',
  },
  hotel: {
    welcome: 'ברוכים הבאים, אורחי {hotel}',
    subtitle: 'מבחר פרטי של ארבעת המינים, עד לחדר שלכם.',
    charge: 'חיוב לחשבון החדר — אין צורך בתשלום כעת.',
    orderNow: 'הזמנה לחדר',
    concierge: 'בתיאום עם דלפק הקבלה במלון {hotel}.',
    notFound: 'קישור המלון אינו פעיל.',
    notFoundBody: 'בדקו את קוד ה-QR בחדר, או הזמינו למשלוח פרטי.',
  },
  footer: {
    rights: 'כל הזכויות שמורות.',
    hours: 'א׳–ה׳ 9:00–19:00 · ו׳ 9:00–13:00',
    partner: 'שיתופי פעולה עם מלונות',
  },
  admin: {
    title: 'לוח בקרה',
    orders: 'הזמנות',
    hotels: 'מלונות',
    products: 'מוצרים',
    signOut: 'התנתקות',
    signIn: 'כניסה',
    today: 'היום',
    ordersToday: 'הזמנות היום',
    revenueToday: 'הכנסות היום',
    hotelOrders: 'הזמנות מלונות',
    privateOrders: 'הזמנות פרטיות',
    pending: 'ממתינות לאריזה',
    recentOrders: 'הזמנות אחרונות',
    noOrders: 'אין הזמנות עדיין.',
    filterHotel: 'כל המלונות',
    filterChannel: 'כל הערוצים',
    filterStatus: 'כל הסטטוסים',
    search: 'חיפוש שם, דוא"ל, מספר הזמנה',
    order: 'הזמנה',
    customer: 'לקוח',
    channel: 'ערוץ',
    total: 'סה"כ',
    status: 'סטטוס',
    placed: 'נוצרה',
    actions: 'פעולות',
    save: 'שמירה',
    cancel: 'ביטול',
    edit: 'עריכה',
    delete: 'מחיקה',
    add: 'הוספה',
    copyLink: 'העתקת קישור',
    copied: 'הועתק',
    stock: 'מלאי',
    price: 'מחיר',
    active: 'פעיל',
    inactive: 'לא פעיל',
    confirmDelete: 'למחוק את הרשומה? לא ניתן לשחזר.',
  },
  status: {
    received: 'התקבלה',
    packing: 'באריזה',
    out_for_delivery: 'יצאה למשלוח',
    delivered: 'נמסרה',
    cancelled: 'בוטלה',
  },
  channel: {
    hotel: 'מלון',
    private: 'פרטי',
  },
  payment: {
    room_charge: 'חיוב לחדר',
    bit: 'ביט',
    cash_on_delivery: 'מזומן במשלוח',
  },
  errors: {
    generic: 'משהו השתבש. נסו שוב.',
    outOfStock: 'אחד הסטים בסל אזל כעת מהמלאי.',
    emptyCart: 'הסל ריק.',
    signInFailed: 'דוא"ל או סיסמה שגויים.',
    notStaff: 'לחשבון הזה אין הרשאת ניהול.',
  },
};

/** The English dictionary is the source of truth for the key shape. */
export type Dictionary = {
  [S in keyof typeof en]: { [K in keyof (typeof en)[S]]: string };
};

export const dictionaries: Record<Locale, Dictionary> = { en, he };

export type TranslateKey =
  | { [S in keyof Dictionary]: `${S & string}.${keyof Dictionary[S] & string}` }[keyof Dictionary];

/**
 * Look up a dot-path key and interpolate {placeholders}.
 * Falls back to English, then to the key itself, so a missing Hebrew string
 * degrades to readable text instead of blank UI.
 */
export function translate(
  locale: Locale,
  key: TranslateKey,
  vars?: Record<string, string | number>,
): string {
  const [section, entry] = key.split('.') as [keyof Dictionary, string];
  const table = dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE];
  const fallback = dictionaries[DEFAULT_LOCALE];
  const raw =
    (table[section] as Record<string, string> | undefined)?.[entry] ??
    (fallback[section] as Record<string, string> | undefined)?.[entry] ??
    key;

  if (!vars) return raw;
  return Object.entries(vars).reduce(
    (acc, [name, value]) => acc.replaceAll(`{${name}}`, String(value)),
    raw,
  );
}

/** Picks the right localized column off a product/hotel row. */
export function pick<T extends Record<string, unknown>>(
  row: T,
  base: string,
  locale: Locale,
): string {
  const localized = row[`${base}_${locale}` as keyof T];
  const english = row[`${base}_en` as keyof T];
  return String(localized ?? english ?? '');
}
