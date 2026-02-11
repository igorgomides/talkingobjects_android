# AI Speaking Object (Gemini Edition) 🤖🎤

A Next.js application designed to create viral "Talking Objects" videos for Instagram Reels and TikTok. It leverages the power of Google's **Gemini** for scriptwriting, **Imagen** for high-quality 3D image generation, and **Veo** for video animation.

## ✨ Features

-   **Bilingual Support**: Switch instantly between English (Default) and Portuguese.
-   **AI Script Writer**: Generates funny, first-person scripts using **Gemini 2.5**.
-   **3D Character Generator**: Creates Pixar-style 3D characters using **Google Imagen 3.0**.
-   **Video Animation**: Animates the character's face and movement using **Google Veo 3.1**.
-   **"Viral Mode"**: A one-click preset to generate a viral concept (Coxinha/Brazilian Snack).
-   **Cyberpunk UI**: A modern, dark-mode interface built with Tailwind CSS.

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
    Create a `.env.local` file in the `webapp` directory and add your Google API key:
    ```bash
    NEXT_PUBLIC_GEMINI_API_KEY=your_google_gemini_key_here
    ```

4.  **Run the development server**:
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) in your browser.

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
