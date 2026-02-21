# Changelog

All notable changes to the "AI Speaking Object" project will be documented in this file.
## [3.11.0] - 2026-02-20

### Added
- **Interactive Tutorial Page**:
    - Created a new `/tutorial` route featuring a comprehensive, animated step-by-step guide on how to use the application.
    - Added full i18n support (English and Portuguese) to the tutorial.
    - Documented all core workflows: AI Script Generation, AI Image Generation, Personal Photo Upload, Video Animation (Fast & High Quality), and Downloading.
    - Integrated a direct link to the Tutorial in the mobile/responsive Hamburger Header Menu.

## [3.10.0] - 2026-02-20

### Major Changes
- **Lead Capture & Invite System**:
    - Created a new `/invite` landing page to collect leads and offer 20 free initial credits.
    - Integrated an autoplaying mock video of the "Talking Object" creation within a 3D phone frame to showcase capabilities directly on the invite page.
    - Added a "Golden Tip" section for users to optimize their credit usage by testing images before generating videos.
- **Authentication Improvements**:
    - **Whitelist Lead Support**: Updated the `/signup` flow (`actions.ts`) to verify existence in both the premium `whitelist` and the new `whitelist_lead` tables.
    - **Credit Assignment**: Ensured users signing up via the lead capture whitelist correctly receive their 20 initial credits via `lead_migration.sql` triggers.

## [3.9.0] - 2026-02-20

### Major Changes
- **Production Launch (Vercel)**:
    - Successfully deployed the web application to Vercel production environment.
    - Configured production-ready Environment Variables via Bulk Import.
    - Updated **Supabase Auth** with production redirect URLs.
    - Configured **Stripe Webhooks** with a dedicated production endpoint and secured signing secret.
- **URL Standardization**:
    - Centralized `NEXT_PUBLIC_SITE_URL` to point to the production Vercel domain.

## [3.8.1] - 2026-02-19

### Added
- **User Activity Logging**:
    - Implemented `last_seen_at` tracking to monitor user engagement.
    - Added automated activity heartbeats to `Header.tsx`.
- **Admin Dashboard**:
    - Added visibility for **Sign Up Date** and **Last Seen** status in the user list.
- **Android Support**:
    - Configured **ngrok** integration for external beta testing via APK.

## [3.8.0] - 2026-02-19

### Major Changes
- **Mobile UI Redesign**:
    - **Header**: Implemented a responsive **Hamburger Menu** to declutter the navigation bar.
    - **App Name**: Rebranded header title to **"Talking Objects"**.
    - **Creation Form**:
        - Moved advanced settings (Model, Quality) into a collapsible `<details>` section.
        - Simplified card styling for a cleaner mobile look.
    - **Page Layout**:
        - Removed redundant page headers and viral mode toggle.
        - Implemented **Wizard Flow**: Preview section now only appears after content is generated.
- **Android Native Support**:
    - **Safe Area**: Implemented dynamic padding `pt-[max(env(),24px)]` to support notched devices.
    - **Status Bar**: Configured transparent status bar with light text using `@capacitor/status-bar`.

### Fixed
- **Header Menu**:
    - Fixed transparency issues by forcing a solid black background and using `React Portal` to escape stacking contexts.
- **Navigation**:
    - Moved Admin, Credits, Profile, Language, and Sign Out into the new slide-out menu.

## [3.7.1] - 2026-02-15

### Changed
- **Video Configuration**:
    - **Duration**: Restricted all video generations to **6 seconds** (was ~8-10s) to optimize credit usage.
    - **Cost Reduction**:
        - **Fast Video**: Reduced from 25 to **15 Credits**.
        - **Pro Video**: Reduced from 60 to **40 Credits**.
    - Updated `gemini-video.ts` to enforce `durationSeconds: 6`.
    - Updated pricing cards to reflect "Vídeo Rápido (15cr)" and "Vídeo Pro (40cr)".

## [3.7.0] - 2026-02-15

### Changed
- **Credit Packages**:
    - Updated packages to provide better value and cover image generation costs:
        - **Starter**: 35 Credits (was 30) - R$ 29,00.
        - **Creator**: 130 Credits (was 120) - R$ 99,00.
        - **Agency**: 450 Credits (was 400) - R$ 299,00.
    - Added clear descriptions of image (1cr) and video (25/60cr) costs to the pricing UI.

## [3.6.1] - 2026-02-15

### Fixed
- **Veo Video Generation**:
    - Fixed `404 Not Found` error by switching the fast model to `veo-3.1-fast-generate-preview`.
    - Confirmed `veo-3.1-generate-preview` remains available for high-quality generation.

## [3.6.0] - 2026-02-14

### Major Changes
- **Admin User Management**:
    - **Whitelist Control**: Admins can now **Add** and **Remove** emails from the whitelist directly in the Dashboard.
    - **Credit Management**: 
        - View **Role** and **Credit Balance** for each whitelisted user.
        - **Manual Adjustment**: Admins can add (+50) or remove (-10) credits from any user's balance instantly.
    - **Security**: Implemented strict Row Level Security (RLS) allowing only Admins to update `profiles` and modify `whitelist`.

- **Enhanced Notifications**:
    - **Success States**: Replaced generic error pages with green **Success Notifications** for positive actions (e.g., "Check your email", "Password Reset Link Sent").
    - **Rate Limit Handling**: Added specific, user-friendly error messages for `429 Too Many Requests` (Email Rate Limits) to guide users to wait.

### Fixed
- **Password Reset Flow**: 
    - Fixed "Auth Code Error" masking the actual issue.
    - Improved handling of authentication callbacks to route users correctly.

## [3.5.0] - 2026-02-14

### Major Changes
- **Admin Dashboard v3.5 (Financials & Tracking)**:
    - **Financial Metrics**: Added 3 new cards tracking **Total Revenue**, **Provider Cost**, **Net Profit**, and **Total User Liability** (Outstanding Credits).
    - **Credit Tracking**: Integrated `transactions` table to log accurate sales data via Stripe Webhooks.
    - **User Identification**: Added **User Email** column to Usage Logs for easier auditing.
    - **Asset Persistence**: Logs now include clickable links to generated images and videos.

### Fixed
- **Video Generation**:
    - Fixed `404 Not Found` error by correcting the model ID to `veo-2.0-generate-preview`.
- **UI/UX**:
    - Fixed "Infinite Loading" (`...`) on the Navbar Credit Badge when the API fails; now defaults to 0 with error logging.
- **Database**:
    - Updated `storage.sql` and `transactions.sql` scripts to be idempotent (safe to re-run) to prevent policy conflicts.

## [3.3.0] - 2026-02-14

### Major Changes
- **Admin Dashboard Enhancements**:
    - **Date Range Filter**: Added ability to filter usage logs by a specific date range (Start Date -> End Date).
    - **Enhanced Logs**: "Usage Logs" table now displays the full **Date & Time** of each generation.
    - **Real-time Stats**: Admin stats (Credit Burn, Total Generations) now dynamically reflect the selected date range.

## [3.2.0] - 2026-02-13

### Major Changes
- **Video Quality Tiers**:
    - Introduced two quality options for video generation:
        - **Fast (Veo-2)**: Quicker generation, standard quality. Cost: **25 Credits**.
        - **High Quality (Veo)**: Premium quality, higher detail. Cost: **60 Credits**.
    - **Smart Workflow**:
        - Moved quality selection to the **Approval Step** (`VideoPromptApproval`).
        - Users can now review the generated image and prompt *before* committing to the higher credit cost.
    - **Cost Transparency**: Dynamic credit cost display based on selected quality.

## [3.0.0] - 2026-02-12

### Major Changes
- **SaaS Architecture Migration**: Transitioned from a local-storage based app to a full SaaS platform using **Supabase**.
- **Authentication System**:
    - Implemented secure Email/Password authentication.
    - Added **Invite-only Whitelist** system to restrict access to beta testers.
    - Protected all generation routes (Server Actions) with server-side session verification.
- **Credit System**:
    - Introduced a credit-based usage model.
    - New users receive **50 free credits** upon whitelisted sign-up.
    - Deducts credits based on action type (Script: 0, Image: 1, Video: 10).
    - **Tiered Pricing**:
        - **Script**: Free (0 credits).
        - **Image**: 1 Credit.
        - **Video**: 10 Credits.
- **Cloud Favorites**:
    - Migrated "Favorites" from browser `localStorage` to **Supabase Database** (`generations` table).
    - Favorites now persist across devices and sessions.

### Added
- **User Profile**:
    - Database triggers automatically create a user profile with free credits upon sign-up.
    - Header now displays the user's real-time credit balance.
    - **Header Navigation**: Added clickable 'Credits Badge' with a 'Plus' icon to easily access the Credit Store (`/credits`).
- **Security**:
    - Enabled Row Level Security (RLS) policies on `whitelist`, `profiles`, and `generations` tables to ensure data privacy.
- **Monetization (Stripe)**:
    - Integrated **Stripe Checkout** for secure credit purchases.
    - Implemented **Webhooks** to automatically top up user credits upon successful payment.
    - Added `/credits` page with 3 pricing tiers (Starter, Creator, Agency).
    - Created `transactions` audit log in Supabase.

### Fixed
- **Veo Video Generation**:
    - Fixed `404 Not Found` error by switching API endpoint to `predictLongRunning` which is required for video models.
    - Fixed `400 Bad Request` by removing unsupported `videoFormat` parameter from the payload.
    - Resolved `url is not defined` regression in the server action.
- **Credit System**:
    - Fixed credit deduction failure caused by RLS policies blocking direct updates.
    - Implemented a secure PostgreSQL RPC function `decrement_credits` to handle balance updates safely on the server side.
    - Converted `Header` to a Client Component to support real-time updates.
    - Implemented Supabase Realtime subscription to instantly reflect credit deductions in the UI without page refresh.

### Added (v3.0.1 - Dynamic Scenarios)
- **Background Scenario Selector**:
    - Users can now choose the environment for their object:
        - **Commercial**: School Lunchbox, Party Table, Supermarket Shelf.
        - **Creator**: Green Screen (Chroma Key), Neon Studio.
        - **Custom**: Manual prompt input.
    - Updated `gemini-image.ts` to dynamically construct prompts based on the selected scenario.
    - Updated `gemini-video.ts` to respect the background physics while maintaining consistency.
- **Improved Prompt Engineering**:
    - Refactored `refinePromptV2` to accept context-aware instructions, allowing for diverse backgrounds beyond the default "wooden table".
- **Database**: Added `meta_scenario` column to `generations` table for analytics.

### Fixed (v3.0.1)
- **Authentication UI**: Resolved "Blinking Sign In" issue caused by an infinite `useEffect` loop in `Header.tsx` during session refresh.
- **Build System**: Fixed persistent `Turbopack` errors and `Unable to acquire lock` issues by ensuring clean dependency installation in the correct `v.3.0.1` directory.
- **Middleware**: Optimized `middleware.ts` to prevent unnecessary session updates on static asset requests.

### Added (v3.1 - Admin & Analytics)
- **Admin Dashboard**:
    - Protected `/admin` route accessible only to users with `role: 'admin'`.
    - Real-time visualization of Credit Burn, Total Generations, and Error Rates.
    - Detailed **Usage Logs** table showing every generation attempt, latency, model used, and cost.
    - Admin Badge in Header for super-users.
- **Analytics System**:
    - Created `usage_logs` table to track every interaction (Image/Video) with the AI models.
    - Captures business metadata: Voice Style, Language, and Viral Mode status.
    - Implemented secure RLS policies allowing users to insert their own logs and admins to view all.
- **Authentication Improvements**:
    - **Professional Auth Flow**:
        - **Sign Up**: Dedicated registration page with strict whitelist verification.
        - **Forgot Password**: Password reset flow via email magic links.
        - **Reset Password**: Secure password update page.
    - Added `middleware.ts` to properly manage Supabase Auth sessions in Next.js Server Components.
    - Added `auth/callback` route to handle secure redirects.
    - Implemented strict Role-Based Access Control (RBAC) for Admin features.

## [2.1.0] - 2026-02-11

### Fixed
- **UI Bug**: Fixed "Generate with AI" button being unclickable due to CSS positioning overlap.
- **Dependency**: Fixed missing `tailwindcss` dependency by ensuring clean install.

### Added
- **New Workflow**: Split creation process into 3 distinct steps: `Create` -> `Approve` -> `Result` for better control.
- **Logo Integration**: 
    - Added ability to upload a brand logo.
    - Implemented client-side canvas composition to overlay logo on the character image automatically.
- **Voice Control**: Added `Voice Style` selector (Cartoon, Monster, Child, Male, Female) to customize Veo's audio output.
- **Favorites System**: 
- **Favorites System**:
    - Users can now save their favorite scripts locally (browser storage).
    - Quick access dropdown to load saved scripts.
- **Persistent Downloads**:
    - "Download Image" button remains available even after video generation.
    - Images are displayed alongside the final video.
- **Video Prompt Approval**:
    - Added an intermediate step to review the character and **edit the text prompt** sent to Veo before generation.
- **External Image Upload**: Users can now upload their own character images instead of generating them with AI.

## [2.0.0] - 2026-02-11

### Major Changes
- **Full Gemini Migration**: Completely replaced Replicate integration (Image, Audio, Video) with Google's native Generative AI stack.
    - **Image Generation**: Switched from Replicate/SDXL to **Google Imagen 3.0** (`imagen-3.0-generate-001`).
    - **Video Generation**: Switched from Replicate/SadTalker to **Google Veo** (`veo-3.1-generate-preview`).
    - **Script & Prompt**: Continued use of Gemini 1.5/2.0 for text logic.
- **Architecture**:
    - Implemented `gemini-image.ts` and `gemini-video.ts` server actions.
    - Refactored `FormData` submission to bypass Next.js Server Action serialization limits ("Maximum array nesting").

### Fixed
- **Video Playback**: Fixed 403 Forbidden error on Veo video links by automatically appending the API Key to the URL.
- **API Quotas**: Mitigated Veo 2.0 `429 Resource Exhausted` errors by switching to the `veo-3.1-generate-preview` model.
- **Payload Handling**: Fixed `INVALID_ARGUMENT` errors in Veo API by implementing the correct `mimeType` and `bytesBase64Encoded` structure.

### Added
- **Image Download**: Added a "Download Image" button in the preview section to save the generated character before video creation.

## [1.1.1] - 2026-02-09

### Fixed
- **Video Animation**: Reverted SadTalker model to `cjwbw/sadtalker` (Hash: `a519cc...`) after `lucataco` version started failing with internal errors.
- **Image Prompts**:
    - Fixed an issue where the image generation prompt was not updating due to server-side caching.
    - Improved prompt composition to strictly enforce a "Medium Shot" on a "Wooden Restaurant Table" with a "Blurred Family Background" for better context.
    - Renamed server action to `refinePromptV2` to ensure fresh logic deployment.

## [1.1.0] - 2026-02-09

### Added
- **Internationalization (i18n)**:
    - Added English (`en`) as the default language.
    - Added a toggle button (🇺🇸/🇧🇷) in the header to switch between English and Portuguese.
    - Implemented a translation dictionary for the entire `CreationForm` UI.
    - Updated "Viral Mode" to adapt context (Coxinha -> "Brazilian Snack") based on the selected language.
    - Updated Gemini prompt generation to strictly respect the selected language for scripts.

## [1.0.1] - 2026-02-09

### Fixed
- **Gemini Model Availability**: Resolved 404 errors by switching the default model from `gemini-pro` to `gemini-3-flash-preview` (and `gemini-2.5-flash` as backup). Added a model selector in the UI.
- **Replicate Image Generation**: 
    - Fixed `ReadableStream` error by implementing manual polling with `replicate.predictions.create` instead of `replicate.run`.
    - Switched from `stability-ai/sdxl` to `bytedance/sdxl-lightning-4step` for faster generation and lower cost.
    - Added `disable_safety_checker: true` to prevent false positive NSFW blocks on cartoon characters (e.g., "bitten" keyword).
- **TTS Generation**:
    - Replaced `adirik/styletts2` with `suno-ai/bark` for better stability and to avoid file input requirements of `xtts-v2`.
    - Implemented retry logic for 429 (Rate Limit) errors.
- **Video Animation (SadTalker)**:
    - Fixed `exceptions must derive from BaseException` crash by updating the model version.
    - Switched to `lucataco/sadtalker` (Hash: `85c698db...`) which proved more robust than `cjwbw/sadtalker`.
- **Code Syntax**: Fixed a nested `try-catch` block syntax error in `replicate.ts` that was preventing the build.

### Added
- **Dynamic Model Selection**: User can now choose between different Gemini models in the interface.
- **Robust Error Handling**: Added detailed error messages for each stage of the pipeline (Script, Image, Audio, Video) to aid debugging.

### Changed
- **Prompt Engineering**: Updated Gemini system instructions to strictly enforce SFW (Safe For Work) prompts, automatically softening violent terms (e.g., "bitten" -> "scared") to pass content filters.

## [1.0.0] - 2026-02-08

### Added
- Initial project release with Next.js 15 + Tailwind CSS.
- Integration with Google Gemini API for script generation.
- Integration with Replicate API for Image, Audio, and Video generation.
