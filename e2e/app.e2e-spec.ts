import { CodeLineCountPage } from './app.po';

describe('code-line-count App', () => {
  let page: CodeLineCountPage;

  beforeEach(() => {
    page = new CodeLineCountPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
