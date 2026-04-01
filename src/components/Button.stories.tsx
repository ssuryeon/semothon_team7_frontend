import Button from './Button';
import { ThemeProvider } from 'styled-components';
import {theme} from '../styles/theme';

export default {
  title: 'components/Button',
  component: Button,
};

export const Default = () => (
  <ThemeProvider theme={theme}>
    <Button text='버튼' />
  </ThemeProvider>
);