const assert = require('chai').assert;
const getUserByEmail = require('../helperFunctions').getUserByEmail;

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', ()  => {
  it('should return a user with valid email', () => {

    const user = getUserByEmail(testUsers, "user@example.com");
    const expectedOutput = "userRandomID";
    assert.strictEqual(user.id, expectedOutput);
  });
  it('should return false when passed invalid email', () => {
    const user = getUserByEmail(testUsers, "user@examwple.com");
    const expectedOutput = false;
    assert.strictEqual(user, expectedOutput);
  });
  it('should return the user object that matches with the valid email', () => {
    const user = getUserByEmail(testUsers, "user2@example.com");
    const expectedOutput = testUsers.user2RandomID;
    assert.deepEqual(user, expectedOutput);
  });
});