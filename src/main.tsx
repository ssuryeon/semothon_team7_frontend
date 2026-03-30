import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ThemeProvider } from 'styled-components'

const theme = {
  bgColor: '#B9D3EA',
  btnColor: '#2A3247',
  ContentColor: '#D8E6F3',
  BorderColor: '#A3C0DA',
  Yellow1: '#E8D871',
  Yellow2: '#FFF195',
  WhiteText: '#F5F3E5',
  GreyText: 'rgba(42, 50, 71, 0.5)',
  white: '#FFF',
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
