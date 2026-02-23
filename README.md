Anti-Gravity Controller 🛸
An intuitive web application that translates live voice messages between English and Finnish with near-zero latency.

🛠 How This Was Created
1. Code Generation
The core logic was built using Anti-Gravity. Instead of having the AI deploy the app, the source code was generated locally using the following prompt:

Prompt: Give me a code for making a language translator which listens and translates the language to Finnish language. If the language is Finnish, it converts into English. I want output in text, but input should be live voice. There should be no latency. I should have a toggle button to have choice from En to Fi or Fi to EN.

2. Local Environment Setup
Because this application utilizes the Web Speech API, it requires a secure context (local server) to access the microphone.

Navigate to the directory:

Bash
cd "Language translator - Antigravity"
Launch the server:

Bash
npx serve
Open in Browser:
Navigate to http://localhost:3000.
Note: Use Google Chrome or Microsoft Edge for full Speech API support.

📸 Screenshots

<img width="1909" height="1061" alt="Screenshot 2026-02-23 232001" src="https://github.com/user-attachments/assets/264cfa7d-2ad8-4f25-b366-b14ccdc2bd7b" />
<img width="1729" height="1021" alt="Screenshot 2026-02-23 230611" src="https://github.com/user-attachments/assets/77e0a019-a434-4376-a439-5cbff937cc3c" />
<img width="1557" height="1032" alt="Screenshot 2026-02-23 230629" src="https://github.com/user-attachments/assets/ac9dee73-c5ce-4bdb-a17c-9c190cc759a5" />
<img width="1532" height="914" alt="Screenshot 2026-02-23 231445" src="https://github.com/user-attachments/assets/647b5a8e-3a26-4e86-b272-1332ac113bb6" />
<img width="1456" height="923" alt="Screenshot 2026-02-23 231519" src="https://github.com/user-attachments/assets/7b716706-9b15-4a59-aa3e-029e42371318" />


📤 How to Move to GitHub
Step 1: Create a Repository on GitHub
Log in to your GitHub account.

Click the + icon in the top right and select New repository.

Name it anti-gravity-translator.

Set visibility to Public.

Important: Do not check the boxes for "Add a README" or ".gitignore" (as these already exist in your local folder).

Click Create repository and copy the HTTPS URL.

Step 2: Initialize Git Locally
Open your terminal in the project folder and execute these commands:

Bash
# 1. Initialize the folder as a Git repository
git init

# 2. Add all your files to the staging area
git add .

# 3. Save your changes with a message
git commit -m "Initial commit: Anti-gravity translator ready for deployment"
Step 3: Link and Push to GitHub
Connect your local folder to your GitHub repository. (Replace the URL with your actual URL from Step 1):

Bash
# 4. Point your local code to your GitHub URL
git remote add origin https://github.com/YOUR_USERNAME/anti-gravity-translator.git

# 5. Rename your default branch to 'main'
git branch -M main

# 6. Upload your code
git push -u origin main
Step 4: Verify the Results
Refresh your GitHub repository page. You should now see your index.html, app.js, style.css, and this README.md file displayed perfectly on the front page.

Would you like me to show you how to add a "Live Demo" link to the top of this README once it's pushed?
