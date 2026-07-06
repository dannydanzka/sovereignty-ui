/**
 * GalleryScreen
 *
 * Living gallery of the sovereignty-ui RN-ready batch: tokens, primitives
 * (Div/Span), Badge, StatsCard, Avatar, EmptyState, Divider, Spacer,
 * InlineIcon, and the useNotifications hook — all rendered under Metro from
 * the local ../sovereignty-ui symlink.
 */

import { useState } from 'react';
import { ScrollView } from 'react-native';
import { Inbox, TrendingUp, Users } from 'lucide-react-native';

import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  DataTable,
  Divider,
  EmptyState,
  ImagePreviewModal,
  InlineIcon,
  Input,
  Modal,
  NotificationContainer,
  ProgressBar,
  SearchInput,
  Spacer,
  StatsCard,
  Textarea,
  Toggle,
  useNotifications,
} from '@dannydanzka/sovereignty-ui';

import type { SectionProps } from './GalleryScreen.interfaces';

import {
  Content,
  InlineLabel,
  Row,
  Screen,
  ScreenTitle,
  SectionCard,
  SectionTitle,
} from './GalleryScreen.styled';

const Section = ({ children, title }: SectionProps) => (
  <SectionCard>
    <SectionTitle>{title}</SectionTitle>
    {children}
  </SectionCard>
);

export const GalleryScreen = () => {
  const { notifications, notify, remove } = useNotifications({ autoDismissMs: 3000 });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [search, setSearch] = useState('');
  const [notes, setNotes] = useState('');
  const [agree, setAgree] = useState(false);
  const [wifi, setWifi] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const members = [
    { id: '1', name: 'Jane Doe', role: 'Admin' },
    { id: '2', name: 'John Ramírez', role: 'Editor' },
    { id: '3', name: 'Ada Lovelace', role: 'Owner' },
  ];

  return (
    <Screen>
      <ScrollView>
        <Content>
          <ScreenTitle>sovereignty-ui lab</ScreenTitle>

          <Section title='Badge — variants'>
            <Row>
              <Badge>default</Badge>
              <Badge variant='primary'>primary</Badge>
              <Badge variant='success'>success</Badge>
              <Badge variant='warning'>warning</Badge>
              <Badge variant='danger'>danger</Badge>
              <Badge variant='info'>info</Badge>
            </Row>
          </Section>

          <Section title='StatsCard — variants'>
            <StatsCard
              icon={<Users color='#FFFFFF' size={16} />}
              label='Active users'
              sublabel='+12% vs last week'
              value={1250}
              variant='primary'
            />
            <StatsCard
              icon={<TrendingUp color='#1B5E20' size={16} />}
              label='Revenue'
              value='$45K'
              variant='success'
            />
            <StatsCard label='Errors' value={3} variant='danger' />
          </Section>

          <Section title='Avatar — sizes'>
            <Row>
              <Avatar name='Jane Doe' size='sm' />
              <Avatar name='Jane Doe' size='md' />
              <Avatar name='John Ramírez' size='lg' />
              <Avatar name='Ada Lovelace' size='xl' />
            </Row>
          </Section>

          <Section title='Divider + Spacer + InlineIcon'>
            <Row>
              <InlineIcon>
                <Users color='#5B4FCF' size={16} />
              </InlineIcon>
              <InlineLabel>12 members online</InlineLabel>
            </Row>
            <Divider />
            <Spacer vertical='sm' />
            <InlineLabel>Content after a Divider and a Spacer</InlineLabel>
          </Section>

          <Section title='Button — variants'>
            <Row>
              <Button variant='primary' onClick={() => notify({ message: 'primary', type: 'success' })}>
                Primary
              </Button>
              <Button variant='secondary'>Secondary</Button>
              <Button variant='danger'>Danger</Button>
              <Button disabled variant='primary'>
                Disabled
              </Button>
            </Row>
          </Section>

          <Section title='Card'>
            <Card padding='medium'>
              <InlineLabel>A Card renders as a View on native; tap it below.</InlineLabel>
            </Card>
            <Card padding='medium' onClick={() => notify({ message: 'Card tapped', type: 'info' })}>
              <InlineLabel>Clickable Card (TouchableOpacity)</InlineLabel>
            </Card>
          </Section>

          <Section title='Alert — variants'>
            <Alert title='Heads up' variant='info'>
              An informational alert rendered on native primitives.
            </Alert>
            <Alert title='Saved' variant='success'>
              Everything went through.
            </Alert>
            <Alert title='Careful' variant='warning' onDismiss={() => notify({ message: 'dismissed', type: 'info' })}>
              This one is dismissable.
            </Alert>
          </Section>

          <Section title='ProgressBar'>
            <ProgressBar label='Upload' value={72} />
            <ProgressBar label='Storage' value={45} variant='warning' />
            <ProgressBar label='Complete' value={100} variant='success' />
          </Section>

          <Section title='Input / TextField (native TextInput)'>
            <Input
              id='email'
              label='Email'
              name='email'
              placeholder='you@example.com'
              type='email'
              value={email}
              onChange={setEmail}
            />
            <Input
              id='password'
              label='Password'
              name='password'
              placeholder='••••••••'
              type='password'
              value={password}
              onChange={setPassword}
            />
          </Section>

          <Section title='Checkbox + Toggle (native Pressable)'>
            <Checkbox checked={agree} label='I accept the terms' name='agree' onChange={setAgree} />
            <Toggle checked={wifi} label='Wi-Fi' name='wifi' onChange={setWifi} />
            <Toggle checked={agree} label='Small toggle' name='sm' size='sm' onChange={setAgree} />
          </Section>

          <Section title='SearchInput'>
            <SearchInput placeholder='Search members…' value={search} onChange={setSearch} />
          </Section>

          <Section title='Textarea (multiline)'>
            <Textarea
              label='Notes'
              maxLength={120}
              name='notes'
              placeholder='Write something…'
              showCount
              value={notes}
              onChange={setNotes}
            />
          </Section>

          <Section title='Modal (native RN Modal host)'>
            <Row>
              <Button variant='primary' onClick={() => setModalOpen(true)}>
                Open modal
              </Button>
              <Button variant='danger' onClick={() => setConfirmOpen(true)}>
                Confirm dialog
              </Button>
            </Row>
          </Section>

          <Section title='DataTable (native card list)'>
            <DataTable
              columns={[
                { header: 'Name', key: 'name' },
                { header: 'Role', key: 'role' },
              ]}
              data={members}
              rowActions={[
                {
                  icon: <Users color='#5B4FCF' size={16} />,
                  key: 'view',
                  onClick: (row) => notify({ message: row.name, title: 'Row', type: 'info' }),
                  title: 'View',
                },
              ]}
              rowKey={(row) => row.id}
              selectable
              selectedKeys={selectedRows}
              onSelectionChange={setSelectedRows}
            />
          </Section>

          <Section title='EmptyState'>
            <EmptyState
              icon={<Inbox color='#9E9E9E' size={28} />}
              message='Notifications you trigger above will appear here.'
              title='Nothing yet'
            />
          </Section>

          <Section title='useNotifications + NotificationContainer'>
            <Button variant='primary' onClick={() => notify({ message: 'Saved on native', title: 'Done', type: 'success' })}>
              Push a success notification
            </Button>
            <Badge variant='info'>{notifications.length} active (shown as toasts top-right)</Badge>
          </Section>

          <Section title='ImagePreviewModal'>
            <Button variant='secondary' onClick={() => setPreviewOpen(true)}>
              Open image preview
            </Button>
          </Section>
        </Content>
      </ScrollView>

      <Modal isOpen={modalOpen} title='Native modal' onClose={() => setModalOpen(false)}>
        <InlineLabel>
          This dialog is the RN Modal host wrapping sovereignty-ui surfaces. Tap outside is disabled;
          use the close button.
        </InlineLabel>
      </Modal>

      <Modal
        confirmText='Delete'
        isOpen={confirmOpen}
        message='This action cannot be undone.'
        title='Delete item?'
        variant='confirm'
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          notify({ message: 'Deleted', type: 'success' });
        }}
      />

      <ImagePreviewModal
        description='Rendered with the RN Image inside the Modal host.'
        imageUrl='https://picsum.photos/600/800'
        isOpen={previewOpen}
        title='Preview'
        onClose={() => setPreviewOpen(false)}
      />

      <NotificationContainer notifications={notifications} position='top-right' onClose={remove} />
    </Screen>
  );
};
