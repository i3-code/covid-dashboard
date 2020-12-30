import { render, screen } from '@testing-library/react';
import App from './App';
import News from './components/Footer/News/News';
import Map from './components/Center/Map/Map';
import Carousel from './components/Nav/Carousel/Carousel';

const loadingString = 'Loading...';
const loadingSnapshot = `
<div>
  Loading...
</div>`;

test('render app\'s header', () => {
  render(<App />);
  const appHeader = screen.getByText(/covid-19 dashboard/i);
  expect(appHeader).toBeInTheDocument();
});

test('render app\'s footer', () => {
  render(<App />);
  const appFooter = screen.getByText(/, 2020/i);
  expect(appFooter).toBeInTheDocument();
});

test('render news', () => {
  const { container, getByText } = render(<News />);
  expect(getByText(loadingString)).toBeInTheDocument();
  expect(container.firstChild).toMatchSnapshot(loadingSnapshot);
});

test('render map', () => {
  const app = {
    state: {sortIndex: 0},
  }
  const { container, getByText } = render(<Map app={app} />);
  expect(getByText(loadingString)).toBeInTheDocument();
  expect(container.firstChild).toMatchSnapshot(loadingSnapshot);
});


test('render Carousel with custom mode name', () => {
  const testChangeMode = (value) => value;
  const modeName = 'testMode';
  const { container, getByText } = render(<Carousel changeMode={testChangeMode} modeName={modeName} />);
  expect(getByText(modeName)).toBeInTheDocument();
  expect(container.firstChild).toHaveAttribute('class');
});
