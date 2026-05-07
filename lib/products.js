// Image helper.
const u = (id, w = 900, q = 85) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=${q}&auto=format&fit=crop`

// All images are men's editorial / neck-down product shots / atelier close-ups.
// No people show their faces in any product card lead image — every primary
// shot is either a torso-only menswear photo or a close-up of a garment,
// fabric, leather or hands at work.
//
// PRIMARY pool (lead images):
//   P1 1591047139829-d91aecb6caea  - linen overcoat torso shot
//   P2 1571945153237-4929e783af4a  - menswear shirt close
//   P3 1488161628813-04466f872be2  - Annie Spratt walking man (cropped)
//   P4 1604644401890-0bd678c83788  - menswear torso/trouser
//   P5 1576566588028-4147f3842f27  - cashmere knit shot
//   P6 1620799140188-3b2a02fd9a77  - knit close
//   P7 1551803091-e20673f15770     - oversized streetwear fit
//   P8 1521572163474-6864f9cf17ab  - heavyweight tee shot
//   P9 1583744946564-b52ac1c389c8  - tee close
//   P10 1492447166138-50c3889fccb1 - menswear button-up shot
//
// CLOSE-UPS (no people):
//   N1  1469334031218-e382a71b716b  - hands at work
//   N2  1542621334-a254cf47733d     - atelier
//   N3  1594938298603-c8148c4dae35  - hands stitching tailoring
//   N4  1605812860427-4024433a70fd  - leather
//   N5  1614253429340-98120bd6d753  - leather shoe close
//   N6  1582897085656-c636d006a246  - shoes
//   N7  1602810318383-e386cc2a3ccf  - denim close
//   N8  1604176354204-9268737828e4  - denim
//   N9  1551537482-f2075a1d41f2     - denim
//   N10 1606293926249-ed22a78f9e76  - wool fabric

export const products = [
  {
    slug: 'oversized-linen-coat',
    name: 'Oversized Linen Topcoat',
    price: 12499,
    category: 'Outerwear',
    gender: 'Men',
    badge: 'New',
    colors: ['Stone', 'Charcoal', 'Sand'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    material: 'Belgian Linen · 320gsm',
    care: 'Cold wash · Hang dry · Iron low',
    description:
      'A heavyweight overcoat for the in-between seasons. Architectural shoulder, raw-edge lapels, single horn-button closure. Cut from Belgian linen that breaks in beautifully over years.',
    images: [
      u('1591047139829-d91aecb6caea'),
      u('1488161628813-04466f872be2'),
      u('1542621334-a254cf47733d'),
      u('1594938298603-c8148c4dae35'),
    ],
  },
  {
    slug: 'silk-camp-shirt',
    name: 'Silk Camp Shirt',
    price: 5499,
    category: 'Shirts',
    gender: 'Men',
    badge: null,
    colors: ['Ink', 'Sand', 'Olive'],
    sizes: ['S', 'M', 'L', 'XL'],
    material: 'Mulberry Silk',
    care: 'Dry clean · Cool iron from inside',
    description:
      'Open-collar camp shirt with relaxed shoulder, cut from mulberry silk that drapes the way good silk should. Holiday-ready; just as right with denim on a Tuesday.',
    images: [
      u('1571945153237-4929e783af4a'),
      u('1622445275576-721325763afe'),
      u('1492447166138-50c3889fccb1'),
      u('1469334031218-e382a71b716b'),
    ],
  },
  {
    slug: 'oxford-shirt',
    name: 'Oxford Cotton Shirt',
    price: 4499,
    category: 'Shirts',
    gender: 'Men',
    badge: 'New',
    colors: ['White', 'Sky', 'Ecru'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    material: 'Long-staple Oxford cotton',
    care: 'Machine wash cold · Iron warm',
    description:
      'The button-down you reach for. Long-staple Oxford cotton, single-needle seams, mother-of-pearl buttons, a rear locker loop. Wears in like a friend.',
    images: [
      u('1596755094514-f87e34085b2c'),
      u('1571945153237-4929e783af4a'),
      u('1606107557195-0e29a4b5b4aa'),
      u('1492447166138-50c3889fccb1'),
    ],
  },
  {
    slug: 'linen-long-sleeve',
    name: 'Relaxed Linen Shirt',
    price: 5799,
    category: 'Shirts',
    gender: 'Men',
    badge: 'New',
    colors: ['Bone', 'Stone', 'Olive', 'Indigo'],
    sizes: ['S', 'M', 'L', 'XL'],
    material: 'Belgian linen · 180gsm',
    care: 'Cold wash · Hang dry · Iron damp',
    description:
      'A long-sleeve linen shirt cut for slow afternoons. Open placket, relaxed shoulder, finished hem. Wrinkles are part of the agreement.',
    images: [
      u('1605908502724-9093a79a1b39'),
      u('1606107557195-0e29a4b5b4aa'),
      u('1488161628813-04466f872be2'),
      u('1571945153237-4929e783af4a'),
    ],
  },
  {
    slug: 'mandarin-collar-shirt',
    name: 'Mandarin Collar Shirt',
    price: 4999,
    category: 'Shirts',
    gender: 'Men',
    badge: null,
    colors: ['Black', 'Bone', 'Charcoal'],
    sizes: ['S', 'M', 'L', 'XL'],
    material: 'Cotton · Tencel blend',
    care: 'Machine wash cold · Tumble low',
    description:
      'A band-collar shirt that swaps a tie for nothing. Concealed placket, slightly tapered body, deep yoke. Worn as a layer or alone — never the same twice.',
    images: [
      u('1593030761757-71fae45fa0e7'),
      u('1577962917302-cd874c4e31d2'),
      u('1622445275576-721325763afe'),
      u('1488161628813-04466f872be2'),
    ],
  },
  {
    slug: 'tuxedo-shirt',
    name: 'Pleated Tuxedo Shirt',
    price: 7999,
    category: 'Shirts',
    gender: 'Men',
    badge: 'Best Seller',
    colors: ['White', 'Ivory'],
    sizes: ['S', 'M', 'L', 'XL'],
    material: 'Egyptian cotton · 80gsm poplin',
    care: 'Dry clean · Hand-press the bib',
    description:
      'Front bib in micro-pleats, French cuffs, hidden placket. Dressed up with a black-tie suit; dressed down with selvedge denim and a cashmere knit. The shirt that earns its keep twice.',
    images: [
      u('1525507119028-ed4c629a60a3'),
      u('1547949003-9792a18a2601'),
      u('1622445275576-721325763afe'),
      u('1492447166138-50c3889fccb1'),
    ],
  },
  {
    slug: 'workshirt',
    name: 'Brushed Cotton Workshirt',
    price: 4799,
    category: 'Shirts',
    gender: 'Men',
    badge: null,
    colors: ['Olive', 'Slate', 'Indigo'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    material: 'Brushed organic cotton · 240gsm',
    care: 'Machine wash cold · Hang dry',
    description:
      'Two chest pockets, reinforced shoulders, a hem long enough to tuck. The shirt for the days that need a shirt that means it.',
    images: [
      u('1607435097405-db48f377bff6'),
      u('1595950653106-6c9ebd614d3a'),
      u('1545241047-6083a3684587'),
      u('1602810318383-e386cc2a3ccf'),
    ],
  },
  {
    slug: 'raw-edge-blazer',
    name: 'Raw Edge Blazer',
    price: 14999,
    category: 'Tailoring',
    gender: 'Men',
    badge: 'Best Seller',
    colors: ['Onyx', 'Bone'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    material: 'Wool · Cashmere blend',
    care: 'Dry clean · Steam press',
    description:
      'Deconstructed tailoring at its quietest. Boxy shoulder, unfinished hem, hidden inner tab. Built in a Bengaluru atelier from Italian wool-cashmere.',
    images: [
      u('1488161628813-04466f872be2'),
      u('1594938298603-c8148c4dae35'),
      u('1492447166138-50c3889fccb1'),
      u('1542621334-a254cf47733d'),
    ],
  },
  {
    slug: 'pleated-trouser',
    name: 'Pleated Wide Trouser',
    price: 6499,
    category: 'Trousers',
    gender: 'Men',
    badge: null,
    colors: ['Charcoal', 'Stone', 'Olive'],
    sizes: ['28', '30', '32', '34', '36', '38'],
    material: 'Tencel · Linen',
    care: 'Machine wash cold · Hang dry',
    description:
      'Double-pleat front, deep pockets, column-cut leg. Drapes the length of the leg without weight. The trouser you reach for when nothing else feels right.',
    images: [
      u('1604644401890-0bd678c83788'),
      u('1488161628813-04466f872be2'),
      u('1469334031218-e382a71b716b'),
      u('1594938298603-c8148c4dae35'),
    ],
  },
  {
    slug: 'cashmere-knit',
    name: 'Boxy Cashmere Knit',
    price: 9299,
    category: 'Knitwear',
    gender: 'Men',
    badge: 'New',
    colors: ['Camel', 'Charcoal', 'Off-white'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    material: '100% Mongolian Cashmere',
    care: 'Hand wash · Lay flat to dry',
    description:
      'A jumper that softens with every wear. Loose body, dropped shoulder, ribbed cuffs. Worn solo or under tailoring.',
    images: [
      u('1576566588028-4147f3842f27'),
      u('1620799140188-3b2a02fd9a77'),
      u('1488161628813-04466f872be2'),
      u('1606293926249-ed22a78f9e76'),
    ],
  },
  {
    slug: 'leather-loafer',
    name: 'Sculpted Leather Loafer',
    price: 11499,
    category: 'Footwear',
    gender: 'Men',
    badge: null,
    colors: ['Cognac', 'Black'],
    sizes: ['39', '40', '41', '42', '43', '44', '45'],
    material: 'Vegetable-tanned leather',
    care: 'Polish monthly · Store with tree',
    description:
      'Hand-lasted in Tuscany. Sculpted toe, leather sole, no logo, no shouting. Just a loafer that gets better with age.',
    images: [
      u('1614253429340-98120bd6d753'),
      u('1582897085656-c636d006a246'),
      u('1605812860427-4024433a70fd'),
      u('1606293926249-ed22a78f9e76'),
    ],
  },
  {
    slug: 'minimal-tee',
    name: 'Heavyweight Tee',
    price: 1899,
    category: 'Basics',
    gender: 'Men',
    badge: null,
    colors: ['White', 'Black', 'Sand', 'Olive'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    material: 'Organic Pima cotton, 240gsm',
    care: 'Machine wash cold · Tumble low',
    description:
      'The heavyweight tee. Boxy fit, ribbed neck that holds its shape, finished in Bengaluru. The opposite of disposable.',
    images: [
      u('1521572163474-6864f9cf17ab'),
      u('1583744946564-b52ac1c389c8'),
      u('1488161628813-04466f872be2'),
      u('1492447166138-50c3889fccb1'),
    ],
  },
  {
    slug: 'denim-shirt',
    name: 'Selvedge Denim Shirt',
    price: 5499,
    category: 'Denim',
    gender: 'Men',
    badge: null,
    colors: ['Indigo', 'Bleach'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    material: '12oz Japanese selvedge denim',
    care: 'Wash inside out · Hang dry',
    description:
      'Cut from 12oz Okayama selvedge with horn buttons and a single chest pocket. Stiff at first; broken in over months.',
    images: [
      u('1602810318383-e386cc2a3ccf'),
      u('1604176354204-9268737828e4'),
      u('1551537482-f2075a1d41f2'),
      u('1488161628813-04466f872be2'),
    ],
  },
  {
    slug: 'lounge-pant',
    name: 'Cotton Lounge Pant',
    price: 4299,
    category: 'Loungewear',
    gender: 'Men',
    badge: 'New',
    colors: ['Sand', 'Slate', 'Black'],
    sizes: ['S', 'M', 'L', 'XL'],
    material: 'Brushed organic cotton',
    care: 'Machine wash · Tumble low',
    description:
      'A drawstring lounge pant that earns its place outside the house too. Tapered leg, deep pockets, no logo. Made for slow mornings, long flights, longer Sundays.',
    images: [
      u('1551803091-e20673f15770'),
      u('1488161628813-04466f872be2'),
      u('1469334031218-e382a71b716b'),
      u('1542621334-a254cf47733d'),
    ],
  },
  {
    slug: 'wool-topcoat',
    name: 'Italian Wool Topcoat',
    price: 22999,
    category: 'Outerwear',
    gender: 'Men',
    badge: 'Best Seller',
    colors: ['Camel', 'Charcoal', 'Black'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    material: 'Italian virgin wool · 480gsm',
    care: 'Dry clean · Steam press',
    description:
      'A long, single-breasted topcoat with notch lapels and a half-belted back. Cut from Loro Piana virgin wool. Built for ten winters.',
    images: [
      u('1591047139829-d91aecb6caea'),
      u('1488161628813-04466f872be2'),
      u('1542621334-a254cf47733d'),
      u('1606293926249-ed22a78f9e76'),
    ],
  },
]

export const categories = [
  'All',
  'Outerwear',
  'Tailoring',
  'Knitwear',
  'Shirts',
  'Trousers',
  'Denim',
  'Footwear',
  'Basics',
  'Loungewear',
]

export const formatPrice = (n) =>
  '₹ ' + Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })

// ── DISCOUNT HELPERS ──
// `originalPrice` (a.k.a. MRP) is optional. When set and greater than the
// selling `price`, the product is "on sale" — frontend displays MRP struck
// through, the selling price, and a "X% off" chip.
export const hasDiscount = (p) =>
  Boolean(p && p.originalPrice && Number(p.originalPrice) > Number(p.price))

export const discountPercent = (p) =>
  hasDiscount(p)
    ? Math.round((1 - Number(p.price) / Number(p.originalPrice)) * 100)
    : 0

export const discountAmount = (p) =>
  hasDiscount(p) ? Number(p.originalPrice) - Number(p.price) : 0

export const getProduct = (slug) => products.find((p) => p.slug === slug)

export const relatedProducts = (slug, limit = 3) =>
  products.filter((p) => p.slug !== slug).slice(0, limit)
