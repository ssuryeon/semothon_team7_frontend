import Header from './Header';
import { ThemeProvider } from 'styled-components';
import {theme} from '../styles/theme';

export default {
  title: 'components/Header',
  component: Header,
};

export const Default = () => (
  <ThemeProvider theme={theme}>
    <Header name='헤더'/>
  </ThemeProvider>
);