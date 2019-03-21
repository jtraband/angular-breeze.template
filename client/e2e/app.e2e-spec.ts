import { ScClientPage } from './app.po';

describe('sc-client App', () => {
  let page: ScClientPage;

  beforeEach(() => {
    page = new ScClientPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
