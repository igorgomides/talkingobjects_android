# Changelog

All notable changes to the "AI Speaking Object" project will be documented in this file.

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
- **Security**:
    - Enabled Row Level Security (RLS) policies on `whitelist`, `profiles`, and `generations` tables to ensure data privacy.

### Fixed
- **Veo Video Generation**:
    - Fixed `404 Not Found` error by switching API endpoint to `predictLongRunning` which is required for video models.
    - Fixed `400 Bad Request` by removing unsupported `videoFormat` parameter from the payload.
    - Resolved `url is not defined` regression in the server action.
- **Credit System**:
    - Fixed credit deduction failure caused by RLS policies blocking direct updates.
    - Implemented a secure PostgreSQL RPC function `decrement_credits` to handle balance updates safely on the server side.
- **Real-time UX**:
    - Converted `Header` to a Client Component to support real-time updates.
    - Implemented Supabase Realtime subscription to instantly reflect credit deductions in the UI without page refresh.

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
