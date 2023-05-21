const axios = require('axios');

const getComments = async (req, res) => {
  const { postID } = req.params;
  try {
    const response = await axios.get(`https://gorest.co.in/public/v2/posts/${postID}/comments`);
    res.json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.status(404).send('Post not found.');
    } else {
      res.status(500).send('Error fetching data from https://gorest.co.in/');
    }
  }
};

const addComment = async (req, res) => {
  const { postID } = req.params;
  const { id, name, email, body } = req.body;

  const postIDInt = parseInt(postID);

  if (!id || !name || !email || !body) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const comment = {
    id,
    post_id: postIDInt,
    name,
    email,
    body,
  };

  const headers = {
    Authorization: 'Bearer f94805851c833c21c601868440ac120836c845510e79f129affa5dde3a38c2d1',
    'Content-Type': 'application/json',
  };

  try {
    const response = await axios.post(`https://gorest.co.in/public/v2/posts/${postID}/comments`, comment, { headers });
    res.json(response.data);
  } catch (error) {
    console.log(error);
    if (error.response && error.response.status === 401) {
      console.log('Authorization wrong');
    }
    res.status(500).send(error.message);
  }
};

module.exports = {
  getComments,
  addComment,
};
