const retries: number = "five";  //  The retries type is set to number, but a string is assigned.
const user = { email: "john@test.com" };
//object user only has one property -  email . 
// An error occurred when attempting to access a nonexistent password property.
console.log(user.password);      