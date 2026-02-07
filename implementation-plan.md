# Customer Health Page - Plan

## Timeline

2-3 days, with a possible day 4 if something goes sideways with the API or design system.

## Component Structure

Here's how I'd break this up:

**Page Level:**
- `CustomerHealthPage` - Main page wrapper
- `CustomerHealthLayout` - Setup for parallel routes (details panel slot)

**Table stuff:**
- `CustomerTable` - Main table using TanStack Table for sorting and pagination
- `CustomerRow` - Individual row with click to open details, hover effects, health badge
- `TableSkeleton` - Loading skeleton that looks like real table
- `EmptyState` - Different messages for "no customers" vs "no search results"
- `Pagination` - Page buttons and page size dropdown

**Filters:**
- `FilterBar` - Container for all filter controls
- `SearchInput` - Search box with debounce, syncs to URL
- `SegmentFilter` - Three buttons for Healthy/Watch/At Risk

**Details Panel:**
- `CustomerDetailsPanel` - Slides in from right
- `HealthScore` - Shows the health score (maybe ring or big number)
- `RecentActivity` - List of recent events
- `UsageTrends` - Simple usage chart
- `CustomerNotes` - Notes section

**Shared:**
- `HealthBadge` - Green/yellow/red badge
- `ErrorBoundary` - Catches errors
- `LoadingOverlay` - Spinner for details panel

## Server vs Client Components

My approach for splitting these:

**Server Components:**
- Main page (`page.tsx`) - fetches first page of customers on server
- Layout parts - headers, static stuff
- Error boundaries

Why use server components? Page loads faster, better for SEO, less JS sent to browser.

**Client Components:**
- `CustomerTable` - Clicking rows, hover effects, sort UI (even though sort happens on server)
- `FilterBar` - Search input, controlled components
- `CustomerDetailsPanel` - Fetching health data when customer clicked
- `Pagination` - Page buttons

Why client? These all need state, click handlers, or browser stuff.

**About sorting:** Since we have server-side pagination, sorting must happen on backend. If we only loaded page 1 (25 items of 2500 total), frontend sorting would just sort those 25 - not useful. API needs sort param like `?sort=mrr_desc`, backend sorts everything then returns the page.

**How it flows:**
1. Server fetches page 1 on initial load
2. Client shows the table
3. User clicks column header to sort
4. Client updates URL with sort param
5. React Query fetches new sorted data
6. Client displays it

This gives fast first load plus interactive features.

## State Management & Data Fetching

Going with React Query (TanStack Query). I've used it on similar projects and it just works well for this kind of stuff.

**Why React Query:**

**Caching** - When a CSM clicks a customer, goes back, then clicks same customer again, it loads instantly from cache. No extra API call.

**Background updates** - If they leave the tab open and come back later, data refreshes automatically in background without blocking anything.

**Pagination** - The `placeholderData: keepPreviousData` option is really useful. When clicking next page, table doesn't go empty while loading - keeps showing old data with small loading indicator.

**Error handling** - Has built-in retry with exponential backoff. If network acts up, it retries automatically.

**URL sync** - All filters go in URL like `?search=acme&segment=at-risk&page=2`. This means links work, back button works, and everything survives page refresh.

Example of how I'd set it up:

```typescript
// Customer list query
const useCustomers = (filters) => {
  return useQuery({
    queryKey: ['customers', filters],
    queryFn: () => fetchCustomers(filters), // includes sort, page, search, segment
    placeholderData: keepPreviousData
  })
}

// Individual customer health query
const useCustomerHealth = (customerId) => {
  return useQuery({
    queryKey: ['customer', customerId, 'health'],
    queryFn: () => fetchCustomerHealth(customerId),
    enabled: !!customerId // Only fetch when we have an ID
  })
}
```

## Loading & Error States

For loading, table gets a skeleton that looks like the actual table - same column widths and spacing. Much better than a spinner that makes everything jump around when data loads.

Details panel shows a spinner overlay when fetching health data, but keeps the panel frame visible so it doesn't look broken.

For errors:
- Toast notifications for small stuff like "Failed to load health data" with retry button
- Full error boundary if everything crashes
- Each section in details panel handles its own errors - if usage data fails, doesn't crash the whole panel

## Edge Cases

- **Empty states:** Different messages for "no customers in system" vs "no customers match your filters"
- **Slow networks:** Request timeouts, show stale data while refreshing
- **Race conditions:** Cancel in-flight requests when filters change
- **Mobile:** Horizontal scroll with sticky first column, details as full-screen drawer
- **Accessibility:** Keyboard nav through table, Enter to open, Escape to close, focus trap in panel
- **Scroll position:** When CSM clicks customer then goes back, should return to same scroll position not top of page. Can use Next.js scrollRestoration or store position in sessionStorage

## Tasks

**Day 1**
- Create route at `app/(dashboard)/customers/health/page.tsx`
- Setup React Query provider in layout
- Build CustomerTable component with TanStack Table
- Connect to real API with server-side pagination
- Add TableSkeleton loading state
- Create CustomerDetailsPanel component (just UI shell)

**Day 2**
- Build SearchInput with debounce
- Create SegmentFilter with Healthy/Watch/At Risk buttons
- Sync all filters to URL query params
- Wire up health data fetching when row clicked
- Add error states and toast notifications
- Test filter combinations work together

**Day 3**
- Make table responsive for mobile (horizontal scroll)
- Convert details panel to drawer on small screens
- Add keyboard navigation (arrow keys, Enter, Escape)
- Setup focus trap in details panel
- Write tests for useCustomers hook
- Test pagination edge cases

**Day 4 (if needed)**
- Fix any bugs found during testing
- Performance check - add memo where needed
- Handle remaining edge cases
- Final polish and cleanup


## Extra Feature (If There's Time)

**Pin/Mark Important Customers**

This would be helpful for CSMs to quickly find their key accounts. Here's the idea:

- Put a pin icon (like bookmark) next to each customer in table and details panel
- When clicked, marks that customer as "pinned" just for that CSM
- Add "Pinned" filter button next to Healthy/Watch/At Risk
- Clicking it shows only that CSM's pinned customers

**Why this helps:** Instead of searching or clicking at-risk every time and find the desired customer, they just click Pinned filter and see all important accounts. Good when multiple CSMs work on same customer - each has their own pinned list.

**Data structure:**

```typescript
interface Customer {
  customerId: string
  name: string
  // ... other fields
  pinned: Array<{
    pinnedBy: string    // userId of the CSM
    pinnedAt: Date      // When they pinned it
  }>
}
```

**Need these API changes:**
- `POST /api/customers/{id}/pin` - Pin a customer
- `DELETE /api/customers/{id}/pin` - Unpin a customer
- Update `GET /api/customers` to accept `pinned=true` filter

**UI changes:**
- Pin icon button in table row (filled=pinned, empty=not pinned)
- Same pin button in details panel header
- "Pinned" button in filter bar showing count

This is nice-to-have but main table works without it.

