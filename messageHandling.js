window.addEventListener('message', (event) => {
    console.log('message recieved: ', event)
  
    if (event.data ==='takeImage'){
      console.log('take image message recv in iframe');
  
      let canvas = document.getElementById('jeeFaceFilterCanvas')
      //let canvasDataURL = canvas.toDataURL();
  
      canvas.toBlob((blob) => {
        const messageToPost = {
          id: 'iframeImage', 
          data: blob
        }
    
        window.parent.postMessage(messageToPost, '*')
      })
    }
  })
  

