const add = (a,b) => a + b;

test('should add two numbers', () => {
    const reasult = add(3,4)
    expect(reasult).toBe(7);
})