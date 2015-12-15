describe('Original Sound Track', function() {
  it('has a title', function() {
    browser.get('http://localhost:8080');

    expect(browser.getTitle()).toEqual('Original Sound Track');
  });
});