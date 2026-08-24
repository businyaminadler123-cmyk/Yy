-- ============================================================================
--  Seed data — three product tiers and two demo partner hotels.
--  Safe to re-run: upserts on slug.
-- ============================================================================

insert into public.products (
  slug, tier, name_en, name_he, subtitle_en, subtitle_he,
  description_en, description_he, highlights_en, highlights_he,
  price_ils, price_usd, compare_at_ils, stock, is_limited, image_url, sort_order
) values
(
  'standard-kosher', 'standard',
  'The Standard Set', 'הסט הסטנדרטי',
  'Kosher — certified and ready', 'כשר — מוסמך ומוכן',
  'A complete, fully kosher set of the Four Species: lulav, etrog, hadassim and aravot. Inspected by our sofer and packed the morning of delivery.',
  'סט מלא וכשר של ארבעת המינים: לולב, אתרוג, הדסים וערבות. נבדק על ידי הרב שלנו ונארז בבוקר המשלוח.',
  array['Certified kosher (Rabbanut)', 'Fresh-cut lulav and aravot', 'Etrog in a protective case', 'Same-day delivery in Jerusalem & Tel Aviv'],
  array['כשרות הרבנות', 'לולב וערבות טריים', 'אתרוג בקופסת הגנה', 'משלוח באותו יום בירושלים ותל אביב'],
  180.00, 49.00, null, 120, false,
  'https://images.unsplash.com/photo-1601758260856-8a6bb0b18b06?auto=format&fit=crop&w=1200&q=80', 1
),
(
  'premium-mehudar', 'premium',
  'The Premium Set', 'הסט המהודר',
  'Mehudar — hand-selected', 'מהודר — נבחר ביד',
  'Mehudar in every detail. A Yanover etrog with clean skin and a full pitom, a straight tiyomet lulav, and hadassim meshulashim from the Galilee.',
  'מהודר בכל פרט. אתרוג יאנובר בעל עור נקי ופיטם שלם, לולב עם תיומת ישרה, והדסים משולשים מהגליל.',
  array['Yanover etrog, full pitom', 'Lulav with an intact tiyomet', 'Hadassim meshulashim, triple-leaved', 'Presented in a linen-lined gift box'],
  array['אתרוג יאנובר עם פיטם שלם', 'לולב עם תיומת שלמה', 'הדסים משולשים', 'ארוז בקופסת מתנה מרופדת פשתן'],
  380.00, 105.00, 430.00, 60, false,
  'https://images.unsplash.com/photo-1509719662282-d0e1a3d1a1c8?auto=format&fit=crop&w=1200&q=80', 2
),
(
  'vip-alef-alef', 'vip',
  'The VIP Collection', 'אוסף ה-VIP',
  'Alef Alef — limited stock', 'אלף אלף — מלאי מוגבל',
  'Our finest grade, reserved each year in very small numbers. Every set is chosen personally, photographed for you before dispatch, and delivered by hand.',
  'הדרגה הגבוהה ביותר שלנו, נשמרת מדי שנה בכמות קטנה מאוד. כל סט נבחר אישית, מצולם עבורכם לפני המשלוח, ונמסר ביד.',
  array['Alef Alef grade, personally selected', 'Photographed and approved before dispatch', 'Hand-delivered to your room or door', 'Presented in a hand-finished walnut case'],
  array['דרגת אלף אלף, נבחר אישית', 'מצולם ומאושר לפני המשלוח', 'נמסר ביד לחדר או לדלת', 'ארוז בקופסת עץ אגוז בעבודת יד'],
  850.00, 235.00, null, 12, true,
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80', 3
)
on conflict (slug) do update set
  name_en = excluded.name_en, name_he = excluded.name_he,
  price_ils = excluded.price_ils, price_usd = excluded.price_usd,
  highlights_en = excluded.highlights_en, highlights_he = excluded.highlights_he;

insert into public.hotels (slug, name, name_he, city, address, contact_name, contact_phone, contact_email, commission_rate, delivery_note)
values
  ('king-david-jerusalem', 'The King David Jerusalem', 'מלון המלך דוד ירושלים', 'Jerusalem',
   '23 King David St, Jerusalem', 'Concierge Desk', '+972-2-620-8888', 'concierge@example.com', 12.00,
   'Delivered to the concierge desk by 4:00 PM, Erev Sukkot.'),
  ('the-norman-tel-aviv', 'The Norman Tel Aviv', 'מלון נורמן תל אביב', 'Tel Aviv',
   '23-25 Nachmani St, Tel Aviv', 'Guest Relations', '+972-3-543-5555', 'relations@example.com', 10.00,
   'Delivered to your suite between 2:00 PM and 6:00 PM.')
on conflict (slug) do update set
  name = excluded.name, name_he = excluded.name_he, city = excluded.city;
