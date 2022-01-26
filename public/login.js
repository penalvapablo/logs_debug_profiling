const submitBtn = document.querySelector('.submit')
const mailInput = document.querySelector('[name="mail"]')
const passwordInput = document.querySelector('[name="password"]')

submitBtn.addEventListener('click', async (e)=>{  
  e.preventDefault()
  const mail = mailInput.value
  const password = passwordInput.value
  const res = await fetch('http://localhost:8080/login', {
    method = 'POST',
    body: {
      mail,
      password
    }
  })
  const data = await res.json()

  await fetch('http://localhost:8080/')
  console.log(data)
  // window.location.pathname = '/registro'
})