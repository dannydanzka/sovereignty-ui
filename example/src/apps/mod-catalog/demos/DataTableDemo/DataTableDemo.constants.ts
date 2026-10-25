/**
 * Rows and columns of the DataTable demo; native pages and sorts from outside the table.
 */

import type { DataTableColumn } from '@dannydanzka/sovereignty-ui';

import type { DemoMember } from './DataTableDemo.interfaces';

export const DEMO_MEMBERS: DemoMember[] = [
  { id: 'm1', name: 'María García', role: 'Participante' },
  { id: 'm2', name: 'José López', role: 'Admin' },
  { id: 'm3', name: 'Ana Torres', role: 'Participante' },
  { id: 'm4', name: 'Luis Hernández', role: 'Owner' },
  { id: 'm5', name: 'Sofía Ramírez', role: 'Participante' },
];

export const DEMO_COLUMNS: DataTableColumn<DemoMember>[] = [
  { header: 'Nombre', key: 'name', sortable: true },
  { header: 'Rol', key: 'role', sortable: true },
];

export const DEMO_PAGE_SIZE = 2;

export const SORT_KEY_NAME = 'name';
