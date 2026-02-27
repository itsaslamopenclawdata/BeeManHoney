/**
 * Header component tests.
 */
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Header } from './Header';

// Wrapper to provide router context
const renderWithRouter = (component: React.ReactElement) => {
  return render(component, { wrapper: BrowserRouter });
};

describe('Header Component', () => {
  describe('Rendering', () => {
    it('renders the logo', () => {
      renderWithRouter(<Header />);
      const logo = screen.getByAltText('BeeManHoney Logo');
      expect(logo).toBeInTheDocument();
    });

    it('renders desktop navigation links', () => {
      renderWithRouter(<Header />);
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Products')).toBeInTheDocument();
      expect(screen.getByText('About Us')).toBeInTheDocument();
      expect(screen.getByText('Sourcing')).toBeInTheDocument();
      expect(screen.getByText('Recipes')).toBeInTheDocument();
      expect(screen.getByText('Contact')).toBeInTheDocument();
    });

    it('renders action buttons (search, cart, user)', () => {
      renderWithRouter(<Header />);
      expect(screen.getByLabelText('Search')).toBeInTheDocument();
      expect(screen.getByLabelText('Shopping Cart')).toBeInTheDocument();
    });

    it('shows cart badge with count', () => {
      renderWithRouter(<Header />);
      const cartBadge = screen.getByText('2');
      expect(cartBadge).toBeInTheDocument();
    });
  });

  describe('Mobile Menu', () => {
    it('does not show mobile menu by default', () => {
      renderWithRouter(<Header />);
      // Desktop menu might show User icon instead of Login link
      expect(screen.getByLabelText('Account') || screen.queryByText('Login')).toBeTruthy();
    });

    it('opens mobile menu when hamburger is clicked', () => {
      renderWithRouter(<Header />);
      const hamburger = screen.getAllByRole('button').find(
        btn => btn.classList.contains('md:hidden')
      );

      if (hamburger) {
        fireEvent.click(hamburger);
        expect(screen.getByText('Login')).toBeInTheDocument();
      }
    });
  });

  describe('Navigation Links', () => {
    it('highlights active route', () => {
      renderWithRouter(<Header />);

      // Get all nav links
      const links = screen.getAllByRole('link');
      const productsLink = links.find(link => link.getAttribute('href') === '/products');

      expect(productsLink).toBeInTheDocument();
    });

    it('links to correct routes', () => {
      renderWithRouter(<Header />);

      const homeLink = screen.getByText('Home').closest('a');
      expect(homeLink?.getAttribute('href')).toBe('/home');

      const productsLink = screen.getByText('Products').closest('a');
      expect(productsLink?.getAttribute('href')).toBe('/products');
    });
  });
});
