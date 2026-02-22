# Talking Objects (Gemini Edition) 🤖🎤

A Next.js application designed to create viral "Talking Objects" videos for Instagram Reels and TikTok. It leverages the power of Google's **Gemini** for scriptwriting, **Imagen** for high-quality 3D image generation, and **Veo** for video animation.

## ✨ Features (v3.12.1 SaaS Edition)

-   **📱 Mobile-First Design**:
    -   **Responsive UI**: Optimized for mobile devices with touch-friendly inputs.
    -   **App-Like Experience**: Native status bar integration, safe area handling, and smooth transitions.
    -   **Wizard Flow**: Step-by-step creation process (Script -> Image -> Video) for simplicity. Dynamic inputs guide users and prevent editing before AI generation finishes.
    -   **Hamburger Menu**: Clean navigation with slide-out drawer for user settings.
    -   **Interactive Tutorial**: Beautiful animated `/tutorial` page explaining all features, fully localized in EN/PT, featuring real mobile-optimized app screenshots.

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

1.  **Configure**: Enter the object name (e.g., "A Coffee Cup"), select an emotion, and provide a context/reason.
2.  **Generate Script**: Click the "Gerar com IA" button to let Gemini write the script.
3.  **Create**: Click "Gerar Vídeo Viral". The app will:
    -   Refine the prompt.
    -   Generate the 3D image (Imagen).
    -   Animate the video (Veo).
4.  **Download**: Once done, preview the video and click "Baixar MP4".

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
