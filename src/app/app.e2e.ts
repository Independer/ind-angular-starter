import { browser, by, element } from 'protractor';

describe('App', () => {

  beforeEach(() => {
    browser.get('/');
  });

  it('should have a title', () => {
    let subject = browser.getTitle();
    let result = 'IndependerStarter';
    expect(subject).toEqual(result);
  });

  it('should have <home>', () => {
    let subject = element(by.css('app home')).isPresent();
    let result = true;
    expect(subject).toEqual(result);
  });

});

