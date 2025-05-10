// src/test/components/Auth.test.tsx
import { describe, it, expect, vi } from 'vitest';
import AuthComponent from '@/components/Auth';
import { JSDOM } from 'jsdom';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';

const navigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

describe('Auth component', () => {
  it('should import without errors', () => {
    expect(AuthComponent).toBeDefined();
  });

  it('should render without errors', () => {
    const dom = new JSDOM('<!DOCTYPE html><html><body><div id="root"></div></body></html>', {
      url: 'http://localhost',
      contentType: "text/html",
      includeNodeLocations: true,
      storageQuota: 10000000
    });

    global.document = dom.window.document;
    global.window = dom.window as any;

    const container = document.getElementById('root')!;
    ReactDOM.render(
      React.createElement(
        BrowserRouter,
        {},
        React.createElement(AuthProvider, {children: React.createElement(AuthComponent, {})})
      ),
      container
    );

    expect(document.body.innerHTML).toContain('Welcome to JobMatch');
  });
});
