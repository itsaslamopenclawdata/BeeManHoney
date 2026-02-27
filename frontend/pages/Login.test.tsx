/**
 * Login page tests.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';

// Mock the api module
vi.mock('../services/api', () => ({
  default: {
    post: vi.fn(),
  },
}));

// Mock MobileNav component
vi.mock('../components/MobileNav', () => ({
  MobileNav: () => <div data-testid="mobile-nav">Mobile Navigation</div>,
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(component, { wrapper: BrowserRouter });
};

describe('Login Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Rendering', () => {
    it('renders the login form', () => {
      renderWithRouter(<Login />);
      expect(screen.getByText('Welcome Back!')).toBeInTheDocument();
      expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });

    it('renders the logo', () => {
      renderWithRouter(<Login />);
      expect(screen.getByAltText('BeeManHoney Logo')).toBeInTheDocument();
    });

    it('renders login button', () => {
      renderWithRouter(<Login />);
      // Use type='submit' to be more specific
      const buttons = screen.getAllByRole('button');
      const loginButton = buttons.find(btn => btn.textContent === 'Login');
      expect(loginButton).toBeInTheDocument();
    });

    it('renders QR code login button', () => {
      renderWithRouter(<Login />);
      expect(screen.getByRole('button', { name: /login with scan code/i })).toBeInTheDocument();
    });

    it('renders signup link', () => {
      renderWithRouter(<Login />);
      expect(screen.getByText(/don't have an account\?/i)).toBeInTheDocument();
      expect(screen.getByText('Sign Up')).toBeInTheDocument();
    });

    it('renders admin access link', () => {
      renderWithRouter(<Login />);
      expect(screen.getByText('Admin Access')).toBeInTheDocument();
    });
  });

  describe('Form Interaction', () => {
    it('allows entering email and password', () => {
      renderWithRouter(<Login />);

      const emailInput = screen.getByLabelText('Email Address');
      const passwordInput = screen.getByLabelText('Password');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      expect(emailInput).toHaveValue('test@example.com');
      expect(passwordInput).toHaveValue('password123');
    });

    it('shows error message on failed login', async () => {
      const api = await import('../services/api');
      vi.mocked(api.default.post).mockRejectedValue(new Error('Invalid credentials'));

      renderWithRouter(<Login />);

      const emailInput = screen.getByLabelText('Email Address');
      const passwordInput = screen.getByLabelText('Password');

      // Find the submit button specifically
      const buttons = screen.getAllByRole('button');
      const loginButton = buttons.find(btn => btn.textContent === 'Login');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
      if (loginButton) fireEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
      });
    });

    it('submits form with valid credentials', async () => {
      const api = await import('../services/api');
      vi.mocked(api.default.post).mockResolvedValue({
        data: { access_token: 'fake-token' }
      });

      renderWithRouter(<Login />);

      const emailInput = screen.getByLabelText('Email Address');
      const passwordInput = screen.getByLabelText('Password');

      // Find the submit button specifically
      const buttons = screen.getAllByRole('button');
      const loginButton = buttons.find(btn => btn.textContent === 'Login');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      if (loginButton) fireEvent.click(loginButton);

      await waitFor(() => {
        expect(localStorage.getItem('token')).toBe('fake-token');
      });
    });
  });

  describe('QR Code Mode', () => {
    it('switches to QR scan mode when button is clicked', () => {
      renderWithRouter(<Login />);

      const qrButton = screen.getByRole('button', { name: /login with scan code/i });
      fireEvent.click(qrButton);

      expect(screen.getByText('Scan QR Code')).toBeInTheDocument();
    });

    it('closes QR scan mode when X is clicked', () => {
      renderWithRouter(<Login />);

      // Open QR mode
      const qrButton = screen.getByRole('button', { name: /login with scan code/i });
      fireEvent.click(qrButton);

      // Close QR mode - find the X button in the QR mode header
      const closeButton = screen.getAllByRole('button').find(
        btn => btn.classList.contains('hover:bg-gray-100')
      );

      if (closeButton) {
        fireEvent.click(closeButton);
        expect(screen.getByText('Welcome Back!')).toBeInTheDocument();
      }
    });

    it('has cancel button in QR mode', () => {
      renderWithRouter(<Login />);

      // Open QR mode
      const qrButton = screen.getByRole('button', { name: /login with scan code/i });
      fireEvent.click(qrButton);

      expect(screen.getByRole('button', { name: /cancel scan/i })).toBeInTheDocument();
    });
  });
});
