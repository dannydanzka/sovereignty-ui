/**
 * GalleryScreen
 *
 * Living gallery of the sovereignty-ui RN-ready batch: tokens, primitives
 * (Div/Span), Badge, StatsCard, Avatar, EmptyState, Divider, Spacer,
 * InlineIcon, and the useNotifications hook — all rendered under Metro from
 * the local ../sovereignty-ui symlink.
 */

import { ScrollView } from 'react-native';
import { Inbox, TrendingUp, Users } from 'lucide-react-native';

import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Divider,
  EmptyState,
  InlineIcon,
  ProgressBar,
  Spacer,
  StatsCard,
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
  const { notifications, notify } = useNotifications({ autoDismissMs: 3000 });

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

          <Section title='EmptyState'>
            <EmptyState
              icon={<Inbox color='#9E9E9E' size={28} />}
              message='Notifications you trigger above will appear here.'
              title='Nothing yet'
            />
          </Section>

          <Section title='useNotifications (hook queue)'>
            <Button variant='primary' onClick={() => notify({ message: 'Saved on native', title: 'Done', type: 'success' })}>
              Push a success notification
            </Button>
            {notifications.map((notification) => (
              <Badge key={notification.id} variant='success'>
                {notification.title ?? 'ok'}: {notification.message}
              </Badge>
            ))}
          </Section>
        </Content>
      </ScrollView>
    </Screen>
  );
};
