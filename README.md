# 🌍 TravelTally - Smart Trip Planning & Expense Management

**TravelTally** is a web-based travel planning application that helps users seamlessly organize their trips, manage expenses, track budgets, and collaborate with tripmates. It simplifies group travel by offering transparent expense tracking, cost splitting, and real-time collaboration features.

## 🚀 Features

- ✈️ Trip creation and management  
- 🧾 Expense tracking and budget monitoring  
- 💸 Cost splitting and owed share calculations  
- 👥 Tripmate collaboration  
- 📩 Notifications and reminders  
- 🔐 Secure authentication system  
- 🌐 Responsive and user-friendly interface

## 🛠 Tech Stack

### Frontend:
- React.js
- CSS 

### Backend:
- Node.js
- Express.js

### Database:
- MongoDB (with Mongoose)

## 🖼️ Screenshots

## ✅ Setup Instructions

1. Clone the repo  
```bash
git clone https://github.com/Kavana-navada/TravelTally.git
cd traveltally
```
2. Install dependencies

```bash
cd frontend
npm install
cd ../backend
npm install
```

3. Set up environment variables (.env file) for the backend:

```ini
CLIENT_URL=http://localhost:3000  # Frontend URL
CLIENT_ID=253036545255-u14srh27k0q15incpe1fa907nqupf6mv.apps.googleusercontent.com
CLIENT_SECRET=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
SESSION_SECRET=3e3b63f557c529d15805f4362424e79c57884ef3caafafe6e8824665b363f0c07156bea3b8e1ccf797b340b0aff0a014d6f6597c809166959084f798447f4264
MONGODB_URI=mongodb://127.0.0.1:27017/traveltally
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

JWT_SECRET=5ec98782059a497f5592eb1e289d4e74f46913148809f2178aceec9c693ddba9fbafbb68252686ce3280acbb6c37d936ef80ef58409288c8334ab6e24b25fbb0
NODE_ENV="development"

EMAIL_USER=help.traveltally@gmail.com
EMAIL_PASS=rkbf ntyu hocx dxda
```

4. Run the development server:

```bash
cd backend
node server.js
```
```bash
cd frontend
npm start
```

5. Visit http://localhost:3000 to access the app.



