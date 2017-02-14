import { browser, by, element, ExpectedConditions as ec } from 'protractor';

describe('App', () => {

  beforeEach(() => {
    browser.get('/');
  });

  it('should have a title', () => {
    let subject = browser.getTitle();
    let result = 'Independer Angular Starter';
    expect(subject).toEqual(result);
  });

  it('should have <home>', () => {
    let subject = element(by.css('app home')).isPresent();
    let result = true;
    expect(subject).toEqual(result);
  });

  it('Lazy route with API test should work', () => {
    let restTestLink = element(by.linkText('REST Test'));
    restTestLink.click();

    let subject = element(by.css('table tbody td'));

    const dataLoadTimeout = 1000;
    browser.wait(ec.presenceOf(subject), dataLoadTimeout);

    expect(subject.isPresent()).toBeTruthy();
  });

});

