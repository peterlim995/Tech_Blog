const newBlgHandler = async (event) => {
    event.preventDefault();
  
    const title = document.querySelector('#blog-title').value.trim();
    const content = document.querySelector('#content').value.trim();
      
    if (title && content) {
      
      const blog_id = window.location.pathname.split('/').reverse()[0];

      const response = await fetch(`/api/blog/${blog_id}`, {
        method: 'PUT',
        body: JSON.stringify({ title, content }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      // console.log("id",blog.id);
      if (response.ok) {
        document.location.replace(`/blog/${blog_id}`);
      } else {
        alert('Failed to update blog');
      }
    }
  };

  document
  .querySelector('.edit-blog-form')
  .addEventListener('submit', newBlgHandler);