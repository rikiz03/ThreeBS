# TODO

## Task: Fix Footer Email, Category Images & Cart Quantity

### Step 1: Fix Footer Email ✅
- [x] Edit `components/Footer.tsx` - Change `support@threebrothersstores.com` → `support@threebrotherstores.com`
- [x] Edit `app/layout.tsx` - Fix JSON-LD structured data email to `support@threebrotherstores.com`

### Step 2: Fix Category Images Fallback ✅
- [x] Edit `lib/data.ts` - Replace "No Image" placeholder with dynamic Unsplash image based on category name in `getCategories()` and `getCategory()`

### Step 3: Fix Cart Quantity Increment ✅
- [x] Edit `components/ProductCard.tsx` - Sum quantities instead of counting entries in `cartItemCount`
- [x] Edit `components/Header.tsx` - Cart badge shows total quantity sum
- [x] Edit `app/checkout/page.tsx` - Checkout header and order summary show total quantity

### Step 4: Live Testing ✅
- [x] Footer email renders correctly (single "s")
- [x] Category images use dynamic Unsplash URLs (no "No Image" placeholder)
- [x] Old double-s email removed from JSON-LD structured data
- [x] Cart quantity increment verified by user (1 → 2 → 3... works)

### Step 5: Update Tawk.to Chat Widget ✅
- [x] Edit `app/layout.tsx` - Replace old Tawk.to embed ID with new URL `https://embed.tawk.to/6a5bbffe1c52dc1d4c7edb33/1jtr6buqv`

## Task: AliExpress-Style Product Page with Working Variant Selection

### Step 6: Update Types ✅
- [x] Edit `lib/types.ts` - Add `images?: string[]` to `Product` interface for gallery support

### Step 7: Fix Variant Data Layer ✅
- [x] Edit `lib/data.ts` - Derive attributes from variations when product-level attributes are missing; populate `images` from gallery + variant images

### Step 8: Create ProductGallery Component ✅
- [x] Create `components/ProductGallery.tsx` - AliExpress-style gallery with main image + thumbnail strip synced to cart store

### Step 9: Update Product Page ✅
- [x] Edit `app/product/[id]/page.tsx` - Replace single SyncedProductImage with ProductGallery

### Step 10: Enhance BuyBox Variant UI ✅
- [x] Edit `components/BuyBox.tsx` - Show price per variant option, ensure derived attributes work with selector UI

### Step 11: Test ✅
- [x] Verify product page renders correctly with gallery, variant selectors, and dynamic pricing
