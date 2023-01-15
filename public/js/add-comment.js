const newCommentHandler = async (event) => {
  event.preventDefault();

  const comment = document.querySelector('#comment').value.trim();
  console.log('comment: ', comment);

  const blog_id = window.location.pathname.split('/').reverse()[0];

  try {
    if (comment) {
      const response = await fetch(`/api/blog/comment`, {
        method: 'POST',
        body: JSON.stringify({
          blog_id,
          comment
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // alert('response ok');
        document.location.reload();
      } else {
        alert('Failed to create comment');
      }
    }
  } catch (err) {
    console.error(err);
  }
};

document
  .querySelector('.new-comment-form')
  .addEventListener('submit', newCommentHandler);