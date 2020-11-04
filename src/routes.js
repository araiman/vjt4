import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import Users from './components/Users';

export const routes = [
  {path: '/register-form', component: RegisterForm, name: 'registerForm'},
  {path: '', component: LoginForm, name: 'loginForm'},
  {path: '/users', component: Users, name: 'users'}
]