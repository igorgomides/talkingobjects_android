# AI Speaking Object (Gemini Edition) 🤖🎤

A Next.js application designed to create viral "Talking Objects" videos for Instagram Reels and TikTok. It leverages the power of Google's **Gemini Pro** for scriptwriting and prompt engineering, and **Replicate** for high-quality 3D image generation and lip-sync animation.

## ✨ Features

-   **Bilingual Support (New)**: Switch instantly between English (Default) and Portuguese.
-   **AI Script Writer**: Generates funny, first-person scripts based on an object and emotion.
-   **3D Character Generator**: Creates Pixar-style 3D characters using Stable Diffusion XL.
-   **Lip-Sync Animation**: Animates the character's face to match the generated audio (SadTalker).
-   **"Viral Mode"**: A one-click preset to generate a viral concept (Coxinha/Brazilian Snack).
-   **Cyberpunk UI**: A modern, dark-mode interface built with Tailwind CSS.

    ```

3.  **Configure Environment Variables**:
    Create a `.env.local` file in the `webapp` directory and add your keys:
    ```bash
    NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_key_here
    REPLICATE_API_TOKEN=your_replicate_token_here
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
    -   Generate the 3D image.
    -   Animate the video.
4.  **Download**: Once done, preview the video and click "Baixar MP4".

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
