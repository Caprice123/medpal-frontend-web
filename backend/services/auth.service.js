import loginService from '#services/auth/loginService';


// Re-export all methods from loginService
const authService = {
  login: loginService.login.bind(loginService),
  deactivateUserSessions: loginService.deactivateUserSessions.bind(loginService),
  verifyToken: loginService.verifyToken.bind(loginService),
  refreshToken: loginService.refreshToken.bind(loginService),
  logout: loginService.logout.bind(loginService),
  getUserSessions: loginService.getUserSessions.bind(loginService),
};

export default authService;
