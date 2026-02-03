# Specification

## Summary
**Goal:** Restore and clarify admin access by adding a safe admin bootstrap flow, backend admin management APIs, and frontend tooling/messages that explain Principal-based authorization.

**Planned changes:**
- Add a backend “admin bootstrap” update method that promotes the authenticated caller to admin only when no admins currently exist; otherwise reject.
- Add backend admin management methods for admins to list current admins, grant admin to a specified Principal, and revoke admin from a specified Principal.
- Update AdminGuard access-denied UI to show the logged-in user’s current Principal and explain (in English) that admin access is based on Internet Identity Principal, not email.
- Add an admin-only UI page for managing admins: list admins, grant admin by entering a Principal, and revoke admins with a confirmation step, updating the list without full page refresh.

**User-visible outcome:** Users who are blocked from admin pages can see their Principal and understand why they’re denied; admins can self-serve admin management from the UI, and a first admin can be bootstrapped when none exist.
