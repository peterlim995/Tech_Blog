
const buttonHandler = async (event) => {
  // console.log('hit the button');
  // console.log('Event', event);
  if (event.target.hasAttribute('data-id')) {
    const id = event.target.getAttribute('data-id');
    const btnFunction = event.target.getAttribute('data-function');
    console.log('data-id: ',id);
    console.log('data-function: ',btnFunction);

    if (btnFunction === 'delete') {
      const delOk = confirm("Do you want to delete the blog?");
      if (delOk) {
        const response = await fetch(`/api/blog/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          document.location.replace('/dashboard');
        } else {
          alert('Failed to delete blog');
        }
      }
    } else if (btnFunction === 'edit') {        
          document.location.replace(`/blog/edit/${id}`);      
    }
  }
}


document
  .querySelector('.blog-list')
  .addEventListener('click', buttonHandler);
