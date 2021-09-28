const rules = require('../src/rules');

it('test rules', () => {
  const fn = rules.find('/userfiles/009/334/225/85338!Background.jpg');

  expect(fn.rule.example_input).toBe('/userfiles/009/334/225/85338!Background.jpg');
});
