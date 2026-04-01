import {Container} from './Container';
import { ThemeProvider } from 'styled-components';
import {theme} from '../styles/theme';

export default {
  title: 'components/Container',
  component: Container,
};

export const Default = () => <Container>container</Container>;