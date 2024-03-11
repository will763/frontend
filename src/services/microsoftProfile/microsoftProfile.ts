export async function getMicrosoftProfile(token: string, idToken: string) {

  try {
    const response = await fetch(`https://graph.microsoft.com/v1.0/users('${idToken}')/photo`, {
    method: 'POST',
    headers: {
      "Content-type": "image/jpeg",
      Authorization: `Bearer ${token}`
    }
  })

  const data = await response.json();

  console.log(data)
  } catch (error) {
    console.log(error)
  }

  


}