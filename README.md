# Chef Gourmet IA 👨‍🍳

A luxury AI cooking assistant that turns your available ingredients or fridge photos into gourmet recipes.

## 🌟 Two Ways to Run This Project

This project is designed to be flexible. You can run it as a standalone static web app (perfect for GitHub Pages) or as a full-stack application with a Python backend for advanced RAG capabilities.

### 1. The "Web" Version (GitHub Pages / Client-Side)

This version runs entirely in your browser using React. It communicates directly with the Google Gemini API.

**How to Deploy to GitHub Pages:**

1.  **Create a Repository:** Create a new public repository on GitHub (e.g., `chef-gourmet-ai`).
2.  **Push Code:** Push all these files to your new repository.
3.  **Install Dependencies:**
    Run this in your terminal:
    ```bash
    npm install
    ```
4.  **Configure Base URL:**
    Open `vite.config.ts` and change the `base` property to match your repository name:
    ```ts
    // If your repo is https://github.com/yourname/my-chef
    base: '/my-chef/',
    ```
5.  **Deploy:**
    Run this command to build and deploy to the `gh-pages` branch:
    ```bash
    npm run deploy
    ```
6.  **Enable Pages:**
    Go to your GitHub Repository Settings -> Pages. Ensure "Source" is set to "Deploy from a branch" and select `gh-pages` / `root`.

**Usage:**
1.  Open your deployed link (e.g., `https://yourname.github.io/my-chef/`).
2.  Click the **Settings (⚙️)** icon in the top right.
3.  Enter your **Google Gemini API Key**.
    *   *Note: Your key is stored in your browser's LocalStorage and is never sent to our servers.*

---

### 2. The "Pro" Version (Local Backend + RAG)

This version allows you to run a Python server (`FastAPI`) equipped with `LangChain`. This enables the "Chef Brain" to read from a specific PDF (e.g., your family recipe book) to ground its answers, ensuring authenticity.

**Prerequisites:**
*   Python 3.9+
*   OpenAI API Key (for the RAG embeddings)

**Setup:**

1.  **Navigate to the backend folder:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

3.  **Add your Knowledge Base:**
    *   Place a PDF file named `recipes.pdf` in the `backend/` folder.

4.  **Run the Server:**
    ```bash
    export OPENAI_API_KEY="sk-..."
    uvicorn main:app --reload
    ```
    The server will start at `http://localhost:8000`.

**Note:** The current React frontend is configured to use the Gemini API directly. To fully utilize the Python backend, you would extend `geminiService.ts` to make `fetch` calls to `http://localhost:8000/ask-chef` instead of calling the Google SDK.

## 🛠 Tech Stack

*   **Frontend:** React 18, TypeScript, TailwindCSS, Recharts, Vite.
*   **AI (Web):** Google Gemini 2.5 Flash & Pro.
*   **Backend (Optional):** FastAPI, LangChain, ChromaDB.

Enjoy cooking! 🥘