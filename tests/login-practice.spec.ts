import { test} from '@playwright/test';
import { validUser, getLoginURL } from '../test-data';

test ("test data is wired correctly", async()=> {
    const { email, password } = validUser;
    console.log("URL:", getLoginURL("staging"));
    console.log("Email:", email);
    console.log("Password:", password);
});