# Test Credentials for Hand2Hand

## Admin Login
- **URL**: http://localhost:3001 (Admin portal)
- **Email**: admin@test.com
- **Password**: admin123
- **Role**: Administrator

## Student Login
- **URL**: http://localhost:3000 (Main portal)
- **Email**: student@test.com
- **Password**: student123
- **Role**: Student
- **Profile**: Visual disability, Mumbai University student

## Volunteer Login
- **URL**: http://localhost:3000 (Main portal)
- **Email**: volunteer@test.com
- **Password**: volunteer123
- **Role**: Volunteer
- **Profile**: Verified volunteer with Math, Physics, CS expertise

---

## How to Seed Test Users

Run the following command from the backend directory:
```bash
node seedTestUsers.js
```

This will create all test users in your MongoDB database.

## Important Notes

- All test users are pre-verified
- Test users will be deleted and recreated each time you run the seed script
- Change passwords in production environment
