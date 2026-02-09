# Changelog

All notable changes to the "AI Speaking Object" project will be documented in this file.

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
