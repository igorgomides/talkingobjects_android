# Talking Objects (Gemini Edition) 🤖🎤

A Next.js application designed to create viral "Talking Objects" videos for Instagram Reels and TikTok. It leverages the power of Google's **Gemini** for scriptwriting, **Imagen** for high-quality 3D image generation, and **Veo** for video animation.

## ✨ Features (v4.2.0 Shiny SaaS Edition)

-   **📱 Mobile-First Design**:
    -   **V4 UI Redesign**: Brand new "shiny and bubbly" futuristic aesthetic featuring frosted glass cards, neon glows, and 3D interactive buttons.
    -   **Dynamic Text Inputs**: Text areas (Script and AI Instructions) auto-resize smoothly to accommodate content natively without scrollbars.
    -   **Responsive UI**: Optimized for mobile devices with touch-friendly inputs.
    -   **App-Like Experience**: Native status bar integration, safe area handling, and smooth transitions.
    -   **Wizard Flow**: **5-step linear creation wizard** (Character → Scene & Framing → Script → Image → Settings) with progress indicator dots, slide animations, smart field validation, and **automatic prompt invalidation** when scene/framing changes.
    -   **Camera Framing Picker**: 6 illustrated photography composition options (Center, Low Angle, High Angle, Close-Up, Wide Shot, Rule of Thirds) to control character positioning.
    -   **Hamburger Menu**: Clean navigation with slide-out drawer for user settings.
    -   **Interactive Tutorial**: Beautiful animated `/tutorial` page explaining all features, fully localized in EN/PT, featuring real mobile-optimized app screenshots.
    -   **SEO About Page**: `/about` page optimized for Google and AI search with Schema.org structured data, strategic internal linking, and an FAQ accordion.

-   **🤖 Complete AI Pipeline**:
    -   **Script**: Gemini 2.0 Flash (Bilingual EN/PT).
    -   **Image**: Google Imagen 3.0 (High-fidelity 3D characters).
    -   **Video**: Google Veo 3.1 (State-of-the-art animation).
    -   **Dynamic Scenarios**: Choose from 5+ environments (Green Screen, Neon Studio, etc.) or create custom backgrounds.

-   **🔐 Enterprise-Grade Auth & Lead Capture**:
    -   Secure Email/Password via Supabase Auth.
    -   **Lead Capture Landing Page** (`/invite`) with integrated video showcase and "Golden Tip" credit strategy.
    -   **Dual Whitelist System**: Access control supporting both Premium Alpha users and Beta Invite leads.
    -   Professional Flow: Sign Up, Forgot Password, Reset Password.
    -   **Reliable Error Handling**: Cloud functions smartly return specific errors (e.g., rate limits, prompt blocks) to the client, preventing opaque server faults.

-   **💳 Monetization & Credits**:
    -   **Stripe Integration** for credit purchases.
    -   Real-time credit balance tracking.
    -   Tiered usage costs:
        -   **Script**: Free (0 credits).
        -   **Image**: 1 Credit.
        -   **Video**: 
            -   **Fast (Veo 3.1 Fast)**: 15 Credits (6s) | 25 Credits (8s).
            -   **High Quality (Veo 3.1)**: 40 Credits (6s) | 60 Credits (8s).
    -   **Available Packages**:
        -   **Starter**: 35 Credits (R$ 29).
        -   **Creator**: 130 Credits (R$ 99).
        -   **Agency**: 450 Credits (R$ 299).

-   **📊 Admin Dashboard**:
    -   Dedicated `/admin` route for super-users.
    -   **Live Analytics**: Track total generations, error rates, and credit burn.
    -   **Financials**: Monitor **Revenue**, **Costs**, **Profit**, and **Outstanding Liability**.
    -   **Usage Logs**: Detailed audit trail with **User Email**, **Asset Links**, and **Date Range Filtering**.
    -   **User Management**:
        -   **Whitelist Control**: Add/Remove users.
        -   **Credit Adjustments**: Manually grant or revoke credits.

-   **☁️ Cloud Features**:
    -   **Favorites**: Save/Load scripts from the cloud.
    -   **History**: Track video generation history.

## 🛠️ Tech Stack

-   **Frontend**: Next.js 15 (App Router), Tailwind CSS, Lucide React
-   **Backend**: Supabase (PostgreSQL, Auth, Realtime, Edge Functions)
-   **AI**: Google Gemini/Imagen/Veo APIs
-   **Payments**: Stripe Connect

## 🚀 Getting Started

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/ai-speaking-object.git
    cd webapp\ gemini
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**:
    Create a `.env.local` file in the `webapp` directory and add your keys:
    ```bash
    NEXT_PUBLIC_GEMINI_API_KEY=your_google_gemini_key_here
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    STRIPE_SECRET_KEY=your_stripe_secret
    STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
    SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role
    ```

4.  **Database Setup (Supabase)**:
    -   Go to the Supabase SQL Editor.
    -   Run the scripts in `supabase/` folder in this order:
        1.  `schema.sql` (Core tables)
        2.  `usage_logs_v3.2.sql` (Logging)
        3.  `storage.sql` (Asset Bucket)
        4.  `transactions.sql` (Credit Sales)
        5.  `rpc_increment.sql` (Atomic Credit Updates)

5.  **Run the development server**:
    ```bash
    npm run dev
    ```

6.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Usage

1.  **Step 1 — Character**: Enter the object name (e.g., "A Coffee Cup"), select an emotion, and provide a reason.
2.  **Step 2 — Scene & Framing**: Choose a background scenario and camera framing position.
3.  **Step 3 — Script**: Generate an AI script or write your own.
4.  **Step 4 — Image**: Generate the image prompt with AI or upload your own image.
5.  **Step 5 — Settings**: Choose voice style, upload a logo, and click "Generate Image".
6.  **Approve & Animate**: Review the generated image, then animate it into a video with Veo.
7.  **Download**: Preview and download your MP4.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
