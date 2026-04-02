## Plan

### 1. Add Images to All Products
Generate product images for all 14 catalog products and update `catalog.ts` with the image paths.

### 2. Fix Contact Forms → FormSubmit (frosthaven.contact@gmail.com)
- **Contact.tsx**: Already uses formsubmit but points to `info@frosthaventubs.com` → update to `frosthaven.contact@gmail.com`
- **CommercialPage.tsx**: Currently has a local-only form → wire it to formsubmit with the same email

### 3. Review System with Database & Moderation
- Create a Supabase `reviews` table with fields: product_id, author, rating, title, body, approved (boolean), created_at
- Update `ReviewSystem.tsx` to submit reviews to the database and fetch approved reviews
- Create an admin reviews page where you can view pending reviews and approve/reject them

### 4. Commercial Page → Show Products
Replace the quote form on `/commercial` with the actual commercial-systems products from the catalog (Summit XL 200, Apex Dual-Zone, Titan Pro), displayed as product cards.
