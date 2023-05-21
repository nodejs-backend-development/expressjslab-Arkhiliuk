const axios = require('axios');
const { getComments, addComment } = require('../controllers/comments.controller.js');

jest.mock('axios');

describe('getComments', () => {
  it('should return the comments for a given post', async () => {
    const postID = 18525;
    const comments = [      { id: 24500, post_id: postID, name: 'Suryakant Asan', email: 'suryakant_asan@schroeder.example', body: 'Sit fugiat suscipit. Qui labore dolor. Natus sint vel.' },      { id: 24499, post_id: postID, name: 'Vimal Pothuvaal', email: 'pothuvaal_vimal@dibbert.example', body: 'Et consectetur nulla. Dolor corporis voluptates. Ut et consequatur.' },    ];
    axios.get.mockResolvedValueOnce({ data: comments });

    const req = { params: { postID } };
    const res = { json: jest.fn() };

    await getComments(req, res);

    expect(axios.get).toHaveBeenCalledWith(`https://gorest.co.in/public/v2/posts/${postID}/comments`);
    expect(res.json).toHaveBeenCalledWith(comments);
  });

  it('should handle a 404 error', async () => {
    const postID = 12345;
    axios.get.mockRejectedValueOnce({ response: { status: 404 } });

    const req = { params: { postID } };
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

    await getComments(req, res);

    expect(axios.get).toHaveBeenCalledWith(`https://gorest.co.in/public/v2/posts/${postID}/comments`);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith('Post not found.');
  });

  it('should handle other errors', async () => {
    const postID = 67890;
    const error = new Error('Something went wrong');
    axios.get.mockRejectedValueOnce(error);

    const req = { params: { postID } };
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

    await getComments(req, res);

    expect(axios.get).toHaveBeenCalledWith(`https://gorest.co.in/public/v2/posts/${postID}/comments`);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Error fetching data from https://gorest.co.in/');
  });
});

describe('addComment', () => {
  it('should return a 400 status if any required fields are missing', async () => {
    const req = {
      params: {
        postID: '123',
      },
      body: {
        id: 1,
        email: 'test@test.com',
        body: 'Test comment',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await addComment(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Missing required fields' });
  });

  it('should return a 500 status if there is an error and log the error message', async () => {
    const req = {
      params: {
        postID: '123',
      },
      body: {
        id: 1,
        name: 'Test User',
        email: 'test@test.com',
        body: 'Test comment',
      },
    };
    const error = new Error('Something went wrong');
    axios.post.mockRejectedValue(error);
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    await addComment(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Something went wrong');
    expect(consoleSpy).toHaveBeenCalledWith(error);
    consoleSpy.mockRestore();
  });

  it('should return the comment data with a 200 status if successful', async () => {
    const req = {
      params: {
        postID: '123',
      },
      body: {
        id: 1,
        name: 'Test User',
        email: 'test@test.com',
        body: 'Test comment',
      },
    };
    const response = {
      data: {
        id: 1,
        name: 'Test User',
        email: 'test@test.com',
        body: 'Test comment',
      },
    };
    axios.post.mockResolvedValue(response);
    const res = {
      json: jest.fn(),
    };
    await addComment(req, res);
    expect(res.json).toHaveBeenCalledWith(response.data);
  });

  it('should include an Authorization header in the axios request', async () => {
    const req = {
      params: {
        postID: '123',
      },
      body: {
        id: 1,
        name: 'Test User',
        email: 'test@test.com',
        body: 'Test comment',
      },
    };
    const response = {
      data: {
        id: 1,
        name: 'Test User',
        email: 'test@test.com',
        body: 'Test comment',
      },
    };
    axios.post.mockResolvedValue(response);
    const res = {
      json: jest.fn(),
    };
    await addComment(req, res);
    expect(axios.post).toHaveBeenCalledWith(
      'https://gorest.co.in/public/v2/posts/123/comments',
      expect.objectContaining({}),
      {
        headers: expect.objectContaining({
          Authorization: 'Bearer f94805851c833c21c601868440ac120836c845510e79f129affa5dde3a38c2d1',
          'Content-Type': 'application/json',
        }),
      },
    );
  });
});