import { test, expect } from "@playwright/test";

let authToken: string

test.beforeAll('Run Before All', async ( {request} ) => {
  
console.log('This is executed before all tests')
 const tokenResponse = await request.post(
    "https://conduit-api.bondaracademy.com/api/users/login",
    {
      data: {
        user: {
          email: "jpqa@test.com",
          password: "Piano123"
        }
      }
    }
  );

  const tokenResponseJSON = await tokenResponse.json();
  authToken = 'Token ' + tokenResponseJSON.user.token;

})


test("GET Test Tags", async ({ request }) => {
  const tagsResponse = await request.get(
    "https://conduit-api.bondaracademy.com/api/tags",
  );
  const tagsResponseJSON = await tagsResponse.json();

  expect(tagsResponse.status()).toEqual(200);
  expect(tagsResponseJSON.tags[0]).toEqual("Test");
  expect(tagsResponseJSON.tags.length).toBeLessThanOrEqual(10);
});

test("GET All Articles", async ({ request }) => {
  const articlesResponse = await request.get(
    "https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0",
  );
  const articlesResponseJSON = await articlesResponse.json();

  expect(articlesResponse.status()).toEqual(200);
  expect(articlesResponseJSON.articles.length).toBeLessThanOrEqual(10);
  expect(articlesResponseJSON.articlesCount).toEqual(10);
});

test("Create and Delete Article", async ({ request }) => {
 
  const newArticleResponse = await request.post(
    "https://conduit-api.bondaracademy.com/api/articles/",
    {
      data: {
        article: {
          title: "TestPostman TWO",
          description: "Test Postman Description",
          body: "Test psotman cool body",
          tagList: ["cool"]
        }
      },
      headers: {
        Authorization: authToken
      }
    }
  )
  const newArticleResponseJSON = await newArticleResponse.json();
  expect(newArticleResponse.status()).toEqual(201)
  expect(newArticleResponseJSON.article.title).toEqual('TestPostman TWO')
  const slugId = newArticleResponseJSON.article.slug

  const articlesResponse = await request.get(
    "https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0", {
      headers: {
        Authorization: authToken
      }
    }
  );
  const articlesResponseJSON = await articlesResponse.json();
  expect(articlesResponse.status()).toEqual(200)
  expect(articlesResponseJSON.articles[0].title).toEqual('TestPostman TWO')

  const deleteArticleResponse = await request.delete(
    `https://conduit-api.bondaracademy.com/api/articles/${slugId}`, {
    headers: {
      Authorization: authToken
    }
  }
  );

  expect(deleteArticleResponse.status()).toEqual(204)

});

test("Create, Update and Delete Article", async ({ request }) => {

  const newArticleResponse = await request.post(
    "https://conduit-api.bondaracademy.com/api/articles/",
    {
      data: {
        article: {
          title: "Test New Article",
          description: "Test New Postman Description",
          body: "Test psotman cool body",
          tagList: []
        }
      },
      headers: {
        Authorization: authToken
      }
    }
  )
  const newArticleResponseJSON = await newArticleResponse.json();
  expect(newArticleResponse.status()).toEqual(201)
  expect(newArticleResponseJSON.article.title).toEqual('Test New Article')
  const slugId = newArticleResponseJSON.article.slug

  const updateArticleResponse = await request.put(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`, {
    data: {
        article: {
          title: "Test New Article Modfied",
          description: "Test New Modified Postman Description",
          body: "Test psotman cool body",
          tagList: []
        }
      },
      headers: {
        Authorization: authToken
      }
  })

  const updateArticleResponseJSON = await updateArticleResponse.json()
  expect(updateArticleResponse.status()).toEqual(200)
  expect(updateArticleResponseJSON.article.title).toEqual('Test New Article Modfied')
  const  newSlugId = updateArticleResponseJSON.article.slug

  const articlesResponse = await request.get(
    "https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0", {
      headers: {
        Authorization: authToken
      }
    }
  );
  const articlesResponseJSON = await articlesResponse.json();
  expect(articlesResponse.status()).toEqual(200)
  expect(articlesResponseJSON.articles[0].title).toEqual('Test New Article Modfied')

  const deleteArticleResponse = await request.delete(
    `https://conduit-api.bondaracademy.com/api/articles/${newSlugId}`, {
    headers: {
      Authorization: authToken
    }
  }
  );

  expect(deleteArticleResponse.status()).toEqual(204)

});
