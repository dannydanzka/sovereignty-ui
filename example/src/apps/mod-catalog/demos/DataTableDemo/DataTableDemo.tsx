/**
 * DataTable: the native card list, with selection, a row action, sort and paging driven from outside.
 */

import { Eye } from 'lucide-react-native';

import { Button, DataTable } from '@dannydanzka/sovereignty-ui';

import { DEMO_COLUMNS, SORT_KEY_NAME } from './DataTableDemo.constants';
import { DemoCaption, DemoRow, DemoSection } from '../../presentation/components';
import { useDataTableDemo } from './hooks/useDataTableDemo';

export const DataTableDemo = () => {
  const { handleSort, pagination, rows, selectedKeys, setSelectedKeys, sort } = useDataTableDemo();

  return (
    <DemoSection title='Selección, orden y páginas'>
      <DemoRow>
        <Button onClick={() => handleSort(SORT_KEY_NAME)} size='sm' variant='secondary'>
          {`Nombre ${sort?.direction ?? ''}`}
        </Button>
        <Button disabled={!pagination.hasPrev} onClick={pagination.goToPrev} size='sm'>
          Anterior
        </Button>
        <Button disabled={!pagination.hasNext} onClick={pagination.goToNext} size='sm'>
          Siguiente
        </Button>
      </DemoRow>
      <DataTable
        columns={DEMO_COLUMNS}
        data={rows}
        onSelectionChange={setSelectedKeys}
        rowActions={[
          { icon: <Eye size={16} />, key: 'view', onClick: () => undefined, title: 'Ver' },
        ]}
        rowKey={(row) => row.id}
        selectable
        selectedKeys={selectedKeys}
      />
      <DemoCaption>{`Página ${pagination.currentPage} de ${pagination.totalPages} · ${selectedKeys.length} seleccionados`}</DemoCaption>
    </DemoSection>
  );
};
