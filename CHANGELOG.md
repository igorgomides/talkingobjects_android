# Changelog

All notable changes to the "AI Speaking Object" project will be documented in this file.

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
