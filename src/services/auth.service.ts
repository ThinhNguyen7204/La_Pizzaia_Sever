class AuthService {
  async login(payload: { email: string; password: string }) {
    const { email, password } = payload
    if (email === 'user@gmail.com' && password === '123456') {
      return {
        message: 'Login success'
      }
    }
  }
}

const authService = new AuthService()
export default authService
