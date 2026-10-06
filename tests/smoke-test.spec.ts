import { test } from '../utils/fixtures'


test('First test', async ({api}) => {

    api
        .url('https://conduit-api.bondaracademy.com/api')
        .path('/articles')
        .params({limit:10, offset:0})
        .headers({Authorization: 'authToken'})
        .body({"user": {"email": "jpqa@test.com", "password": "Piano123"}})
 
})