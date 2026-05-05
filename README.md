# Allenty - Inventory Management System

A comprehensive full-stack inventory management solution with web and mobile applications.

## Features

- 📱 **Mobile App** - React Native cross-platform mobile application
- 🌐 **Web Dashboard** - Next.js web interface with modern UI
- 🔌 **REST API** - Django REST Framework backend
- 📊 **Analytics & Reports** - Real-time inventory tracking and reporting
- 🔔 **Alerts** - Stock level monitoring and notifications
- 👤 **User Management** - Authentication and role-based access
- 📦 **Product Management** - Full CRUD operations for inventory items
- 🐳 **Docker Support** - Containerized deployment

## Tech Stack

### Backend
- **Framework**: Django + Django REST Framework
- **Database**: SQLite (development)
- **Python**: 3.x

### Frontend - Web
- **Framework**: Next.js
- **Styling**: Tailwind CSS
- **Charts**: Chart.js with react-chartjs-2
- **HTTP Client**: Axios

### Frontend - Mobile
- **Framework**: React Native with Expo
- **Language**: JavaScript/TypeScript
- **Platform**: iOS & Android

### DevOps
- **Containerization**: Docker & Docker Compose
- **Web Server**: Gunicorn

## Project Structure

```
Allenty-main/
├── backend/                    # Django REST API
│   ├── core/                  # Project settings
│   ├── products/              # Product management app
│   ├── manage.py              # Django management script
│   ├── requirements.txt        # Python dependencies
│   └── Dockerfile             # Backend container
│
├── frontend-web/              # Next.js web application
│   ├── src/
│   │   ├── app/              # App routes
│   │   ├── components/       # React components
│   │   ├── services/         # API services
│   │   └── context/          # Context API
│   ├── package.json
│   └── Dockerfile            # Web container
│
├── frontend-mobile/           # React Native mobile app
│   ├── src/
│   │   ├── screens/          # Screen components
│   │   ├── navigation/       # Navigation setup
│   │   ├── services/         # Offline storage
│   │   └── api/              # API client
│   ├── app.json
│   └── package.json
│
└── docker-compose.yml         # Docker orchestration

```

## Installation

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- Docker & Docker Compose (optional)

### Backend Setup

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run development server
python manage.py runserver
```

Backend will be available at `http://localhost:8000`

### Frontend - Web Setup

```bash
cd frontend-web

# Install dependencies
npm install

# Run development server
npm run dev
```

Web app will be available at `http://localhost:3000`

### Frontend - Mobile Setup

```bash
cd frontend-mobile

# Install dependencies
npm install

# Start Expo development server
npx expo start
```

Scan the QR code with Expo Go app on your phone.

### Docker Deployment

```bash
# Build and start all services
docker-compose up --build

# Services will run on:
# - Backend API: http://localhost:8000
# - Web App: http://localhost:3000
# - Database: SQLite (backend/db.sqlite3)
```

## Usage

### Mobile App Features
- User authentication
- Dashboard with inventory overview
- Product listing and details
- Barcode scanning for inventory management
- Offline capability with sync
- Alerts for low stock items
- User profile management

### Web Dashboard Features
- Complete inventory management
- Advanced analytics and reports
- Employee management
- Stock alerts configuration
- Real-time inventory tracking
- Chart visualizations

### API Endpoints
- `/api/products/` - Product management
- `/api/auth/` - Authentication
- More endpoints available in Django admin

## Development

### Running Tests

```bash
cd backend
python manage.py test

cd frontend-web
npm test

cd frontend-mobile
npm test
```

### Code Style

- Backend: Follow PEP 8
- Frontend: ESLint configuration included

## Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit your changes (`git commit -m 'Add AmazingFeature'`)
3. Push to the branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue on GitHub or contact the development team.

## Roadmap

- [ ] Cloud database integration (PostgreSQL/MongoDB)
- [ ] Payment gateway integration
- [ ] Advanced reporting features
- [ ] Machine learning for demand forecasting
- [ ] Multi-language support
- [ ] Mobile app push notifications
- [ ] Audit logging system

---

**Made with ❤️ by Yash Pandya**
