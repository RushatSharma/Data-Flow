// Mock user database
const MOCK_USERS = [
  {
    id: "1",
    username: "demo",
    email: "demo@datrix.com",
    password: "password123",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    username: "admin",
    email: "admin@datrix.com",
    password: "admin123",
    createdAt: "2024-01-01T00:00:00Z",
  },
];

const AUTH_KEY = "datrix_auth";
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export class AuthService {
  static login(username, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = MOCK_USERS.find(
          (u) => u.username === username && u.password === password
        );

        if (user) {
          const authUser = {
            id: user.id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
          };
          const authData = { user: authUser, expiresAt: Date.now() + SESSION_DURATION };
          localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
          resolve(authUser);
        } else {
          reject(new Error("Invalid username or password"));
        }
      }, 500); // Simulate network delay
    });
  }

  static signup(username, email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const existingUser = MOCK_USERS.find(
          (u) => u.username === username || u.email === email
        );
        if (existingUser) {
          reject(new Error("Username or email already exists"));
          return;
        }

        const newUser = {
          id: String(MOCK_USERS.length + 1),
          username,
          email,
          password,
          createdAt: new Date().toISOString(),
        };
        MOCK_USERS.push(newUser);

        const authUser = {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          createdAt: newUser.createdAt,
        };

        const authData = { user: authUser, expiresAt: Date.now() + SESSION_DURATION };
        localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
        resolve(authUser);
      }, 500);
    });
  }

  static logout() {
    localStorage.removeItem(AUTH_KEY);
  }

  static getCurrentUser() {
    try {
      const authData = localStorage.getItem(AUTH_KEY);
      if (!authData) return null;

      const { user, expiresAt } = JSON.parse(authData);

      if (Date.now() > expiresAt) {
        this.logout();
        return null;
      }
      return user;
    } catch {
      return null;
    }
  }
}