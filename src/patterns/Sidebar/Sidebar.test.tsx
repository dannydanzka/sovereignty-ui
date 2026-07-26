import type { CSSProperties } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { isNavItemActive } from './Sidebar.helpers';
import { Sidebar, SidebarLayout } from './Sidebar';

const ITEMS = [
  { href: '/admin', id: 'home', label: 'Inicio' },
  { href: '/admin/activos', id: 'assets', label: 'Inventario' },
  { badge: 3, href: '/admin/mensajes', id: 'messages', label: 'Mensajes' },
];

describe('isNavItemActive', () => {
  it('matches the section root exactly, so it is not active on every child route', () => {
    expect(isNavItemActive({ currentPath: '/admin', homeHref: '/admin', href: '/admin' })).toBe(
      true
    );
    expect(
      isNavItemActive({ currentPath: '/admin/activos', homeHref: '/admin', href: '/admin' })
    ).toBe(false);
  });

  it('matches children on a segment boundary, not on a bare prefix', () => {
    expect(isNavItemActive({ currentPath: '/admin/activos', href: '/admin/activos' })).toBe(true);
    expect(isNavItemActive({ currentPath: '/admin/activos/7', href: '/admin/activos' })).toBe(true);
    // The bug a plain startsWith() has: a sibling route lighting up the wrong entry.
    expect(isNavItemActive({ currentPath: '/admin/activos-import', href: '/admin/activos' })).toBe(
      false
    );
  });
});

describe('Sidebar.Nav', () => {
  it('marks only the current entry as the current page', () => {
    render(<Sidebar.Nav currentPath='/admin/activos' homeHref='/admin' items={ITEMS} />);
    expect(screen.getByRole('link', { name: 'Inventario' })).toHaveAttribute(
      'aria-current',
      'page'
    );
    expect(screen.getByRole('link', { name: 'Inicio' })).not.toHaveAttribute('aria-current');
  });

  it('fires onNavigate so a product can close the mobile drawer', async () => {
    const onNavigate = vi.fn();
    render(<Sidebar.Nav currentPath='/admin' items={ITEMS} onNavigate={onNavigate} />);
    await userEvent.click(screen.getByRole('link', { name: 'Inventario' }));
    expect(onNavigate).toHaveBeenCalledOnce();
  });

  it('keeps every entry named when collapsed, where the visible label is hidden', () => {
    const { rerender } = render(<Sidebar.Nav currentPath='/admin' items={ITEMS} />);
    expect(screen.getByRole('link', { name: 'Inventario' })).toBeInTheDocument();

    // A collapsed rail is icons only. Without an aria-label the link reaches a screen reader
    // unnamed — which is what every hand-rolled sidebar did.
    rerender(<Sidebar.Nav currentPath='/admin' isCollapsed items={ITEMS} />);
    expect(screen.getByRole('link', { name: 'Inventario' })).toBeInTheDocument();
    // Sighted users get the tooltip instead of the label.
    expect(screen.getAllByText('Inventario')).toHaveLength(2);
  });

  it('renders a badge only for the entries that carry one', () => {
    render(<Sidebar.Nav currentPath='/admin' items={ITEMS} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});

describe('Sidebar.Header', () => {
  const labels = { closeLabel: 'Cerrar', collapseLabel: 'Colapsar', expandLabel: 'Expandir' };

  it('names the avatar button by what the click will DO, not by the state it is in', async () => {
    const onToggleCollapse = vi.fn();
    const { rerender } = render(
      <Sidebar.Header
        {...labels}
        initials='MG'
        name='María García'
        onToggleCollapse={onToggleCollapse}
      />
    );
    await userEvent.click(screen.getByRole('button', { name: 'Colapsar' }));
    expect(onToggleCollapse).toHaveBeenCalledOnce();

    rerender(<Sidebar.Header {...labels} initials='MG' isCollapsed name='María García' />);
    expect(screen.getByRole('button', { name: 'Expandir' })).toBeInTheDocument();
  });

  it('renders the optional badge and omits it when absent', () => {
    const { rerender } = render(<Sidebar.Header {...labels} badge='Owner' name='María García' />);
    expect(screen.getByText('Owner')).toBeInTheDocument();

    rerender(<Sidebar.Header {...labels} name='María García' />);
    expect(screen.queryByText('Owner')).not.toBeInTheDocument();
  });
});

describe('Sidebar.Footer', () => {
  it('keeps an accessible name when the visible label is collapsed away', () => {
    render(<Sidebar.Footer isCollapsed label='Cerrar sesión' onClick={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Cerrar sesión' })).toBeInTheDocument();
  });
});

describe('Sidebar', () => {
  it('closes on the mobile backdrop', async () => {
    const onOverlayClick = vi.fn();
    render(
      <Sidebar isMobileOpen onOverlayClick={onOverlayClick}>
        <Sidebar.Nav currentPath='/admin' items={ITEMS} />
      </Sidebar>
    );
    await userEvent.click(screen.getByTestId('sidebar-overlay'));
    expect(onOverlayClick).toHaveBeenCalledOnce();
  });
});

describe('SidebarLayout', () => {
  it('offsets the content by the same width the rail uses, collapsed or not', () => {
    const { rerender } = render(
      <SidebarLayout>
        <SidebarLayout.Content>
          <SidebarLayout.Body>Contenido</SidebarLayout.Body>
        </SidebarLayout.Content>
      </SidebarLayout>
    );
    const expanded = getComputedStyle(screen.getByTestId('sidebar-layout-content')).marginLeft;

    rerender(
      <SidebarLayout>
        <SidebarLayout.Content isCollapsed>
          <SidebarLayout.Body>Contenido</SidebarLayout.Body>
        </SidebarLayout.Content>
      </SidebarLayout>
    );
    const collapsed = getComputedStyle(screen.getByTestId('sidebar-layout-content')).marginLeft;

    expect(expanded).not.toBe(collapsed);
  });
});

describe('SidebarLayout theming', () => {
  it('accepts CSS custom properties on the shell, which is how a runtime tenant theme arrives', () => {
    render(
      <SidebarLayout data-testid='shell' style={{ '--sui-sidebar-bg': '#1A237E' } as CSSProperties}>
        <SidebarLayout.Content>contenido</SidebarLayout.Content>
      </SidebarLayout>
    );
    expect(screen.getByTestId('shell')).toHaveStyle({ '--sui-sidebar-bg': '#1A237E' });
  });
});
